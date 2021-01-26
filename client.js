"use strict"; 
const fs = require('fs');
const db = require('./utils/db.json');
const fetch = require('node-fetch');
const system = require('./system.json');
const header = require('./utils/headers');
const chalk = require('chalk');
const pkg = require('./package.json');


const deviceId = "01B592EF5658F82E1339B39AA893FF661D7E8B8F1D16227E396EF4B1BF60F33D25566A35AB1514DAB5";
const apiUrl = system.api.url;
const clientVersion = pkg.version;


class Client {
    /**
     * @param {string} specialId A must be defined value to store the user in a local JSON database!
     * @param {boolean} debug Enable debug mode.
     */
    constructor(specialId, debug){
        this.debug = debug;
        this.specialId = specialId;
    }

    /**
     * @param {string} uid The user uid you want to get the userprofile of.
     */
    
    getUser(uid){
        try {
            let user = uid;
            if(!user) resolve(new Error(chalk.red(`[${system.strings.computer.danger}] No userId inserted!`)));

            const headersV1 = {
                "NDCDEVICEID": deviceId,
                "NDC-MSG-SIG": "AaauX/ZA2gM3ozqk1U5j6ek89SMu",
                "Accept-Language": "en-US",
                "Content-Type": "application/json; charset=utf-8",
                "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 7.1; LG-UK495 Build/MRA58K; com.narvii.amino.master/3.3.33180)",
                "Host": "service.narvii.com",
                "Accept-Encoding": "gzip",
                "Connection": "Keep-Alive"
            }

            return new Promise(resolve => {
                fetch(`${apiUrl}/g/s/user-profile/${user}`, { 
                    headers: headersV1
                }).then(res => res.json()).then(data => {
                    if(data["api:statuscode"] !== 0){
                        resolve(new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`${data["api:message"]}`)))
                    }
                    resolve(data.userProfile)
                }).catch((e) => {
                    console.log(chalk.greenBright(system.name), e)
                })
            })
        } catch(e) {
            return console.log(chalk.red(`[${system.strings.computer.danger}]`, e))
        }
    }

    /**
     * @param {string} email The account email
     * @param {string} password The account password
     */

    login(email, password){
        try {
            const headersV1 = {
                "NDCDEVICEID": deviceId,
                "NDC-MSG-SIG": "AaauX/ZA2gM3ozqk1U5j6ek89SMu",
                "Accept-Language": "en-US",
                "Content-Type": "application/json; charset=utf-8",
                "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 7.1; LG-UK495 Build/MRA58K; com.narvii.amino.master/3.3.33180)",
                "Host": "service.narvii.com",
                "Accept-Encoding": "gzip",
                "Connection": "Keep-Alive"
            }

            const postData = {
                "email": email,
                "v": 2,
                "secret": `0 ${password}`,
                "deviceID": deviceId,
                "clientType": 100,
                "action": "normal",
                "timestamp": Date.now() * 1000
            }

            return new Promise(resolve => {
                if(!this.specialId) resolve(new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`You must define a specialId in the Client object!`)))
                fetch(`${apiUrl}/g/s/auth/login`, { 
                    method: "POST",
                    headers: headersV1,
                    body: JSON.stringify(postData)
                }).then(res => res.json()).then(data => {
                    if(data["api:statuscode"] !== 0){
                        resolve(new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`${data["api:message"]}`)))
                    }
                    header(JSON.stringify(postData), data.sid)
                    if(!db[this.specialId]) {
                        db[this.specialId] = {
                            contentLength: JSON.stringify(postData).length,
                            NDCAUTH: `sid=${data.sid}`
                        }
                        fs.writeFile(__dirname + "/utils/db.json", JSON.stringify(db), (err) => {
                            if(err) console.log(err);
                        });
                    }
                    resolve(data)
                }).catch((e) => {
                    console.log(chalk.greenBright(system.name), e)
                })
            })
        } catch(e) {
            return console.log(chalk.red(`[${system.name}|ERROR]`, e))
        }
    }

    /**
     * @param {string} message The message content
     * @param {string} cid Community id
     * @param {string} chatId Chat id
     * @param {number} type The message type
     */
    sendMessage(message, cid, chatId, type){
        try {
            const headersV1 = header(null, this.specialId);

            const postData = {
                "type": type,
                "content": message,
                "clientRefId": 360979903,
                "attachedObject": null,
                "timestamp": Date.now() * 1000
            }
            // console.log(headersV1)
            return new Promise(resolve => {
                fetch(`${apiUrl}/x${cid}/s/chat/thread/${chatId}/message`, { 
                    method: "POST",
                    headers: headersV1,
                    body: JSON.stringify(postData)
                }).then(res => res.json()).then(data => {
                    if(data["api:statuscode"] !== 0){
                        resolve(new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`${data["api:message"]}`)))
                    }
                    resolve(data)
                }).catch((e) => {
                    console.log(chalk.greenBright(system.name), e)
                })
            })
        } catch(e) {
            return console.log(chalk.red(`[${system.name}|ERROR]`, e))
        }
    }

}
module.exports = Client;