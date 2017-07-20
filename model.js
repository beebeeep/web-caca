var EventEmitter = require('events').EventEmitter;
var Cookie = require('js-cookie');
var emitter = new EventEmitter();

module.exports = emitter;

emitter.saveCredentials = saveCredentials;
emitter.getCredentials = getCredentials;

function saveCredentials(url, token) {
    console.log("Api %s, token %s", url, token);
    Cookie.set("cacusURL", url, {expires: 7});
    Cookie.set("cacusToken", token, {expires: 7, secure: window.location.hostname != "localhost"});
}

function getCredentials() {
    return {url: Cookie.get('cacusURL'), token: Cookie.get('cacusToken')};
}