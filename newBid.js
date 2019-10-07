// Obyte imports (libraries)
const device = require('ocore/device.js');
const db = require('ocore/db');
// Game imports (modules)
const game = require('./conf_game.js');
const toPlay = require('./toPlay.js');

// ** validate the bid and inform the users ** //
function validateAndNotify(unitAuthorWallet, unitAmount) {
  // ** Talk to user who sent the bid ** //
  // get user device address of the user who sent the bid
  db.query(`SELECT user_device FROM xwf_stack_game_user WHERE user_wallet=?`,
    [unitAuthorWallet], userRows => {
      if (userRows.length === 0) console.log('User device not found for user walelt ' + unitAuthorWallet);
      else userRows.forEach(userRow => {
        let userDevice = userRow.user_device
        if (unitAmount < game.minBidAmount) {  // user bid is too small
          device.sendMessageToDevice(userDevice, 'text',
            'Your bid of ' + unitAmount +' bytes is less than required amount. ' +
            'It will be rejected by the ' + game.aaName + ' Make a minimum payment of ' +
            game.minBidAmount + ' bytes, for your chance to win.');
          toPlay.nextBid(userDevice);
        }
        else { // bid is valid
          device.sendMessageToDevice(userDevice, 'text',
            'Your payment of ' + unitAmount + ' bytes has been received by the ' +
            game.aaName + ' and will be added to the Game Stack once confirmed.');
        }
      });
  });  // db query to get device of user who sent the bid

  // ** Tell all other active users about a valid bid ** //
  if (unitAmount >= game.minBidAmount) {  // valid bid
    db.query(`SELECT user_device FROM xwf_stack_game_user
      WHERE user_wallet!=? AND user_status!='sleeping'`,
      [unitAuthorWallet], otherUsers => {
        if (otherUsers.length > 0 ) {
          otherUsers.forEach(otherUser => { // for each row
            let otherUserDevice = otherUser.user_device;
            device.sendMessageToDevice(otherUserDevice, 'text',
              '************** NEW BID **************');
            device.sendMessageToDevice(otherUserDevice, 'text',
              'A bid of ' + unitAmount + ' bytes has just been received by the ' +
              game.aaName + ' from another player and will be added to the overall pot once confirmed.');
            toPlay.nextBid(otherUserDevice);
          }); // for each row
        }
    });  // get user devices
  } // tell all other users about a valid bid
}

exports.validateAndNotify = validateAndNotify;
