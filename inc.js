const client = require("./client");
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
 
updateNotifier({pkg}).notify({message: 'Outdated version detected: {currentVersion}/{latestVersion}\nRun `{updateCommand}` to update.'});

module.exports = client;