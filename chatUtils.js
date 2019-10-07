// Obyte imports (libraries)
const db = require('ocore/db');
const device = require('ocore/device.js');
// Game imports (modules)
const toPlay = require('./toPlay.js');

function saveUserAddress(device_address, wallet_address) {
  db.query(`INSERT INTO xwf_stack_game_user (user_device, user_wallet, user_status)
    VALUES (?,?,?)`, [device_address, wallet_address, 'active']);
  device.sendMessageToDevice(device_address, 'text', 'Your address is saved');
  toPlay.stackGame(device_address, wallet_address);  // ask user to play
}

function notificationsSuspended(device_address) {
  device.sendMessageToDevice(device_address, 'text', 'Notifications suspended. ' +
    'Type START at anytime to start recieving game notifications and to play.');
}

function updateUserStatus(newStatus, user_wallet, user_device) {
  db.query(`UPDATE xwf_stack_game_user SET user_status=?
    WHERE user_wallet=?`, [newStatus, user_wallet]);
  if (newStatus === 'sleeping') notificationsSuspended(user_device);
  if (newStatus === 'active') toPlay.stackGame(user_device, user_wallet);
}

exports.saveUserAddress = saveUserAddress;
exports.notificationsSuspended = notificationsSuspended;
exports.updateUserStatus = updateUserStatus;
