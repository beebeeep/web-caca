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
        template: fs.readFileSync('app/distro/upload.html').toString(),
        resolve: function(data, parameters, cb) {
            cb(null);
        },
        activate: function(context) {
            var creds = model.getCredentials();
            ractive = context.domApi;
            // save current distro (context.content.distros inherited from parent state)
            context.content.distro = context.content.distros[context.parameters.distroName];
            ractive.set('distro', context.content.distro);
            ractive.on('browse', function(event) {
                ractive.set('uploadResult', []);
                this.find('#pkgFileInput').click();
            });
            ractive.on('selectFiles', function(context, files) {
                context.set('pkgFiles', files);
            });
            ractive.on('uploadFiles', function(ractive_context, component) {
                var files = ractive_context.get('pkgFiles');
                if (files === undefined) {
                    alert("Select files to upload");
                    return;
                }
                for(var i = 0; i < files.length; i++) {
                    model.uploadPackage(context.parameters.distroName, component, files[i], creds,  (err, result) => {
                        ractive.push('uploadResult', result);
                    });
                }
            });
        }
    });
}