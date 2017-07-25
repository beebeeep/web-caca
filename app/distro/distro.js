var fs = require('fs')
var model = require('../../model.js')

module.exports = function (stateRouter) {
    stateRouter.addState({
        name: 'app.distro',
        route: '/distro',
        template: fs.readFileSync('app/distro/distro.html').toString(),
        resolve: function resolve(data, params, cb) {
            cb(null, {});
        },
        activate: function (context) {
            var ractive = context.domApi;
            ractive.set('cacus_url', context.content.credentials.url);
            ractive.set('cacus_user', context.content.credentials.token);
        }
    })
}