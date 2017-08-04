var fs = require('fs');
var jwtDecode = require('jwt-decode');
var model = require('../model.js');

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
            try {
                var token_info = jwtDecode(context.content.credentials.token);
            } catch (err) {
                alert("Invalid token");
                model.saveCredentials(null, null);
                stateRouter.go('login');
                return;
            }
            ractive.set('cacus_url', context.content.credentials.url);
            ractive.set('cacus_user', token_info.sub?token_info.sub:"<invalid token>");
        }
    })

    require('./distro/distro')(stateRouter);
}