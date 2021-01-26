const fs = require('fs');
const db = require('./db.json');
const deviceFile = require('../device.json');

const deviceId = deviceFile.key;
/**
 * 
 * @param {string} data Return data
 * @param {string} sid User login key
 * @param {string} specialId the previous defined special id by a user
 */

module.exports = function(data, specialId){
    let headers;
    if(db[specialId]){
        headers = {
            "NDCDEVICEID": deviceId,
            "NDC-MSG-SIG": "AaauX/ZA2gM3ozqk1U5j6ek89SMu",
            "Accept-Language": "en-US",
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 7.1; LG-UK495 Build/MRA58K; com.narvii.amino.master/3.3.33180)",
            "Host": "service.narvii.com",
            "Accept-Encoding": "gzip",
            "Connection": "Keep-Alive",
            "Content-Length": db[specialId].contentLength,
            "NDCAUTH": db[specialId].NDCAUTH
        }
    } else {
        headers = {
            "NDCDEVICEID": deviceId,
            "NDC-MSG-SIG": "AaauX/ZA2gM3ozqk1U5j6ek89SMu",
            "Accept-Language": "en-US",
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 7.1; LG-UK495 Build/MRA58K; com.narvii.amino.master/3.3.33180)",
            "Host": "service.narvii.com",
            "Accept-Encoding": "gzip",
            "Connection": "Keep-Alive"
        }
    }


    // if(data !== null){
    //     headers["Content-Length"] = data.length;
    // }
    // if(sid !== null){
    //     headers["NDCAUTH"] = `sid=${sid}`;
    // }
    return headers;
};