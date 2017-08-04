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
    searchPackages: searchPackages,
    uploadPackage: uploadPackage,
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

function getDistros(creds) {
    var headers = new Headers({
        'Authorization': 'Bearer ' + creds.token
    });
    var url = creds.url + '/api/v1/distro/show';
    var opts = { method: 'GET', mode: 'cors', headers: headers };

    return new Promise( (resolve, reject) => {
        fetch(url, opts).then( (response) => {
            if (!response.ok) {
                console.log(response.body);
                reject("Error calling cacus: got " + response.status + " " + response.statusText);
            }
            return response.json();
        }).catch( (err) => { reject(err) }).then( (d) => {
            if (d.success) {
                resolve(d.result.reduce( (a, x) => {
                    a[x.distro] = x;
                    return a;
                }, {}));
            }
        });
    });
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

function searchPackages(distro, selector, creds, cb) {
    var headers = new Headers({
        'Authorization': 'Bearer ' + creds.token,
        'Content-Type': 'application/json',
    });
    var url = creds.url + '/api/v1/package/search/' + distro;
    var opts = { method: 'POST', body: JSON.stringify(selector), mode: 'cors', headers: headers };
    fetch(url, opts).then(function(response) {
        return response.json();
    }).then(function(d) {
        if (d.success) {
            cb(null, d.result);
        }
    }).catch(function(err) {return null});
}

function uploadPackage(distro, component, file, creds, cb) {
    var headers = new Headers({
        'Authorization': 'Bearer ' + creds.token
    });
    var url = creds.url + '/api/v1/package/upload/' + distro + '/' + component;

    const reader = new FileReader();
    reader.onload = (fileData) => {
        var opts = { method: 'PUT', mode: 'cors', headers: headers, body: fileData.currentTarget.result };

        fetch(url, opts).then((response) => {
            return response.json();
        }).then((d) => {
            if (d.success) {
                var m = /Package\s+(.*?)_(.*?)\s+was uploaded/.exec(d.msg);
                cb(null, {success: d.success, filename: file.name, package: m[1], version: m[2], message: d.msg});
            } else {
                cb(null, {success: d.success, filename: file.name, package: 'N/A', version: 'N/A', message: d.msg})
            }
        }).catch((err) => { return false });
    };
    reader.readAsArrayBuffer(file);
}