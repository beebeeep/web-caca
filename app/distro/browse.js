var fs = require('fs');
var all = require('async-all');
var model = require('../../model.js');

module.exports = function (stateRouter) {
    stateRouter.addState({
        name: 'app.distro.browse',
        route: '/:distroName',
        defaultChild: 'search',
        template: fs.readFileSync('app/distro/browse.html').toString(),
        resolve: function(data, parameters, cb) {
            cb(null);
        },
        activate: function(context) {
            console.log("lalala");
            ractive = context.domApi;

            // save current distro (context.content.distros inherited from parent state)
            context.content.distro = context.content.distros[context.parameters.distroName];
            ractive.set('distro', context.content.distro);
        }
    });

    stateRouter.addState({
        name: 'app.distro.no-distro',
        route: '',
        template: fs.readFileSync('app/distro/no-distro-selected.html').toString()
    });

    stateRouter.addState({
        name: 'app.distro.browse.search',
        route: '/search/:pkgNameRegex?',
        template: fs.readFileSync('app/distro/search.html').toString(),
        resolve: function(data, parameters, cb) {
            var creds = model.getCredentials();
            if (parameters.pkgNameRegex === undefined) {
                cb(null, {searchResult: []});
            } else {
                all({
                    searchResult: model.searchPackages.bind(null, parameters.distroName, {pkg: parameters.pkgNameRegex}, creds)
                }, cb);
            }
        },
        activate: function(context) {
            var creds = model.getCredentials();
            ractive = context.domApi;
            ractive.set('pkgName', context.parameters.pkgNameRegex)
            ractive.on('searchPackages', function() {
                stateRouter.go('app.distro.browse.search', {distroName: context.parameters.distroName, pkgNameRegex: ractive.get('pkgName')})
            });
            ractive.set('packages', context.content.searchResult[context.parameters.distroName]);
        }
    });

    stateRouter.addState({
        name: 'app.distro.browse.upload',
        route: '/upload',
        template: fs.readFileSync('app/distro/search.html').toString(),
        resolve: function(data, parameters, cb) {
            cb(null);
        },
        activate: function(context) {
            var creds = model.getCredentials();
            ractive = context.domApi;
            ractive.on('searchPackages', function() {
                model.searchPackages(
                    context.parameters.distroName, {pkg: ractive.get('pkgName')}, creds, 
                    function (err, d) {
                        ractive.set('packages', d[context.parameters.distroName]);
                });
            });
        }
    });
}