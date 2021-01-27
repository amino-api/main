const chalk = require('chalk');
const system = require('../system.json');

/**
 * @param {string} errorContent the previous defined special id by a user
 */

module.exports = function(errorContent){
    return new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`${errorContent}`));
};