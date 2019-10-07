/*jslint node: true */
'use strict';
// Obyte imports (libraries)
const constants = require('ocore/constants.js');
const conf = require('ocore/conf');
const eventBus = require('ocore/event_bus');
const headlessWallet = require('headless-obyte');
const device = require('ocore/device.js');
const walletGeneral = require('ocore/wallet_general');
// Game imports (modules)
const game = require('./conf_game.js');
const chatting = require('./chat.js');
const newTransactions = require('./newTransactions.js');

// headless wallet is ready Event
eventBus.once('headless_wallet_ready', () => {
	headlessWallet.setupChatEventHandlers();

	// add AA's address to the watched list of addresses
	walletGeneral.addWatchedAddress(game.aaAddress, function() {
    console.log('====== AA address: ' + game.aaAddress + ' is added to the list of watched addresses');
	});

	// user pairs his device with the bot
	eventBus.on('paired', (from_address, pairing_secret) => {
		device.sendMessageToDevice(from_address, 'text', "Welcome to Obyte Stack Game Bot!");
	});

	// user sends message to the bot
	eventBus.on('text', (from_address, text) => {
		text = text.trim();
		chatting.chatting(from_address, text);
	});
});

// user pays to the AA
eventBus.on('new_my_transactions', (arrUnits) => {
	newTransactions.newTransactions(arrUnits);
});

process.on('unhandledRejection', up => { throw up; });

// *****************************************************
//eventBus.on('aa_response_from_aa-' + game.aaAddress, (objAAResponse) => {
	//device.sendMessageToDevice('0OJPHFMUUXRQGZKE2SVXFWVVTKSNXD5EQ', 'text',
	//	'TEST: Response object Vars: ' + objAAResponse.response.responseVars);
//});
// payment is confirmed
//eventBus.on('my_transactions_became_stable', (arrUnits) => {
//	stableTransactions.stableTransactions(arrUnits);
//});
// TESTING MESSAGE
//device.sendMessageToDevice('0OJPHFMUUXRQGZKE2SVXFWVVTKSNXD5EQ', 'text',
//  'TEST: New Transactions');
//
//network.addLightWatchedAddress("ZSQCTCUIRPCIUHUQSR2SNZL7IRB7ORMW");
