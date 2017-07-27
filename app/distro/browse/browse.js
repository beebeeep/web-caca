var fs = require('fs');
var all = require('async-all');
var model = require('../../../model.js');

module.exports = function (stateRouter) {
    stateRouter.addState({
        name: 'app.distro.browse',
        route: '/:distroName',
        template: fs.readFileSync('app/distro/browse/browse.html').toString(),
        resolve: function(data, parameters, cb) {
            var creds = model.getCredentials();
            console.log("distroName", parameters.distroName);
            all({
                distro: model.getDistro.bind(null, parameters.distroName, creds)
            }, cb);
        },
        activate: function(context) {
            ractive = context.domApi;
            console.log(context.content.distro);
            ractive.set('distro', context.content.distro);
        }
    });

    stateRouter.addState({
        name: 'app.distro.no-distro',
        route: '',
        template: fs.readFileSync('app/distro/browse/no-distro-selected.html').toString()
    });
}