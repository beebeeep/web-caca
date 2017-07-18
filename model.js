var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

module.exports = emitter;

emitter.saveCredentials = saveCredentials;

function saveCredentials(url, token) {
    console.log("Api %s, token %s", url, token);
}