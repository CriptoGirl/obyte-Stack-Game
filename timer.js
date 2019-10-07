// Obyte imports (libraries)
const device = require('ocore/device.js');
const db = require('ocore/db');
// Game imports (modules)
const game = require('./conf_game.js');
const toPlay = require('./toPlay.js');

// ** user messages from the timer function ** //
function gameStatusMessages(remainingTime, amount, leader, author) {
  // get device addresses of all users
  db.query(`SELECT user_device, user_wallet, user_status FROM xwf_stack_game_user`,
    [], userRows => {
    userRows.forEach(userRow => {
      // if time ran out, broadcast Game Finished message to all
      if (remainingTime === 0) {  // time ran out
        let potAmount = amount - amount * game.commissionRate / 100;

        // when Game is finished, broadcast Game Finished message to all active users
        if (userRow.user_status === 'active') {  // user wants to receive notifications
          device.sendMessageToDevice(userRow.user_device, 'text',
            '********** GAME IS FINISHED **********');
          device.sendMessageToDevice(userRow.user_device, 'text',
            'Estimated Pot size was ' + potAmount + ' bytes.');
          device.sendMessageToDevice(userRow.user_device, 'text',
            `Invite others to play by sharing this Bot's Pairing Code: ` +
            game.botPairingCode);
        } // user wants to receive notifications

        // tell the winner/initiator of the game, they won
        if (userRow.user_wallet === leader || userRow.user_wallet === author ) {
          device.sendMessageToDevice(userRow.user_device, 'text',
            '********** Congratulations! **********');
          if (leader === author)
            device.sendMessageToDevice(userRow.user_device, 'text',
              'As the initiator and the winner of the game, you have won an entire ' +
              'estimated Pot of ' + potAmount + ' bytes, subject to sucessful confirmations by the AA.');
          else if (userRow.user_wallet === author)
            device.sendMessageToDevice(userRow.user_device, 'text',
              'As the initiator of the game, you have won 50% of an estimated Pot of '
              + potAmount + ' bytes, subject to sucessful confirmations by the AA.');
          else
            device.sendMessageToDevice(userRow.user_device, 'text',
              'As the winner of the game, you have won 50% of an estimated Pot of '
              + potAmount + ' bytes, subject to sucessful confirmations by the AA.');
        } // tell the winner/initiator of the game, they won

        // ask all active users to play a new Game
        if (userRow.user_status === 'active') {
          device.sendMessageToDevice(userRow.user_device, 'text',
            '************* PLAY AGAIN *************');
          toPlay.newGame(userRow.user_device);
        }
        else
          device.sendMessageToDevice(userRow.user_device, 'text',
            'Type START at any time to play another game.');
      }  // time ran out

      else {  // game timer is running
        // broadcast pot size and time remaining to all active users
        if (userRow.user_status === 'active') {  // user wants to receive notifications
          let potAmount = amount - amount * game.commissionRate / 100;
          device.sendMessageToDevice(userRow.user_device, 'text',
            remainingTime/1000 + ' sec left. Pot size is ' + potAmount + ' bytes.');
          //  remainingTime/1000 + ' sec left. Pot size is ' + amount + ' bytes.');
          // if user is not in the lead, ask for payment
          if (userRow.user_wallet !== leader) toPlay.nextBid(userRow.user_device);
        } // user wants to receive notifications
      } // game tiemr is running

    });  // for each user
  }); // db query
}

exports.gameStatusMessages = gameStatusMessages;
