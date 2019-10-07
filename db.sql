-- query separator
DROP TABLE IF EXISTS xwf_stack_game_user;
-- query separator
DROP TABLE IF EXISTS xwf_stack_game;
-- query separator
CREATE TABLE IF NOT EXISTS xwf_stack_game_user (
  user_device CHAR(33) NOT NULL,
  user_wallet CHAR(32) NOT NULL,
  user_status CHAR(8) NOT NULL,
  PRIMARY KEY (user_device, user_wallet),
  FOREIGN KEY (user_device) REFERENCES correspondent_devices(device_address)
);
-- query separator
CREATE TABLE IF NOT EXISTS xwf_stack_game (
  game_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  game_amount INTEGER NOT NULL DEFAULT 0,
  game_author CHAR(32) NOT NULL,
  game_leader CHAR(32) NOT NULL,
  game_status CHAR(7) NOT NULL,
  game_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
