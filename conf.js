/*jslint node: true */
"use strict";
exports.port = null;
//exports.myUrl = 'wss://mydomain.com/bb';
exports.bServeAsHub = false;
exports.bLight = true;

exports.storage = 'sqlite';

// TOR is recommended. Uncomment the next two lines to enable it
//exports.socksHost = '127.0.0.1';
//exports.socksPort = 9050;

exports.hub = process.env.testnet ? 'obyte.org/bb-test' : 'obyte.org/bb';
exports.deviceName = 'Obyte Stack Game Bot';
exports.permanent_pairing_secret = 'StackGame'; // * allows to pair with any code, the code is passed as 2nd param to the pairing event handler
exports.control_addresses = ['03IZO575EMSLKLXYADRSCWQGMBJGRIVXC'];
exports.payout_address = 'B7KF2F5AP6BZLXOE2EGHH6BKZWVNIKWF';

exports.bIgnoreUnpairRequests = true;
exports.bSingleAddress = true;
exports.bStaticChangeAddress = true;
exports.KEYS_FILENAME = 'keys.json';

// emails
exports.admin_email = 'natalie.seltzer@gmail.com';
exports.from_email = '';
