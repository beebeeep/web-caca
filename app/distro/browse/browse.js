var fs = require('fs');
var all = require('async-all');
var model = require('../../../model.js');
var moment = require('moment');

module.exports = function (stateRouter) {
    stateRouter.addState({
        name: 'app.distro.browse',
        route: '/:distroName',
        template: fs.readFileSync('app/distro/browse/browse.html').toString(),
        resolve: function(data, parameters, cb) {
            var creds = model.getCredentials();
            all({
                distro: model.getDistro.bind(null, parameters.distroName, creds)
            }, cb);
        },
        activate: function(context) {
            ractive = context.domApi;

            ractive.data.formatDate = function (ts) {
                    return moment(ts).fromNow();
                }
            ractive.set('distro', context.content.distro);

            
            if(stateRouter.stateIsActive('app.distro.browse')) {
                stateRouter.go('app.distro.browse.packages', {distroName: context.content.distro.distro, component: context.content.distro.components[0]});
            }
            
        }
    });

    stateRouter.addState({
        name: 'app.distro.no-distro',
        route: '',
        template: fs.readFileSync('app/distro/browse/no-distro-selected.html').toString()
    });

    stateRouter.addState({
        name: 'app.distro.browse.packages',
        route: '/:component',
        template: fs.readFileSync('app/distro/browse/packages.html').toString(),
        resolve: function(data, parameters, cb) {
            var creds = model.getCredentials();
            all({
                packages: model.getPackages.bind(null, parameters.distroName, parameters.component, creds)
            }, cb);
        },
        activate: function(context) {
            ractive = context.domApi;
            ractive.set('packages', context.content.packages[context.parameters.distroName]);
        }
    });
}