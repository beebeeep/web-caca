var fs = require('fs')
var model = require('../model.js')

module.exports = function (stateRouter) {
    stateRouter.addState({
        name: 'app',
        route: '/app',
        defaultChild: 'distro',
        template: fs.readFileSync('app/app.html').toString(),
        resolve: function resolve(data, params, cb) {
            var creds = model.getCredentials();
            if (!creds.token) {
                cb.redirect('login');
            } else {
                cb(null, {credentials: creds});
            }
        },
        activate: function (context) {
            var ractive = context.domApi;
            ractive.set('cacus_url', context.content.credentials.url);
            ractive.set('cacus_user', context.content.credentials.token);
            ractive.on('logout', function() {
                model.saveCredentials(null, null);
                stateRouter.go('login');
            });
        }
    })

    require('./distro/distro')(stateRouter);
}