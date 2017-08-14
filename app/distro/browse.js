var fs = require('fs');
var all = require('async-all');
var model = require('../../model.js');

var jquery = require('jquery');
var tokenfield = require('../../vendor/bootstrap-tokenfield.js')(jquery);

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
            var ractive = context.domApi;
            context.content.distro = context.content.distros[context.parameters.distroName];
            var packages = context.content.searchResult[context.parameters.distroName]

            ractive.decorators.tokenfield = (node, index, package, version, components) => {
                var n = jquery(node);
                n.tokenfield({
                    autocomplete: {
                        source: context.content.distro.components,
                        delay: 100,
                    },
                    showAutocompleteOnFocus: true,
                    baseUrl: n[0].baseURI,
                });
                n.on('tokenfield:createtoken', (event) => {
                    if (context.content.distro.components.indexOf(event.attrs.value) === -1) {
                        //non-existent component
                        event.preventDefault();
                    }
                     
                    /*if (components.indexOf(event.attrs.value) != -1) {
                        //duplicate component
                        event.preventDefault();
                    }*/

                    // XXX TODO SHIT FUCK: ractive's model could be out of sync, so check against tokenfield's tokens
                    n.tokenfield('getTokens').forEach((x) => {
                        if (x.value === event.attrs.value) {
                            event.preventDefault();
                        }
                    });

                });

                n.on('tokenfield:createdtoken', (event) => {
                    jquery(event.relatedTarget).addClass('duplicate');
                    model.copyPackage(context.parameters.distroName, package, version, components[0], event.attrs.value, creds)
                        .then( (r) => { 
                            packages[index].components.push(event.attrs.value);
                            console.log(packages[index]);
                            jquery(event.relatedTarget).removeClass('duplicate');
                        })
                        .catch( (err) => { 
                            alert('Failed to copy package to "' + event.attrs.value + '": ' + err);
                            jquery(event.relatedTarget).removeClass('duplicate');
                            jquery(event.relatedTarget).addClass('invalid');
                        });
                });

                n.on('tokenfield:removetoken', (event) => {
                    // don't like how it looks like: tag is removed immidiately but actual removal is still pending 
                    // (and may even fail without updating the view)
                    jquery(event.relatedTarget).addClass('duplicate');
                    model.removePackage(context.parameters.distroName, package, version, event.attrs.value, creds)
                        .then( (r) => { 
                            packages[index].components = packages[index].components.filter((x) => { return x != event.attrs.value });
                            jquery(event.relatedTarget).removeClass('duplicate');
                            //n.tokenfield('setTokens', packages[index].components);
                            ractive.set('packages', packages);
                            ractive.updateModel('packages', true);

                        })
                        .catch( (err) => { 
                            alert('Failed to remove package from "' + event.attrs.value + '": ' + err);
                            jquery(event.relatedTarget).removeClass('duplicate');
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
            ractive.set('packages', packages);
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