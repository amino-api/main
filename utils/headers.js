const deviceId = "01B592EF5658F82E1339B39AA893FF661D7E8B8F1D16227E396EF4B1BF60F33D25566A35AB1514DAB5";


const fs = require('fs');
const db = require('./db.json');
/**
 * 
 * @param {string} data Return data
 * @param {string} sid User login key
 * @param {string} specialId the previous defined special id by a user
 */

module.exports = function(data, specialId){
    console.log(specialId)
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
        console.log('AUTH:', headers)
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
        console.log(headers)
    }


    // if(data !== null){
    //     headers["Content-Length"] = data.length;
    // }
    // if(sid !== null){
    //     headers["NDCAUTH"] = `sid=${sid}`;
    // }
    return headers;
};