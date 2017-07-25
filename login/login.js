var fs = require('fs')
var model = require('../model.js')

module.exports = function (stateRouter) {
    stateRouter.addState({
        name: 'login',
        route: '/login',
        template: fs.readFileSync('login/login.html').toString(),
        activate: function (context) {
            var ractive = context.domApi;
            var credentials = model.getCredentials();
            console.log("Credentials: %s", credentials);
            if (credentials.token) {
                stateRouter.go('app');
            } else {
                ractive.set('cacus_url', model.getCredentials().url);
                ractive.on('login', function () {
                    model.saveCredentials(ractive.get('cacus_url'), ractive.get('cacus_token'));
                    stateRouter.go('app');
                    return false;
                })
            }
        }
    })
}