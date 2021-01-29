"use strict" 
const fs = require('fs')
const db = require('./utils/db.json')
const fetch = require('node-fetch')
const system = require('./system.json')
const header = require('./utils/headers')
const error = require('./utils/error')
const Shout = require('./utils/Shout')
const chalk = require('chalk')
const pkg = require('./package.json')
const deviceFile = require('./device.js')
const npmReg = 'http://registry.npmjs.org/' + pkg.name


const deviceId = deviceFile.key
const apiUrl = system.api.url


async function searchForVersion(){
    const r = await fetch(npmReg, {})
    const j = await r.json()
    // if(!r.ok){
    //      throw new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`${j["api:message"]}`))
    // }
    const liveVersion = j["dist-tags"].latest
    const currentVersion = pkg.version
    if(liveVersion !== currentVersion){
        Shout(`Update required!\nCurrent Version: ${currentVersion} New Version: ${liveVersion}\nUpdate by executing: npm i ${pkg.name}@${liveVersion}`)
    }
}
searchForVersion()


class Client {
    /**
     * @param {string} specialId A must be defined value to store the user in a local JSON database!
     * @param {boolean} debug Enable debug mode.
     */
    constructor(specialId, debug){
        this.specialId = specialId
        this.debug = debug
    }

    /**
     * @param {string} uid The user uid you want to get the userprofile of.
     */
    
    async getUser(user){
        if(!user) throw new Error(chalk.red(`[${system.strings.computer.danger}] No userId inserted!`))

        const r = await fetch(`${apiUrl}/g/s/user-profile/${user}`, {headers: {"NDCDEVICEID": deviceId}})
        const j = await r.json()
        if(!r.ok) {
            throw new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`${j['api:message']}`))
        }
        return j.userProfile
    }

    /**
     * @param {string} email The account email
     * @param {string} password The account password
     */

    async login(email, password){
        const postData = {
            "email": email,
            "secret": `0 ${password}`,
            "deviceID": deviceId
        }

        if(!email) throw new Error(`[${system.strings.computer.danger}] No email inserted!`)
        if(!password) throw new Error(`[${system.strings.computer.danger}] No password inserted!`)
        if(!this.specialId) throw new Error(`[${system.name}] `) + chalk.red(`You must define a specialId in the Client object!`)

        const r = await fetch(`${apiUrl}/g/s/auth/login`, { 
                        method: "POST",
                        headers: {"NDCDEVICEID": deviceId},
                        body: JSON.stringify(postData)
                    })
        const j = await r.json()                

        if(!r.ok){
            throw new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`${j["api:message"]}`))
        }

        header(JSON.stringify(postData), j.sid)
        db[this.specialId] = {
            contentLength: JSON.stringify(postData).length,
            NDCAUTH: `sid=${j.sid}`,
            UUID: j.account.uid 
        }
        fs.writeFile(`${__dirname}/utils/db.json`, JSON.stringify(db), err => {if(err) console.log(err)})
        return j                
    }

    async logout(){
        if(!this.specialId) throw new Error(`[${system.name}] `) + chalk.red(`You must define a specialId in the Client object!`)

        const r = await fetch(`${apiUrl}/g/s/auth/logout`, { 
                        method: "POST",
                        headers: {"NDCDEVICEID": deviceId},
                        body: JSON.stringify({"NDCDEVICEID": deviceId})
                    })

        const j = await r.json()                

        if(!r.ok){
            throw new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`${j["api:message"]}`))
        }
        
        header(JSON.stringify({"NDCDEVICEID": deviceId}), j.sid)
        if(db[this.specialId]) {
            delete db[this.specialId]
            fs.writeFile(`${__dirname}/utils/db.json`, JSON.stringify(db), err => {if(err) console.log(err)})
        } else {
            throw new Error('No local database found!\nLogin first!')
        }
        return j
    }

    /**
     * @param {string} message The message content
     * @param {string} comId Community id
     * @param {string} chatId Chat id
     * @param {number} type The message type
     */
    async sendMessage(message, comId, chatId, type=0) {
        if(!comId) throw new Error(`[${system.strings.computer.danger}] No comId inserted!`)
        if(!chatId) throw new Error(`[${system.strings.computer.danger}] No chatId inserted!`)

        const r = await fetch(`${apiUrl}/x${comId}/s/chat/thread/${chatId}/message`, { 
                        method: "POST",
                        headers: header(null, this.specialId),
                        body: JSON.stringify({"type": type, "content": message})
                    })
        const j = await r.json()                

        if(!r.ok){
            throw new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`${j["api:message"]}`))
        }
        return j
    }

    /**
     * @param {string} userId The user UUID
     */
    async follow(userId){
        if(!userId) throw new Error(`[${system.strings.computer.danger}] No userId inserted!`)
        if(!this.specialId) throw new Error(`[${system.name}] `) + chalk.red(`You must define a specialId in the Client object!`)

        const r = await fetch(`${apiUrl}/g/s/user-profile/${userId}/member`, { 
                        method: "POST",
                        headers: header(null, this.specialId)
                    })
        const j = await r.json() 
        if(!r.ok){
            throw new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`${j["api:message"]}`))
        }
        return j
    }
}

class SubClient {
    /**
     * @param {string} ClientObject The ClientObject that makes you able to log in!
     * @param {string} CommunityId The communityId, do not include the 'x'!
     */
    constructor(ClientObject, CommunityId){
        this.ClientMain = ClientObject
        this.CID = CommunityId
        this.specialId = ClientObject.specialId
    }

    /**
     * 
     * @param {string} userId The userId of the user
     */
    async getUser(userId){
        if(!userId) throw new Error(`[${system.strings.computer.danger}] No userId inserted!`)
        if(!this.specialId) throw new Error(`[${system.name}] `) + chalk.red(`You must define a specialId in the Client object!`)

        const r = await fetch(`${apiUrl}/x${this.CID}/s/user-profile/${userId}`, { 
                            headers: header(null, this.specialId)
                        })
        const j = await r.json() 
        if(!r.ok){
            throw new Error(chalk.greenBright(`[${system.name}] `) + chalk.red(`${j["api:message"]}`))
        }
        return j
    }
}


module.exports = {Client, SubClient}