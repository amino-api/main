# aminoapps.js

### Docs
- [Simple example](#simple-example)

### Simple example
Get the votes from a bot by a specific user:
```js
const amino = require('aminoapps.js');
const Client = new amino('HHWelcome'); // HHWelcome : Special key name!

async function getUser(){
    const userObj = await Client.getUser('uuid'); 
    console.log(userObj)
}
getUser();

async function msg(){
    setTimeout(async() => {
        const msg = await Client.sendMessage('Hello World!', 'CommunityId', 'ChatId', 0); // CommunityId : Not actual communityId, CommmunityId has ex: x126936831 (x is already handled! So don't put x in front)
        console.log(msg);
    }, 10000)
}

async function Login(){
    Client.login('UserEmail', 'UserPassword')
}
Login();
msg();

```
