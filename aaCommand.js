// Obyte imports (libraries)
const network = require('ocore/network.js');
const composer = require('ocore/composer.js');
const objectHash = require('ocore/object_hash.js');
const device = require('ocore/device.js');
const headlessWallet = require('headless-obyte');
// Game imports (modules)
const game = require('./conf_game.js');

function stopTheGame() {
  let dataFeed = {};
  dataFeed.command = 'Stop';
  var opts = {
    paying_addresses: [game.botWallet],
    change_address: game.botWallet,
    messages: [
        {
            app: "data_feed",
            payload_location: "inline",
            payload_hash: objectHash.getBase64Hash(dataFeed),
            payload: dataFeed
        }
    ],
    to_address: game.aaAddress,
    amount: 10000
  };
  headlessWallet.sendMultiPayment(opts, (err, unit) => {
    if (err){
      //console.log('Error paying winnings for lottery id: ' + lotteryId);
      device.sendMessageToDevice('0OJPHFMUUXRQGZKE2SVXFWVVTKSNXD5EQ', 'text',
        'TEST: error sending data to AA: ' + err);
      return;
    }
    else if (unit) {
      // console.log('STOP Command sent from the Bot to the AA, unit: ' + unit);
      device.sendMessageToDevice('0OJPHFMUUXRQGZKE2SVXFWVVTKSNXD5EQ', 'text',
        'TEST: data sent to AA from bot, unit: ' + unit);
    }
  });
}

// AA has to check who sent the message, so only my bot (i.e. its headless wallet) can
// tell it to stop.

exports.stopTheGame = stopTheGame;
// https://developer.obyte.org/tutorials-for-newcomers/weather-oracle
