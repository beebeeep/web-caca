var fs = require('fs');
var all = require('async-all');
var model = require('../../model.js');

module.exports = function (stateRouter) {
    stateRouter.addState({
        name: 'app.distro',
        route: '/distro',
        defaultChild: 'no-distro',
        template: fs.readFileSync('app/distro/distro.html').toString(),
        resolve: function resolve(data, params, cb) {
            var creds = model.getCredentials();
            all({
                distros: model.getDistros.bind(null, creds)
            }, cb);
        },
        activate: function (context) {
            var ractive = context.domApi;

            ractive.set('distros', context.content.distros);
        }
    });

    require('./browse')(stateRouter);
}