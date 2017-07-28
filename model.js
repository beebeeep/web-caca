//var EventEmitter = require('events').EventEmitter;
var Cookie = require('js-cookie');

/*var emitter = new EventEmitter();

module.exports = emitter;

emitter.saveCredentials = saveCredentials;
emitter.getCredentials = getCredentials;
emitter.getDistros = getDistros;
*/

module.exports = {
    saveCredentials: saveCredentials,
    getCredentials: getCredentials,
    getDistros: getDistros,
    getDistro: getDistro,
    getPackages: getPackages,
};

function saveCredentials(url, token) {
    if (token == null) {
        // keep cacusURL, but remove token
        Cookie.remove('cacusToken');
    } else {
        Cookie.set("cacusURL", url, {expires: 7});
        Cookie.set("cacusToken", token, {expires: 7, secure: window.location.hostname != "localhost"});
    }
}

function getCredentials() {
    return {
        url: Cookie.get('cacusURL'),
        token: Cookie.get('cacusToken'),
    };
}

function getDistros(creds, cb) {
    var headers = new Headers({
        'Authorization': 'Bearer ' + creds.token
    });
    var url = creds.url + '/api/v1/distro/show';
    var opts = { method: 'GET', mode: 'cors', headers: headers };
    fetch(url, opts).then(function(response) {
        return response.json();
    }).then(function(d) {
        if (d.success) {
            cb(null, d.result);
        }
    }).catch(function(err) {return null});
}

function getDistro(distro, creds, cb) {
    var headers = new Headers({
        'Authorization': 'Bearer ' + creds.token
    });
    var url = creds.url + '/api/v1/distro/show/' + distro;
    var opts = { method: 'GET', mode: 'cors', headers: headers };
    fetch(url, opts).then(function(response) {
        return response.json();
    }).then(function(d) {
        if (d.success) {
            cb(null, d.result[0]);
        }
    }).catch(function(err) {return null});
}

function getPackages(distro, component, creds, cb) {
    var headers = new Headers({
        'Authorization': 'Bearer ' + creds.token,
        'Content-Type': 'application/json',
    });
    var url = creds.url + '/api/v1/package/search/' + distro;
    var opts = { method: 'POST', body: JSON.stringify({pkg: '.', comp: component}), mode: 'cors', headers: headers };
    fetch(url, opts).then(function(response) {
        return response.json();
    }).then(function(d) {
        if (d.success) {
            cb(null, d.result);
        }
    }).catch(function(err) {return null});
}