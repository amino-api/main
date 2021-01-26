const client = require("./client");
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
 
updateNotifier({pkg}).notify();

module.exports = client;