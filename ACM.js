"use strict"; 
const fs = require('fs');
const db = require('./utils/db.json');
const fetch = require('node-fetch');
const system = require('./system.json');
const header = require('./utils/headers');
const chalk = require('chalk');
const pkg = require('./package.json');
const deviceFile = require('./device.json');


const deviceId = deviceFile.key;
const apiUrl = system.api.url;
const clientVersion = pkg.version;


class ACM {
    /**
     * @param {string} tja A must be defined value to store the user in a local JSON database!
     */
    constructor(tja){
        this.tja = tja;
    }
}
module.exports = ACM;