// Obyte imports (libraries)
const device = require('ocore/device.js');
const db = require('ocore/db');
// Game imports (modules)
const game = require('./conf_game.js');

function stackGame(device_address, wallet_address) {
  // check if there is an active game
  //db.query(`SELECT game_status, game_amount, game_author, game_leader
  db.query(`SELECT game_status, game_leader
    FROM xwf_stack_game WHERE game_status='started' OR game_status='running'`,
    gameRows => {
      if (gameRows.length === 0) newGame(device_address); // no game found
      //else if (gameRows.length === 1) nextBid(device_address);
      else if (gameRows.length === 1) { // game is running
        let gameRow = gameRows[0];
        if (gameRow.game_leader !== wallet_address) nextBid(device_address);
      } // game is running
      else console.log('Error: more than one current game found.');
  });
}

function nextBid(device_address) {
  //device.sendMessageToDevice(device_address, 'text',
  //  'Game is running! Send ' + game.minBidAmount + ' bytes to play.');
  device.sendMessageToDevice(device_address, 'text',
    '[balance](byteball:' + game.aaAddress + '?amount=' + game.minBidAmount + ')');
}

function newGame(device_address) {
  device.sendMessageToDevice(device_address, 'text', 'Send ' + game.minBidAmount +
    ' bytes to start a new Game.  Type STOP to stop playing at any time.');
  device.sendMessageToDevice(device_address, 'text',
    'If you are confirmed as the initiator of the new Game by the AA, you will ' +
    'automatically receive 50% of the winnings.');
  device.sendMessageToDevice(device_address, 'text', '[balance](byteball:' + game.aaAddress + '?amount=' + game.minBidAmount + ')');
}

exports.nextBid = nextBid;
exports.newGame = newGame;
exports.stackGame = stackGame;
