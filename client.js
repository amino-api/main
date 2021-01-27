"use strict"; 
const fs = require('fs');
const db = require('./utils/db.json');
const fetch = require('node-fetch');
const system = require('./system.json');
const header = require('./utils/headers');
const error = require('./utils/error');
const Shout = require('./utils/Shout');
const chalk = require('chalk');
const pkg = require('./package.json');
const deviceFile = require('./device.js');
const npmReg = 'http://registry.npmjs.org/' + pkg.name;


const deviceId = deviceFile.key;
const apiUrl = system.api.url;


async function searchForVersion(){
    try {
        return new Promise(resolve => {
            fetch(npmReg, {}).then(res => res.json()).then(data => {
                // if(data["api:statuscode"] !== 0){
                //     resolve(new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`${data["api:message"]}`)))
                // }
                const liveVersion = data["dist-tags"].latest;
                const currentVersion = pkg.version;
                if(liveVersion !== currentVersion){
                    Shout(`Update required!\nCurrent Version: ${currentVersion} New Version: ${liveVersion}\nUpdate by executing: npm i ${pkg.name}@${liveVersion}`)
                }
            }).catch((e) => {
                error(e)
            })
        })
    } catch(e) {
        error(e)
    }
}
searchForVersion();


class Client {
    /**
     * @param {string} specialId A must be defined value to store the user in a local JSON database!
     * @param {boolean} debug Enable debug mode.
     */
    constructor(specialId, debug){
        this.specialId = specialId;
        this.debug = debug;
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
                    error(e)
                })
            })
        } catch(e) {
            error(e)
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
                            NDCAUTH: `sid=${data.sid}`,
                            UUID: data.account.uid 
                        }
                        fs.writeFile(__dirname + "/utils/db.json", JSON.stringify(db), (err) => {
                            if(err) console.log(err);
                        });
                    } else {
                        db[this.specialId] = {
                            contentLength: JSON.stringify(postData).length,
                            NDCAUTH: `sid=${data.sid}`,
                            UUID: data.account.uid
                        }
                        fs.writeFile(__dirname + "/utils/db.json", JSON.stringify(db), (err) => {
                            if(err) console.log(err);
                        });
                    }
                    resolve(data)
                }).catch((e) => {
                    error(e)
                })
            })
        } catch(e) {
            return console.log(chalk.red(`[${system.name}|ERROR]`, e))
        }
    }
    logout(){
        try {
            const headersV1 = header(null, this.specialId);

            const postData = {
                "deviceID": deviceId,
                "clientType": 100,
                "timestamp": Date.now() * 1000
            }

            return new Promise(resolve => {
                if(!this.specialId) resolve(new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`You must define a specialId in the Client object!`)))
                fetch(`${apiUrl}/g/s/auth/logout`, { 
                    method: "POST",
                    headers: headersV1,
                    body: JSON.stringify(postData)
                }).then(res => res.json()).then(data => {
                    if(data["api:statuscode"] !== 0){
                        resolve(new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`${data["api:message"]}`)))
                    }
                    header(JSON.stringify(postData), data.sid)
                    if(db[this.specialId]) {
                        delete db[this.specialId]
                        fs.writeFile(__dirname + "/utils/db.json", JSON.stringify(db), (err) => {
                            if(err) console.log(err);
                        });
                    } else {
                        resolve(error('No local database found!\nLogin first!'))
                    }
                    resolve(data)
                }).catch((e) => {
                    error(e)
                })
            })
        } catch(e) {
            return console.log(chalk.greenBright(`[${system.name}|ERROR]`, e))
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
                    error(e)
                })
            })
        } catch(e) {
            return console.log(chalk.red(`[${system.name}|ERROR]`, e))
        }
    }

    /**
     * @param {string} userId The user UUID
     */
    follow(userId){
        try {
            const headersV1 = header(null, this.specialId);

            // console.log(headersV1)
            return new Promise(resolve => {
                fetch(`${apiUrl}/g/s/user-profile/${userId}/member`, { 
                    method: "POST",
                    headers: headersV1
                }).then(res => res.json()).then(data => {
                    if(data["api:statuscode"] !== 0){
                        resolve(error(data["api:message"]));
                    }
                    resolve(data)
                }).catch((e) => {
                    error(e)
                })
            })
        } catch(e) {
            return console.log(chalk.red(`[${system.name}|ERROR]`, e))
        }
    }
}

class SubClient {
    /**
     * @param {string} ClientObject The ClientObject that makes you able to log in!
     * @param {string} CommunityId The communityId, do not include the 'x'!
     */
    constructor(ClientObject, CommunityId){
        this.ClientMain = ClientObject;
        this.CID = CommunityId;
        this.specialId = ClientObject.specialId;
    }

    /**
     * 
     * @param {string} userId The userId of the user
     */
    getUser(userId){
        try {
            const headersV1 = header(null, this.specialId)
            return new Promise(async resolve => {
                fetch(`${apiUrl}/x${this.CID}/s/user-profile/${userId}`, { 
                    headers: headersV1
                }).then(res => res.json()).then(data => {
                    console.log(data["api:statuscode"])
                    if(data["api:statuscode"] !== 0){
                        resolve(error(data["api:message"]))
                    }
                    resolve(data)
                }).catch((e) => {
                    error(e)
                })
            })
        } catch(e) {
            error(e)
        }
    }
    
}


module.exports = {Client, SubClient};