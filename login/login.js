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
            if (credentials.token) {
                stateRouter.go('app');
            } else {
                ractive.set('cacus_url', model.getCredentials().url);
                ractive.on('login', () => {
                    model.saveCredentials(ractive.get('cacus_url'), ractive.get('cacus_token'));
                    stateRouter.go('app');
                    return false;
                })
            }
        }
    })

    stateRouter.addState({
        name: 'logout',
        route: '/logout',
        template: fs.readFileSync('login/logout.html').toString(),
        activate: (context) => {
            var ractive = context.domApi;
            model.saveCredentials(null, null);
        }
    })
}