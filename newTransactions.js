// Obyte imports (libraries)
const db = require('ocore/db');
const device = require('ocore/device.js');
// Game imports (modules)
const game = require('./conf_game.js');
const newBid = require('./newBid.js');
const newTxnsUtils = require('./newTxnsUtils.js');
//const toPlay = require('./toPlay.js');
const timer = require('./timer.js');
const aaCommand = require('./aaCommand');
// Game variables
let remainingTime, gameTimer;
let amount, leader, author;

function newTransactions(arrUnits) {
  // for each new transaction unit
  for(let i=0; i<arrUnits.length; i++) {
    let unit = arrUnits[i];
    db.query(`SELECT 1 FROM unit_authors WHERE unit=?AND address=?`,
      [unit, game.aaAddress], outboundTxn => {
        //if (outboundTxn.length === 1) // outbound Transaction

        if (outboundTxn.length === 0) {  // inbound Transaction
          // ** Get the bid details from the unit ** //
          let unitAmount = '';
          let unitUserWalletAddress = '';
          db.query("SELECT address, amount, asset FROM outputs WHERE unit=?", [unit], rows => {
            rows.forEach(row => {
              if (row.asset === null) {  // assets are in bytes
                if (row.address === game.aaAddress) unitAmount = row.amount;
                else unitUserWalletAddress = row.address;
              }
            });

            // ** Validate the bid and inform the users ** //
            newBid.validateAndNotify(unitUserWalletAddress, unitAmount);

            // update the db with valid bid
            if (unitAmount >= game.minBidAmount) {  // valid bid
              // check db for an active game
              db.query(`SELECT game_id, game_status, game_amount, game_author, game_leader
                FROM xwf_stack_game WHERE game_status='started' OR game_status='running'`,
                gameRows => {
                  if (gameRows.length > 1) console.log('Error: more than 1 current game');
                  else if (gameRows.length === 0) { // no active game, start the game
                    newTxnsUtils.saveNewGame(unitUserWalletAddress, unitAmount);
                  }
                  else {  // game is running, update game
                    let gameRow = gameRows[0];
                    let gameId = gameRow.game_id;
                    amount = gameRow.game_amount + unitAmount;;
                    leader = unitUserWalletAddress;
                    author = gameRow.game_author;
                    // update game
                    newTxnsUtils.updateGame(gameId, leader, amount);
                    // start Timer
                    clearInterval(gameTimer);
                    remainingTime = game.gameDuration;
                    gameTimer = setInterval(clock, game.notificationFrequency);
                  }  // game is running, update game
              });  // check if there is an active game
            } // update the db with valid bid
          });  // get the bid details from the unit
        } // inbound Transaction
    }); // db
  }  // for each new transaction unit
}

function clock() {
  // tick-tock
  remainingTime = remainingTime - game.notificationFrequency;
  // inform users of the game status, e.g. running or stopped. Pot size, Time, Winners
  timer.gameStatusMessages(remainingTime, amount, leader, author);
  // game is over
  if (remainingTime === 0) {
    clearInterval(gameTimer);
    // close current lottery to new bids
    db.query(`UPDATE xwf_stack_game SET game_status='closed'
      WHERE game_status='running'`);
    aaCommand.stopTheGame(); // TELL AA TO STOP
  }
}

exports.newTransactions = newTransactions;
