// Obyte imports (libraries)
const validationUtils = require('ocore/validation_utils');
const db = require('ocore/db');
const device = require('ocore/device.js');
// Game imports (modules)
const chatUtils = require('./chatUtils.js');
const toPlay = require('./toPlay.js');

function chatting(from_address, text) {
  db.query(`SELECT user_wallet, user_status FROM xwf_stack_game_user WHERE user_device=?`,
    [from_address], userRows => {

      // ** NO user address is found in the db ** //
      if (userRows.length === 0) {
        // ** User entered valid address ** //
        if (validationUtils.isValidAddress(text)) chatUtils.saveUserAddress(from_address, text);
        // ** No valid address was provided ** //
        else device.sendMessageToDevice(from_address, 'text', "Please send me your address");
      }

      // ** User address is found in the db ** //
      else {
        let row = userRows[0];
        // ** User entered valid wallet address **//
        if (validationUtils.isValidAddress(text)) {
          if (row.user_wallet === text)
            device.sendMessageToDevice(from_address, 'text',
              "Thank you. We alredy have this address for you.");
          else
            device.sendMessageToDevice(from_address, 'text',
              "Hm, we have different wallet address for you in our records. " +
              "The address we have is " + row.user_wallet);
        }

        // ** User is active ** //
        if (row.user_status !== 'sleeping') {
          // ** User asked to suspend notifications
          if (text.toUpperCase() === 'STOP')
            chatUtils.updateUserStatus('sleeping', row.user_wallet, from_address);
          // ** ask user to play ** //
          else toPlay.stackGame(from_address, row.user_wallet);
        }

        // ** User is sleeping but asked to play ** //
        else if (text.toUpperCase() === 'START')
          chatUtils.updateUserStatus('active', row.user_wallet, from_address);

        // ** User is sleeping but started talking to the bot ** //
        else chatUtils.notificationsSuspended(from_address);

      } // user address was found in the db
  });
}

exports.chatting = chatting;
