/**
 * Create version based on Date.now() locale format
 * it to HH:MM:SS DD.MM.YYYY and replace
 * a static value GAME_VERSION in Game.js
 */
const version = (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/, '');

const fs = require('fs');
const path = require('path');

const gameClassPath = path.join(__dirname, 'src', 'Game.js');
const gameClassContent = fs.readFileSync(gameClassPath, 'utf8');
const newGameClassContent = gameClassContent.replace(/GAME_VERSION = '.*';/, `GAME_VERSION = '${version}';`);

fs.writeFileSync(gameClassPath, newGameClassContent, 'utf8');

console.log(`Version ${version} was successfully created!`);