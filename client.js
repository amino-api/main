"use strict"; 

const fetch = require('node-fetch');
const system = require('./system.json');
const chalk = require('chalk');

const apiUrl = system.api.url;

class Client {
    /**
     * 
     * @param {string} AuthKey Your bot Auth key.
     */
    constructor(AuthKey) {
        this.AuthKey = AuthKey;
    }

    /**
     * @param {number} botId The bot Id.
     * @param {number} userId The user Id for who you want to check the votes of.
     */
    getUser(){
        try {
            // let bot = botId;
            // let user = userId;
            // if(!bot) new Error(chalk.red(`[${system.strings.computer.danger}] No botId inserted!`));
            // if(!user) new Error(chalk.red(`[${system.strings.computer.danger}] No userId inserted!`));

            const headersV1 = {
                "NDCDEVICEID": "01B592EF5658F82E1339B39AA893FF661D7E8B8F1D16227E396EF4B1BF60F33D25566A35AB1514DAB5",
                "NDC-MSG-SIG": "AaauX/ZA2gM3ozqk1U5j6ek89SMu",
                "Accept-Language": "en-US",
                "Content-Type": "application/json; charset=utf-8",
                "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 7.1; LG-UK495 Build/MRA58K; com.narvii.amino.master/3.3.33180)",
                "Host": "service.narvii.com",
                "Accept-Encoding": "gzip",
                "Connection": "Keep-Alive"
            }

            return new Promise(resolve => {
                fetch(`${apiUrl}/g/s/user-profile/463671b2-5432-4db6-9522-2111950a3db9`, {
                    headers: headersV1
                }).then(res => res.json()).then(data => {
                    resolve(data)
                }).catch((e) => {
                    console.log(system.name, e)
                })
            })
        } catch(e) {
            return console.log(chalk.red(`[${system.strings.computer.danger}]`, e))
        }
    }

}
module.exports = Client;