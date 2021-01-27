const chalk = require('chalk');
const system = require('../system.json');

/**
 * @param {string} content the previous defined special id by a user
 */

module.exports = function(content){
    return console.log(chalk.yellow('================\n') + chalk.greenBright(`[${system.name}] `) + chalk.blue(`${content}`) + chalk.yellow(`\n================`));
};