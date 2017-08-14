var fs = require('fs');
var all = require('async-all');
var model = require('../../model.js');

var jquery = require('jquery');
var tokenfield = require('bootstrap-tokenfield')(jquery);

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
            context.content.distro = context.content.distros[context.parameters.distroName];
            ractive.decorators.tokenfield = (node) => {
                var n = jquery(node);
                n.tokenfield({
                    autocomplete: {
                        source: context.content.distro.components,
                        delay: 100
                    },
                    showAutocompleteOnFocus: true
                });
                n.on('tokenfield:createtoken', (event) => {
                    n.tokenfield('getTokens').forEach((x) => {
                        if (x.value === event.attrs.value) {
                            event.preventDefault();
                        }
                    });
                });

                return {
                    teardown: () => { }
                }
            };
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
        activate: function(context) {
            var creds = model.getCredentials();
            var uploadResult = []
            ractive = context.domApi;
            // save current distro (context.content.distros inherited from parent state)
            context.content.distro = context.content.distros[context.parameters.distroName];
            ractive.set('distro', context.content.distro);
            ractive.set('uploadResult', uploadResult);
            ractive.on('browse', function(event) {
                uploadResult = {};
                ractive.update('uploadResult');
                this.find('#pkgFileInput').click();
            });
            ractive.on('selectFiles', function(context, files) {
                ractive.set('pkgFiles', files);
            });
            ractive.on('uploadFiles', function(ractive_context, component) {
                var files = ractive.get('pkgFiles');
                if (files === undefined) {
                    alert("Select files to upload");
                    return;
                }
                for(var i = 0; i < files.length; i++) {
                    uploadResult[files[i].name] = {filename: files[i].name, pending: true, message: 'Pending', package: 'N/A', version: 'N/A'};
                    ractive.set('uploadResult', uploadResult);
                    model.uploadPackage(context.parameters.distroName, component, files[i], creds,  (err, result) => {
                        uploadResult[result.filename].package = result.package;
                        uploadResult[result.filename].version = result.version;
                        uploadResult[result.filename].success = result.success;
                        uploadResult[result.filename].pending = false;
                        uploadResult[result.filename].message = result.success?"Success":("Failed: " + result.message);
                        ractive.set('uploadResult', uploadResult);
                    });
                }
            });
        }
    });
}