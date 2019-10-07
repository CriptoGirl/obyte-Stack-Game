// Obyte imports (libraries)
const device = require('ocore/device.js');
const db = require('ocore/db');
// Game imports (modules)
const game = require('./conf_game.js');
//const toPlay = require('./toPlay.js');

// ** save new game ** //
function saveNewGame(unitAuthorWallet, unitAmount) {
  db.query(`INSERT INTO xwf_stack_game
    (game_amount, game_author, game_leader, game_status)
    VALUES (?,?,?,?)`,
    [unitAmount, unitAuthorWallet, unitAuthorWallet, 'started']);
}

// ** update the game ** //
function updateGame(gameId, unitAuthorWallet, gameAmount) {
  db.query(`UPDATE xwf_stack_game
    SET game_status=?, game_amount=?, game_leader=?
    WHERE game_id=? AND game_status='started' OR game_status='running'`,
    ['running', gameAmount, unitAuthorWallet, gameId]);
}

exports.saveNewGame = saveNewGame;
exports.updateGame = updateGame;
