(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (Buffer){

var jwtDecode = require('jwt-decode');
var model = require('../model.js');

module.exports = function (stateRouter) {
    stateRouter.addState({
        name: 'app',
        route: '/app',
        defaultChild: 'distro',
        template: Buffer("PG5hdiBjbGFzcz0ibmF2YmFyIG5hdmJhci1pbnZlcnNlIG5hdmJhci1maXhlZC10b3AiPg0KICAgIDxkaXYgY2xhc3M9ImNvbnRhaW5lci1mbHVpZCI+DQogICAgICAgIDxkaXYgY2xhc3M9Im5hdmJhci1oZWFkZXIiPg0KICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJuYXZiYXItdG9nZ2xlIGNvbGxhcHNlZCIgZGF0YS10b2dnbGU9ImNvbGxhcHNlIiBkYXRhLXRhcmdldD0iI25hdmJhciIgYXJpYS1leHBhbmRlZD0iZmFsc2UiDQogICAgICAgICAgICAgICAgYXJpYS1jb250cm9scz0ibmF2YmFyIj4NCiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0ic3Itb25seSI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+DQogICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9Imljb24tYmFyIj48L3NwYW4+DQogICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9Imljb24tYmFyIj48L3NwYW4+DQogICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9Imljb24tYmFyIj48L3NwYW4+DQogICAgICAgICAgICA8L2J1dHRvbj4NCiAgICAgICAgICAgIDxhIGNsYXNzPSJuYXZiYXItYnJhbmQiIGhyZWY9IiMiPkNhY3VzIGF0IHt7Y2FjdXNfdXJsfX08L2E+DQogICAgICAgIDwvZGl2Pg0KICAgICAgICA8ZGl2IGlkPSJuYXZiYXIiIGNsYXNzPSJuYXZiYXItY29sbGFwc2UgY29sbGFwc2UiPg0KICAgICAgICAgICAgPHVsIGNsYXNzPSJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHQiPg0KICAgICAgICAgICAgICAgIDxsaT48cCBjbGFzcz0ibmF2YmFyLXRleHQiPkxvZ2dlZCBpbiBhcyB7e2NhY3VzX3VzZXJ9fTwvcD48L2xpPg0KICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPSJ7eyBtYWtlUGF0aCgnbG9naW4nKSB9fSIgb24tY2xpY2s9ImxvZ291dCI+TG9nb3V0PC9hPjwvbGk+DQogICAgICAgICAgICA8L3VsPg0KICAgICAgICA8L2Rpdj4NCiAgICA8L2Rpdj4NCjwvbmF2Pg0KDQo8dWktdmlldz48L3VpLXZpZXc+","base64").toString(),
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
            ractive.on('logout', function() {
                model.saveCredentials(null, null);
                stateRouter.go('login');
            });
        }
    })

    require('./distro/distro')(stateRouter);
}
}).call(this,require("buffer").Buffer)
},{"../model.js":6,"./distro/distro":3,"buffer":18,"jwt-decode":31}],2:[function(require,module,exports){
(function (Buffer){

var all = require('async-all');
var model = require('../../../model.js');
var moment = require('moment');

module.exports = function (stateRouter) {
    stateRouter.addState({
        name: 'app.distro.browse',
        route: '/:distroName',
        template: Buffer("PGgxIGNsYXNzPSJwYWdlLWhlYWRlciI+RGlzdHJvIHt7ZGlzdHJvLmRpc3Ryb319OiB7e2Rpc3Ryby5kZXNjcmlwdGlvbn19PC9oMT4NCg0KPGRpdiBjbGFzcz0icm93Ij4NCiAgICA8ZGl2IGNsYXNzPSJjb2wteHMtNiBjb2wtc20tMyBwbGFjZWhvbGRlciI+DQogICAgICAgIDxoMT57e2Rpc3Ryby5wYWNrYWdlc319PC9oMT4NCiAgICAgICAgPGg0PlRvdGFsIHBhY2thZ2VzPC9oND4NCiAgICA8L2Rpdj4NCiAgICA8ZGl2IGNsYXNzPSJjb2wteHMtNiBjb2wtc20tMyBwbGFjZWhvbGRlciI+DQogICAgICAgIDxoMT57eyAgZm9ybWF0RGF0ZShkaXN0cm8ubGFzdHVwZGF0ZWQpIH19PC9oMT4NCiAgICAgICAgPGg0Pkxhc3QgdXBkYXRlZDwvaDQ+DQogICAgPC9kaXY+DQo8L2Rpdj4NCg0KPGgyIGNsYXNzPSJzdWItaGVhZGVyIj5QYWNrYWdlczwvaDI+DQo8dWwgY2xhc3MgPSAibmF2IG5hdi1waWxscyIgcm9sZT0idGFibGlzdCI+DQogICAge3sjZWFjaCBkaXN0cm8uY29tcG9uZW50c319DQogICAgPGxpIHJvbGU9InByZXNlbnRhdGlvbiIgYXMtYWN0aXZlPSInYXBwLmRpc3Ryby5icm93c2UucGFja2FnZXMnLCB7Y29tcG9uZW50OiB0aGlzfSwgJ2FjdGl2ZSciPg0KICAgICAgICA8YSBocmVmPSJ7eyBtYWtlUGF0aCgnYXBwLmRpc3Ryby5icm93c2UucGFja2FnZXMnLCB7ZGlzdHJvTmFtZTogZGlzdHJvLmRpc3RybywgY29tcG9uZW50OiB0aGlzfSkgfX0iPnt7dGhpc319IDxzcGFuIGNsYXNzPSJiYWRnZSI+MTM4PC9zcGFuPjwvYT48L2xpPg0KICAgIHt7L2VhY2h9fQ0KPC91bD4NCjx1aS12aWV3PjwvdWktdmlldz4=","base64").toString(),
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
        template: Buffer("PHA+U2VsZWN0IGRpc3RybyBmcm9tIHRoZSBsaXN0IHRvIHZpZXcgaXRzIGNvbnRlbnRzPC9wPg==","base64").toString()
    });

    stateRouter.addState({
        name: 'app.distro.browse.packages',
        route: '/:component',
        template: Buffer("PGRpdiBjbGFzcz0idGFibGUtcmVzcG9uc2l2ZSI+DQogICAgPHRhYmxlIGNsYXNzPSJ0YWJsZSB0YWJsZS1zdHJpcGVkIj4NCiAgICAgICAgPHRoZWFkPg0KICAgICAgICAgICAgPHRyPg0KICAgICAgICAgICAgICAgIDx0aD5QYWNrYWdlPC90aD4NCiAgICAgICAgICAgICAgICA8dGg+VmVyc2lvbjwvdGg+DQogICAgICAgICAgICAgICAgPHRoPkRlc2NyaXB0aW9uPC90aD4NCiAgICAgICAgICAgIDwvdHI+DQogICAgICAgIDwvdGhlYWQ+DQogICAgICAgIDx0Ym9keT4NCiAgICAgICAgICAgIHt7I2VhY2ggcGFja2FnZXN9fQ0KICAgICAgICAgICAgPHRyPg0KICAgICAgICAgICAgICAgIDx0ZD57e3BhY2thZ2V9fTwvdGQ+DQogICAgICAgICAgICAgICAgPHRkPnt7dmVyc2lvbn19PC90ZD4NCiAgICAgICAgICAgICAgICA8dGQ+e3tkZXNjcmlwdGlvbn19PC90ZD4NCiAgICAgICAgICAgIDwvdHI+DQogICAgICAgICAgICB7ey9lYWNofX0NCiAgICAgICAgPC90Ym9keT4NCiAgICA8L3RhYmxlPg0KPC9kaXY+","base64").toString(),
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
}).call(this,require("buffer").Buffer)
},{"../../../model.js":6,"async-all":16,"buffer":18,"moment":32}],3:[function(require,module,exports){
(function (Buffer){

var all = require('async-all');
var model = require('../../model.js');

module.exports = function (stateRouter) {
    stateRouter.addState({
        name: 'app.distro',
        route: '/distro',
        defaultChild: 'no-distro',
        template: Buffer("PGRpdiBjbGFzcz0iY29udGFpbmVyLWZsdWlkIj4KICAgIDxkaXYgY2xhc3M9InJvdyI+CiAgICAgICAgPGRpdiBjbGFzcz0iY29sLXNtLTIgc2lkZWJhciI+CiAgICAgICAgICAgIDx1bCBjbGFzcz0ibmF2IG5hdi1zaWRlYmFyIj4KICAgICAgICAgICAgICAgIDxsaT48aDM+RGlzdHJpYnV0aW9uczwvaDM+PC9saT4KICAgICAgICAgICAgICAgIHt7I2VhY2ggZGlzdHJvc319CiAgICAgICAgICAgICAgICA8bGkgYXMtYWN0aXZlPSInYXBwLmRpc3Ryby5icm93c2UnLCB7ZGlzdHJvTmFtZTogZGlzdHJvfSwgJ2FjdGl2ZSciPgogICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9Int7IG1ha2VQYXRoKCdhcHAuZGlzdHJvLmJyb3dzZScsIHsgZGlzdHJvTmFtZTogZGlzdHJvIH0pIH19Ij57e2Rpc3Ryb319PC9hPjwvbGk+CiAgICAgICAgICAgICAgICB7e2Vsc2V9fQogICAgICAgICAgICAgICAgPGxpIGNsYXNzPSJkaXNhYmxlZCI+T2gsIG5vIGRpc3Ryb3MgZm91bmQ8L2xpPgogICAgICAgICAgICAgICAge3svZWFjaH19CiAgICAgICAgICAgIDwvdWw+CiAgICAgICAgPC9kaXY+CiAgICAgICAgPGRpdiBjbGFzcz0iY29sLXNtLTEwIGNvbC1zbS1vZmZzZXQtMiBtYWluIj4KICAgICAgICAgICAgPHVpLXZpZXc+PC91aS12aWV3PgogICAgICAgIDwvZGl2PgogICAgPC9kaXY+CjwvZGl2Pg==","base64").toString(),
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

    require('./browse/browse')(stateRouter);
}
}).call(this,require("buffer").Buffer)
},{"../../model.js":6,"./browse/browse":2,"async-all":16,"buffer":18}],4:[function(require,module,exports){
var StateRouter = require('abstract-state-router')
var Ractive = require('ractive')
var ractiveRenderer = require('ractive-state-router')
var domready = require('domready')

var stateRouter = StateRouter(ractiveRenderer(Ractive, {}), 'body')

stateRouter.setMaxListeners(20)

require('./login/login')(stateRouter)
require('./app/app')(stateRouter)

domready(function() {
	stateRouter.evaluateCurrentRoute('login')
})

},{"./app/app":1,"./login/login":5,"abstract-state-router":8,"domready":21,"ractive":41,"ractive-state-router":40}],5:[function(require,module,exports){
(function (Buffer){

var model = require('../model.js')

module.exports = function (stateRouter) {
    stateRouter.addState({
        name: 'login',
        route: '/login',
        template: Buffer("PGRpdiBjbGFzcz0iY29udGFpbmVyIj4KICAgIDxmb3JtIGNsYXNzPSJmb3JtLXNpZ25pbiIgb25zdWJtaXQ9InJldHVybiBmYWxzZSIgb24tc3VibWl0PSJsb2dpbiIgYWN0aW9uPSIiPgogICAgICAgIDxoMiBjbGFzcz0iZm9ybS1zaWduaW4taGVhZGluZyI+UGxlYXNlIGxvZyBpbjwvaDI+CgogICAgICAgIDxsYWJlbCBmb3I9ImlucHV0VXJsIiBjbGFzcz0ic3Itb25seSI+Q2FjdXMgQVBJIGVuZHBvaW50IFVSTDwvbGFiZWw+CiAgICAgICAgPGlucHV0IHR5cGU9InVybCIgaWQ9ImlucHV0VXJsIiBjbGFzcz0iZm9ybS1jb250cm9sIiBwbGFjZWhvbGRlcj0iQ2FjdXMgQVBJIGVuZHBvaW50IFVSTCIKICAgICAgICAgICAgcmVxdWlyZWQgYXV0b2ZvY3VzIHZhbHVlPSJ7e2NhY3VzX3VybH19Ij4KCiAgICAgICAgPGxhYmVsIGZvcj0iaW5wdXRUb2tlbiIgY2xhc3M9InNyLW9ubHkiPlRva2VuPC9sYWJlbD4KICAgICAgICA8aW5wdXQgdHlwZT0icGFzc3dvcmQiIGlkPSJpbnB1dFRva2VuIiBjbGFzcz0iZm9ybS1jb250cm9sIiBwbGFjZWhvbGRlcj0iVG9rZW4iCiAgICAgICAgICAgIHJlcXVpcmVkIHZhbHVlPSJ7e2NhY3VzX3Rva2VufX0iPgoKICAgICAgICA8YnV0dG9uIGNsYXNzPSJidG4gYnRuLWxnIGJ0bi1wcmltYXJ5IGJ0bi1ibG9jayIgdHlwZT0ic3VibWl0Ij5Mb2cgaW48L2J1dHRvbj4KICAgIDwvZm9ybT4KPC9kaXY+","base64").toString(),
        activate: function (context) {
            var ractive = context.domApi;
            var credentials = model.getCredentials();
            console.log("Credentials: %s", credentials);
            if (credentials.token) {
                stateRouter.go('app');
            } else {
                ractive.set('cacus_url', model.getCredentials().url);
                ractive.on('login', function () {
                    model.saveCredentials(ractive.get('cacus_url'), ractive.get('cacus_token'));
                    stateRouter.go('app');
                    return false;
                })
            }
        }
    })
}
}).call(this,require("buffer").Buffer)
},{"../model.js":6,"buffer":18}],6:[function(require,module,exports){
//var EventEmitter = require('events').EventEmitter;
var Cookie = require('js-cookie');

/*var emitter = new EventEmitter();

module.exports = emitter;

emitter.saveCredentials = saveCredentials;
emitter.getCredentials = getCredentials;
emitter.getDistros = getDistros;
*/

module.exports = {
    saveCredentials: saveCredentials,
    getCredentials: getCredentials,
    getDistros: getDistros,
    getDistro: getDistro,
    getPackages: getPackages,
};

function saveCredentials(url, token) {
    if (token == null) {
        // keep cacusURL, but remove token
        Cookie.remove('cacusToken');
    } else {
        Cookie.set("cacusURL", url, {expires: 7});
        Cookie.set("cacusToken", token, {expires: 7, secure: window.location.hostname != "localhost"});
    }
}

function getCredentials() {
    return {
        url: Cookie.get('cacusURL'),
        token: Cookie.get('cacusToken'),
    };
}

function getDistros(creds, cb) {
    var headers = new Headers({
        'Authorization': 'Bearer ' + creds.token
    });
    var url = creds.url + '/api/v1/distro/show';
    var opts = { method: 'GET', mode: 'cors', headers: headers };
    fetch(url, opts).then(function(response) {
        return response.json();
    }).then(function(d) {
        if (d.success) {
            cb(null, d.result);
        }
    }).catch(function(err) {return null});
}

function getDistro(distro, creds, cb) {
    var headers = new Headers({
        'Authorization': 'Bearer ' + creds.token
    });
    var url = creds.url + '/api/v1/distro/show/' + distro;
    var opts = { method: 'GET', mode: 'cors', headers: headers };
    fetch(url, opts).then(function(response) {
        return response.json();
    }).then(function(d) {
        if (d.success) {
            cb(null, d.result[0]);
        }
    }).catch(function(err) {return null});
}

function getPackages(distro, component, creds, cb) {
    var headers = new Headers({
        'Authorization': 'Bearer ' + creds.token,
        'Content-Type': 'application/json',
    });
    var url = creds.url + '/api/v1/package/search/' + distro;
    var opts = { method: 'POST', body: JSON.stringify({pkg: '.', comp: component}), mode: 'cors', headers: headers };
    fetch(url, opts).then(function(response) {
        return response.json();
    }).then(function(d) {
        if (d.success) {
            cb(null, d.result);
        }
    }).catch(function(err) {return null});
}
},{"js-cookie":28}],7:[function(require,module,exports){
module.exports = { reverse: false }
},{}],8:[function(require,module,exports){
var StateState = require('./lib/state-state')
var StateComparison = require('./lib/state-comparison')
var CurrentState = require('./lib/current-state')
var stateChangeLogic = require('./lib/state-change-logic')
var parse = require('./lib/state-string-parser')
var StateTransitionManager = require('./lib/state-transition-manager')
var defaultRouterOptions = require('./default-router-options.js')

var series = require('./lib/promise-map-series')
var denodeify = require('then-denodeify')

var EventEmitter = require('eventemitter3')
var extend = require('xtend')
var newHashBrownRouter = require('hash-brown-router')
var combine = require('combine-arrays')
var buildPath = require('page-path-builder')
var nextTick = require('iso-next-tick')

require('native-promise-only/npo')

var expectedPropertiesOfAddState = [ 'name', 'route', 'defaultChild', 'data', 'template', 'resolve', 'activate', 'querystringParameters', 'defaultQuerystringParameters', 'defaultParameters' ]

module.exports = function StateProvider(makeRenderer, rootElement, stateRouterOptions) {
	var prototypalStateHolder = StateState()
	var lastCompletelyLoadedState = CurrentState()
	var lastStateStartedActivating = CurrentState()
	var stateProviderEmitter = new EventEmitter()
	StateTransitionManager(stateProviderEmitter)
	stateRouterOptions = extend({
		throwOnError: true,
		pathPrefix: '#'
	}, stateRouterOptions)

	if (!stateRouterOptions.router) {
		stateRouterOptions.router = newHashBrownRouter(defaultRouterOptions)
	}

	stateRouterOptions.router.on('not found', function(route, parameters) {
		stateProviderEmitter.emit('routeNotFound', route, parameters)
	})

	var destroyDom = null
	var getDomChild = null
	var renderDom = null
	var resetDom = null

	var activeDomApis = {}
	var activeStateResolveContent = {}
	var activeEmitters = {}

	function handleError(event, err) {
		nextTick(function() {
			stateProviderEmitter.emit(event, err)
			console.error(event + ' - ' + err.message)
			if (stateRouterOptions.throwOnError) {
				throw err
			}
		})
	}

	function destroyStateName(stateName) {
		var state = prototypalStateHolder.get(stateName)
		stateProviderEmitter.emit('beforeDestroyState', {
			state: state,
			domApi: activeDomApis[stateName]
		})

		activeEmitters[stateName].emit('destroy')
		activeEmitters[stateName].removeAllListeners()
		delete activeEmitters[stateName]
		delete activeStateResolveContent[stateName]

		return destroyDom(activeDomApis[stateName]).then(function() {
			delete activeDomApis[stateName]
			stateProviderEmitter.emit('afterDestroyState', {
				state: state
			})
		})
	}

	function resetStateName(parameters, stateName) {
		var domApi = activeDomApis[stateName]
		var content = getContentObject(activeStateResolveContent, stateName)
		var state = prototypalStateHolder.get(stateName)

		stateProviderEmitter.emit('beforeResetState', {
			domApi: domApi,
			content: content,
			state: state,
			parameters: parameters
		})

		activeEmitters[stateName].emit('destroy')
		delete activeEmitters[stateName]

		return resetDom({
			domApi: domApi,
			content: content,
			template: state.template,
			parameters: parameters
		}).then(function(newDomApi) {
			if (newDomApi) {
				activeDomApis[stateName] = newDomApi
			}

			stateProviderEmitter.emit('afterResetState', {
				domApi: activeDomApis[stateName],
				content: content,
				state: state,
				parameters: parameters
			})
		})
	}

	function getChildElementForStateName(stateName) {
		return new Promise(function(resolve) {
			var parent = prototypalStateHolder.getParent(stateName)
			if (parent) {
				var parentDomApi = activeDomApis[parent.name]
				resolve(getDomChild(parentDomApi))
			} else {
				resolve(rootElement)
			}
		})
	}

	function renderStateName(parameters, stateName) {
		return getChildElementForStateName(stateName).then(function(childElement) {
			var state = prototypalStateHolder.get(stateName)
			var content = getContentObject(activeStateResolveContent, stateName)

			stateProviderEmitter.emit('beforeCreateState', {
				state: state,
				content: content,
				parameters: parameters
			})

			return renderDom({
				element: childElement,
				template: state.template,
				content: content,
				parameters: parameters
			}).then(function(domApi) {
				activeDomApis[stateName] = domApi
				stateProviderEmitter.emit('afterCreateState', {
					state: state,
					domApi: domApi,
					content: content,
					parameters: parameters
				})
				return domApi
			})
		})
	}

	function renderAll(stateNames, parameters) {
		return series(stateNames, renderStateName.bind(null, parameters))
	}

	function onRouteChange(state, parameters) {
		try {
			var finalDestinationStateName = prototypalStateHolder.applyDefaultChildStates(state.name)

			if (finalDestinationStateName === state.name) {
				emitEventAndAttemptStateChange(finalDestinationStateName, parameters)
			} else {
				// There are default child states that need to be applied

				var theRouteWeNeedToEndUpAt = makePath(finalDestinationStateName, parameters)
				var currentRoute = stateRouterOptions.router.location.get()

				if (theRouteWeNeedToEndUpAt === currentRoute) {
					// the child state has the same route as the current one, just start navigating there
					emitEventAndAttemptStateChange(finalDestinationStateName, parameters)
				} else {
					// change the url to match the full default child state route
					stateProviderEmitter.go(finalDestinationStateName, parameters, { replace: true })
				}
			}
		} catch (err) {
			handleError('stateError', err)
		}
	}

	function addState(state) {
		if (typeof state === 'undefined') {
			throw new Error('Expected \'state\' to be passed in.')
		} else if (typeof state.name === 'undefined') {
			throw new Error('Expected the \'name\' option to be passed in.')
		} else if (typeof state.template === 'undefined') {
			throw new Error('Expected the \'template\' option to be passed in.')
		}
		Object.keys(state).filter(function(key) {
			return expectedPropertiesOfAddState.indexOf(key) === -1
		}).forEach(function(key) {
			console.warn('Unexpected property passed to addState:', key)
		})

		prototypalStateHolder.add(state.name, state)

		var route = prototypalStateHolder.buildFullStateRoute(state.name)

		stateRouterOptions.router.add(route, onRouteChange.bind(null, state))
	}

	function getStatesToResolve(stateChanges) {
		return stateChanges.change.concat(stateChanges.create).map(prototypalStateHolder.get)
	}

	function emitEventAndAttemptStateChange(newStateName, parameters) {
		stateProviderEmitter.emit('stateChangeAttempt', function stateGo(transition) {
			attemptStateChange(newStateName, parameters, transition)
		})
	}

	function attemptStateChange(newStateName, parameters, transition) {
		function ifNotCancelled(fn) {
			return function() {
				if (transition.cancelled) {
					var err = new Error('The transition to ' + newStateName + 'was cancelled')
					err.wasCancelledBySomeoneElse = true
					throw err
				} else {
					return fn.apply(null, arguments)
				}
			}
		}

		return promiseMe(prototypalStateHolder.guaranteeAllStatesExist, newStateName)
		.then(function applyDefaultParameters() {
			var state = prototypalStateHolder.get(newStateName)
			var defaultParams = state.defaultParameters || state.defaultQuerystringParameters || {}
			var needToApplyDefaults = Object.keys(defaultParams).some(function missingParameterValue(param) {
				return typeof parameters[param] === 'undefined'
			})

			if (needToApplyDefaults) {
				throw redirector(newStateName, extend(defaultParams, parameters))
			}
			return state
		}).then(ifNotCancelled(function(state) {
			stateProviderEmitter.emit('stateChangeStart', state, parameters)
			lastStateStartedActivating.set(state.name, parameters)
		})).then(function getStateChanges() {
			var stateComparisonResults = StateComparison(prototypalStateHolder)(lastCompletelyLoadedState.get().name, lastCompletelyLoadedState.get().parameters, newStateName, parameters)
			return stateChangeLogic(stateComparisonResults) // { destroy, change, create }
		}).then(ifNotCancelled(function resolveDestroyAndActivateStates(stateChanges) {
			return resolveStates(getStatesToResolve(stateChanges), extend(parameters)).catch(function onResolveError(e) {
				e.stateChangeError = true
				throw e
			}).then(ifNotCancelled(function destroyAndActivate(stateResolveResultsObject) {
				transition.cancellable = false

				function activateAll() {
					var statesToActivate = stateChanges.change.concat(stateChanges.create)

					return activateStates(statesToActivate)
				}

				activeStateResolveContent = extend(activeStateResolveContent, stateResolveResultsObject)

				return series(reverse(stateChanges.destroy), destroyStateName).then(function() {
					return series(reverse(stateChanges.change), resetStateName.bind(null, extend(parameters)))
				}).then(function() {
					return renderAll(stateChanges.create, extend(parameters)).then(activateAll)
				})
			}))

			function activateStates(stateNames) {
				return stateNames.map(prototypalStateHolder.get).forEach(function(state) {
					var emitter = new EventEmitter()
					var context = Object.create(emitter)
					context.domApi = activeDomApis[state.name]
					context.data = state.data
					context.parameters = parameters
					context.content = getContentObject(activeStateResolveContent, state.name)
					activeEmitters[state.name] = emitter

					try {
						state.activate && state.activate(context)
					} catch (e) {
						nextTick(function() {
							throw e
						})
					}
				})
			}
		})).then(function stateChangeComplete() {
			lastCompletelyLoadedState.set(newStateName, parameters)
			try {
				stateProviderEmitter.emit('stateChangeEnd', prototypalStateHolder.get(newStateName), parameters)
			} catch (e) {
				handleError('stateError', e)
			}
		}).catch(ifNotCancelled(function handleStateChangeError(err) {
			if (err && err.redirectTo) {
				stateProviderEmitter.emit('stateChangeCancelled', err)
				return stateProviderEmitter.go(err.redirectTo.name, err.redirectTo.params, { replace: true })
			} else if (err) {
				handleError('stateChangeError', err)
			}
		})).catch(function handleCancellation(err) {
			if (err && err.wasCancelledBySomeoneElse) {
				// we don't care, the state transition manager has already emitted the stateChangeCancelled for us
			} else {
				throw new Error("This probably shouldn't happen, maybe file an issue or something " + err)
			}
		})
	}

	function makePath(stateName, parameters, options) {
		function getGuaranteedPreviousState() {
			if (!lastStateStartedActivating.get().name) {
				throw new Error('makePath required a previous state to exist, and none was found')
			}
			return lastStateStartedActivating.get()
		}
		if (options && options.inherit) {
			parameters = extend(getGuaranteedPreviousState().parameters, parameters)
		}

		var destinationStateName = stateName === null ? getGuaranteedPreviousState().name : stateName

		var destinationState = prototypalStateHolder.get(destinationStateName) || {}
		var defaultParams = destinationState.defaultParameters || destinationState.defaultQuerystringParameters

		parameters = extend(defaultParams, parameters)

		prototypalStateHolder.guaranteeAllStatesExist(destinationStateName)
		var route = prototypalStateHolder.buildFullStateRoute(destinationStateName)
		return buildPath(route, parameters || {})
	}

	var defaultOptions = {
		replace: false
	}

	stateProviderEmitter.addState = addState
	stateProviderEmitter.go = function go(newStateName, parameters, options) {
		options = extend(defaultOptions, options)
		var goFunction = options.replace ? stateRouterOptions.router.replace : stateRouterOptions.router.go

		return promiseMe(makePath, newStateName, parameters, options).then(goFunction, handleError.bind(null, 'stateChangeError'))
	}
	stateProviderEmitter.evaluateCurrentRoute = function evaluateCurrentRoute(defaultState, defaultParams) {
		return promiseMe(makePath, defaultState, defaultParams).then(function(defaultPath) {
			stateRouterOptions.router.evaluateCurrent(defaultPath)
		}).catch(function(err) {
			handleError('stateError', err)
		})
	}
	stateProviderEmitter.makePath = function makePathAndPrependHash(stateName, parameters, options) {
		return stateRouterOptions.pathPrefix + makePath(stateName, parameters, options)
	}
	stateProviderEmitter.stateIsActive = function stateIsActive(stateName, opts) {
		var currentState = lastCompletelyLoadedState.get()
		return (currentState.name === stateName || currentState.name.indexOf(stateName + '.') === 0) && (typeof opts === 'undefined' || Object.keys(opts).every(function matches(key) {
			return opts[key] === currentState.parameters[key]
		}))
	}

	var renderer = makeRenderer(stateProviderEmitter)

	destroyDom = denodeify(renderer.destroy)
	getDomChild = denodeify(renderer.getChildElement)
	renderDom = denodeify(renderer.render)
	resetDom = denodeify(renderer.reset)

	return stateProviderEmitter
}

function getContentObject(stateResolveResultsObject, stateName) {
	var allPossibleResolvedStateNames = parse(stateName)

	return allPossibleResolvedStateNames.filter(function(stateName) {
		return stateResolveResultsObject[stateName]
	}).reduce(function(obj, stateName) {
		return extend(obj, stateResolveResultsObject[stateName])
	}, {})
}

function redirector(newStateName, parameters) {
	return {
		redirectTo: {
			name: newStateName,
			params: parameters
		}
	}
}

// { [stateName]: resolveResult }
function resolveStates(states, parameters) {
	var statesWithResolveFunctions = states.filter(isFunction('resolve'))
	var stateNamesWithResolveFunctions = statesWithResolveFunctions.map(property('name'))
	var resolves = Promise.all(statesWithResolveFunctions.map(function(state) {
		return new Promise(function(resolve, reject) {
			function resolveCb(err, content) {
				err ? reject(err) : resolve(content)
			}

			resolveCb.redirect = function redirect(newStateName, parameters) {
				reject(redirector(newStateName, parameters))
			}

			var res = state.resolve(state.data, parameters, resolveCb)
			if (res && (typeof res === 'object' || typeof res === 'function') && typeof res.then === 'function') {
				resolve(res)
			}
		})
	}))

	return resolves.then(function(resolveResults) {
		return combine({
			stateName: stateNamesWithResolveFunctions,
			resolveResult: resolveResults
		}).reduce(function(obj, result) {
			obj[result.stateName] = result.resolveResult
			return obj
		}, {})
	})
}

function property(name) {
	return function(obj) {
		return obj[name]
	}
}

function reverse(ary) {
	return ary.slice().reverse()
}

function isFunction(property) {
	return function(obj) {
		return typeof obj[property] === 'function'
	}
}

function promiseMe() {
	var fn = Array.prototype.shift.apply(arguments)
	var args = arguments
	return new Promise(function(resolve) {
		resolve(fn.apply(null, args))
	})
}

},{"./default-router-options.js":7,"./lib/current-state":9,"./lib/promise-map-series":10,"./lib/state-change-logic":11,"./lib/state-comparison":12,"./lib/state-state":13,"./lib/state-string-parser":14,"./lib/state-transition-manager":15,"combine-arrays":20,"eventemitter3":22,"hash-brown-router":24,"iso-next-tick":27,"native-promise-only/npo":33,"page-path-builder":35,"then-denodeify":43,"xtend":44}],9:[function(require,module,exports){
module.exports = function CurrentState() {
	var current = {
		name: '',
		parameters: {}
	}

	return {
		get: function() {
			return current
		},
		set: function(name, parameters) {
			current = {
				name: name,
				parameters: parameters
			}
		}
	}
}

},{}],10:[function(require,module,exports){
// Pulled from https://github.com/joliss/promise-map-series and prettied up a bit

var Promise = require('native-promise-only/npo')

module.exports = function sequence(array, iterator, thisArg) {
	var current = Promise.resolve()
	var cb = arguments.length > 2 ? iterator.bind(thisArg) : iterator

	var results = array.map(function(value, i) {
		return current = current.then(function(j) {
			return cb(value, j, array)
		}.bind(null, i))
	})

	return Promise.all(results)
}

},{"native-promise-only/npo":33}],11:[function(require,module,exports){
module.exports = function stateChangeLogic(stateComparisonResults) {
	var hitChangingState = false
	var hitDestroyedState = false

	var output = {
		destroy: [],
		change: [],
		create: []
	}

	stateComparisonResults.forEach(function(state) {
		hitChangingState = hitChangingState || state.stateParametersChanged
		hitDestroyedState = hitDestroyedState || state.stateNameChanged

		if (state.nameBefore) {
			if (hitDestroyedState) {
				output.destroy.push(state.nameBefore)
			} else if (hitChangingState) {
				output.change.push(state.nameBefore)
			}
		}

		if (state.nameAfter && hitDestroyedState) {
			output.create.push(state.nameAfter)
		}
	})

	return output
}

},{}],12:[function(require,module,exports){
var stateStringParser = require('./state-string-parser')
var combine = require('combine-arrays')
var pathToRegexp = require('path-to-regexp-with-reversible-keys')

module.exports = function StateComparison(stateState) {
	var getPathParameters = pathParameters()

	var parametersChanged = parametersThatMatterWereChanged.bind(null, stateState, getPathParameters)

	return stateComparison.bind(null, parametersChanged)
}

function pathParameters() {
	var parameters = {}

	return function getPathParameters(path) {
		if (!path) {
			return []
		}

		if (!parameters[path]) {
			parameters[path] = pathToRegexp(path).keys.map(function(key) {
				return key.name
			})
		}

		return parameters[path]
	}
}

function parametersThatMatterWereChanged(stateState, getPathParameters, stateName, fromParameters, toParameters) {
	var state = stateState.get(stateName)
	var querystringParameters = state.querystringParameters || []
	var parameters = getPathParameters(state.route).concat(querystringParameters)

	return Array.isArray(parameters) && parameters.some(function(key) {
		return fromParameters[key] !== toParameters[key]
	})
}

function stateComparison(parametersChanged, originalState, originalParameters, newState, newParameters) {
	var states = combine({
		start: stateStringParser(originalState),
		end: stateStringParser(newState)
	})

	return states.map(function(states) {
		return {
			nameBefore: states.start,
			nameAfter: states.end,
			stateNameChanged: states.start !== states.end,
			stateParametersChanged: states.start === states.end && parametersChanged(states.start, originalParameters, newParameters)
		}
	})
}

},{"./state-string-parser":14,"combine-arrays":20,"path-to-regexp-with-reversible-keys":37}],13:[function(require,module,exports){
var stateStringParser = require('./state-string-parser')
var parse = require('./state-string-parser')

module.exports = function StateState() {
	var states = {}

	function getHierarchy(name) {
		var names = stateStringParser(name)

		return names.map(function(name) {
			if (!states[name]) {
				throw new Error('State ' + name + ' not found')
			}
			return states[name]
		})
	}

	function getParent(name) {
		var parentName = getParentName(name)

		return parentName && states[parentName]
	}

	function getParentName(name) {
		var names = stateStringParser(name)

		if (names.length > 1) {
			var secondToLast = names.length - 2

			return names[secondToLast]
		} else {
			return null
		}
	}

	function guaranteeAllStatesExist(newStateName) {
		var stateNames = parse(newStateName)
		var statesThatDontExist = stateNames.filter(function(name) {
			return !states[name]
		})

		if (statesThatDontExist.length > 0) {
			throw new Error('State ' + statesThatDontExist[statesThatDontExist.length - 1] + ' does not exist')
		}
	}

	function buildFullStateRoute(stateName) {
		return getHierarchy(stateName).map(function(state) {
			return '/' + (state.route || '')
		}).join('').replace(/\/{2,}/g, '/')
	}

	function applyDefaultChildStates(stateName) {
		var state = states[stateName]

		function getDefaultChildStateName() {
			return state && (typeof state.defaultChild === 'function'
				? state.defaultChild()
				: state.defaultChild)
		}

		var defaultChildStateName = getDefaultChildStateName()

		if (!defaultChildStateName) {
			return stateName
		}

		var fullStateName = stateName + '.' + defaultChildStateName

		return applyDefaultChildStates(fullStateName)
	}


	return {
		add: function(name, state) {
			states[name] = state
		},
		get: function(name) {
			return name && states[name]
		},
		getHierarchy: getHierarchy,
		getParent: getParent,
		getParentName: getParentName,
		guaranteeAllStatesExist: guaranteeAllStatesExist,
		buildFullStateRoute: buildFullStateRoute,
		applyDefaultChildStates: applyDefaultChildStates
	}
}

},{"./state-string-parser":14}],14:[function(require,module,exports){
module.exports = function(stateString) {
	return stateString.split('.').reduce(function(stateNames, latestNameChunk) {
		if (stateNames.length) {
			latestNameChunk = stateNames[stateNames.length - 1] + '.' + latestNameChunk
		}
		stateNames.push(latestNameChunk)
		return stateNames
	}, [])
}

},{}],15:[function(require,module,exports){
module.exports = function (emitter) {
	var currentTransitionAttempt = null
	var nextTransition = null

	function doneTransitioning() {
		currentTransitionAttempt = null
		if (nextTransition) {
			beginNextTransitionAttempt()
		}
	}

	function isTransitioning() {
		return !!currentTransitionAttempt
	}

	function beginNextTransitionAttempt() {
		currentTransitionAttempt = nextTransition
		nextTransition = null
		currentTransitionAttempt.beginStateChange()
	}

	function cancelCurrentTransition() {
		currentTransitionAttempt.transition.cancelled = true
		var err = new Error('State transition cancelled by the state transition manager')
		err.wasCancelledBySomeoneElse = true
		emitter.emit('stateChangeCancelled', err)
	}

	emitter.on('stateChangeAttempt', function(beginStateChange) {
		nextTransition = createStateTransitionAttempt(beginStateChange)

		if (isTransitioning() && currentTransitionAttempt.transition.cancellable) {
			cancelCurrentTransition()
		} else if (!isTransitioning()) {
			beginNextTransitionAttempt()
		}
	})

	emitter.on('stateChangeError', doneTransitioning)
	emitter.on('stateChangeCancelled', doneTransitioning)
	emitter.on('stateChangeEnd', doneTransitioning)

	function createStateTransitionAttempt(beginStateChange) {
		var transition = {
			cancelled: false,
			cancellable: true
		}
		return {
			transition: transition,
			beginStateChange: beginStateChange.bind(null, transition)
		}
	}
}

},{}],16:[function(require,module,exports){
(function (process){
module.exports = function all(o, cb) {
	var responded = false
	var zalgoIsAtTheDoor = true
	var running = 0
	var results = {}
	var errorResponse = null

	if (!o || typeof o !== 'object' || Array.isArray(o)) {
		throw new Error('async-all requires you to pass in an object!')
	}

	function respond() {
		function callCallback() {
			if (typeof cb === 'function') {
				if (errorResponse) {
					cb(errorResponse)
				} else {
					cb(null, results)
				}
			}
		}

		if (zalgoIsAtTheDoor) {
			process.nextTick(callCallback)
		} else {
			callCallback()
		}
	}

	function respondIfItMakesSense() {
		if (running === 0 && !responded) {
			respond()
			responded = true
		}
	}

	Object.keys(o).forEach(function(key) {
		var receivedResponse = false
		if (typeof o[key] === 'function') {
			running++
			o[key](function(err, value) {
				if (!receivedResponse) {
					receivedResponse = true
					running--
					if (!errorResponse) {
						if (err) {
							errorResponse = err
						} else {
							results[key] = value
						}
					}
					respondIfItMakesSense()
				}
			})
		} else {
			results[key] = o[key]
		}
	})

	respondIfItMakesSense()
	zalgoIsAtTheDoor = false
}

}).call(this,require('_process'))
},{"_process":38}],17:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],18:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    this.length = 0
    this.parent = undefined
  }

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
} else {
  // pre-set for values that may exist in the future
  Buffer.prototype.length = undefined
  Buffer.prototype.parent = undefined
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":17,"ieee754":25,"isarray":19}],19:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],20:[function(require,module,exports){
module.exports = function(obj) {
	var keys = Object.keys(obj)

	keys.forEach(function(key) {
		if (!Array.isArray(obj[key])) {
			throw new Error(key + ' is not an array')
		}
	})

	var maxIndex = keys.reduce(function(maxSoFar, key) {
		var len = obj[key].length
		return maxSoFar > len ? maxSoFar : len
	}, 0)

	var output = []

	function getObject(index) {
		var o = {}
		keys.forEach(function(key) {
			o[key] = obj[key][index]
		})
		return o
	}

	for (var i = 0; i < maxIndex; ++i) {
		output.push(getObject(i))
	}

	return output
}

},{}],21:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn)
  }

});

},{}],22:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @api private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Remove the listeners of a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {Mixed} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}],23:[function(require,module,exports){
var EventEmitter = require('eventemitter3')

module.exports = function HashLocation(window) {
	var emitter = new EventEmitter()
	var last = ''
	var needToDecode = getNeedToDecode()

	window.addEventListener('hashchange', function() {
		if (last !== emitter.get()) {
			last = emitter.get()
			emitter.emit('hashchange')
		}
	})

	emitter.go = go.bind(null, window)
	emitter.replace = replace.bind(null, window)
	emitter.get = get.bind(null, window, needToDecode)

	return emitter
}

function replace(window, newPath) {
	window.location.replace(everythingBeforeTheSlash(window.location.href) + '#' + newPath)
}

function everythingBeforeTheSlash(url) {
	var hashIndex = url.indexOf('#')
	return hashIndex === -1 ? url : url.substring(0, hashIndex)
}

function go(window, newPath) {
	window.location.hash = newPath
}

function get(window, needToDecode) {
	var hash = removeHashFromPath(window.location.hash)
	return needToDecode ? decodeURI(hash) : hash
}

function removeHashFromPath(path) {
	return (path && path[0] === '#') ? path.substr(1) : path
}

function getNeedToDecode() {
	var a = document.createElement('a')
	a.href = '#x x'
	return !/x x/.test(a.hash)
}

},{"eventemitter3":22}],24:[function(require,module,exports){
var pathToRegexp = require('path-to-regexp-with-reversible-keys')
var qs = require('query-string')
var xtend = require('xtend')
var browserHashLocation = require('./hash-location.js')
var EventEmitter = require('eventemitter3')

module.exports = function Router(opts, hashLocation) {
	var emitter = new EventEmitter()
	if (isHashLocation(opts)) {
		hashLocation = opts
		opts = null
	}

	opts = opts || {}

	if (!hashLocation) {
		hashLocation = browserHashLocation(window)
	}

	function onNotFound(path, queryStringParameters) {
		emitter.emit('not found', path, queryStringParameters)
	}

	var routes = []

	var onHashChange = evaluateCurrentPath.bind(null, routes, hashLocation, !!opts.reverse, onNotFound)

	hashLocation.on('hashchange', onHashChange)

	function stop() {
		hashLocation.removeListener('hashchange', onHashChange)
	}

	emitter.add = add.bind(null, routes)
	emitter.stop = stop
	emitter.evaluateCurrent = evaluateCurrentPathOrGoToDefault.bind(null, routes, hashLocation, !!opts.reverse, onNotFound)
	emitter.replace = hashLocation.replace
	emitter.go = hashLocation.go
	emitter.location = hashLocation

	return emitter
}

function evaluateCurrentPath(routes, hashLocation, reverse, onNotFound) {
	evaluatePath(routes, hashLocation.get(), reverse, onNotFound)
}

function getPathParts(path) {
	var chunks = path.split('?')
	return {
		path: chunks.shift(),
		queryString: qs.parse(chunks.join(''))
	}
}

function evaluatePath(routes, path, reverse, onNotFound) {
	var pathParts = getPathParts(path)
	path = pathParts.path
	var queryStringParameters = pathParts.queryString

	var matchingRoute = find((reverse ? reverseArray(routes) : routes), path)

	if (matchingRoute) {
		var regexResult = matchingRoute.exec(path)
		var routeParameters = makeParametersObjectFromRegexResult(matchingRoute.keys, regexResult)
		var params = xtend(queryStringParameters, routeParameters)
		matchingRoute.fn(params)
	} else {
		onNotFound(path, queryStringParameters)
	}
}

function reverseArray(ary) {
	return ary.slice().reverse()
}

function makeParametersObjectFromRegexResult(keys, regexResult) {
	return keys.reduce(function(memo, urlKey, index) {
		memo[urlKey.name] = regexResult[index + 1]
		return memo
	}, {})
}

function add(routes, routeString, routeFunction) {
	if (typeof routeFunction !== 'function') {
		throw new Error('The router add function must be passed a callback function')
	}
	var newRoute = pathToRegexp(routeString)
	newRoute.fn = routeFunction
	routes.push(newRoute)
}

function evaluateCurrentPathOrGoToDefault(routes, hashLocation, reverse, onNotFound, defaultPath) {
	const currentLocation = hashLocation.get()
	if (currentLocation && currentLocation !== '/') {
		var routesCopy = routes.slice()

		evaluateCurrentPath(routesCopy, hashLocation, reverse, onNotFound)
	} else {
		hashLocation.go(defaultPath)
	}
}

function isHashLocation(hashLocation) {
	return hashLocation && hashLocation.go && hashLocation.replace && hashLocation.on
}

function find(aryOfRegexes, str) {
	for (var i = 0; i < aryOfRegexes.length; ++i) {
		if (str.match(aryOfRegexes[i])) {
			return aryOfRegexes[i]
		}
	}
}

},{"./hash-location.js":23,"eventemitter3":22,"path-to-regexp-with-reversible-keys":37,"query-string":39,"xtend":44}],25:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],26:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],27:[function(require,module,exports){
module.exports = function (fn) {
  typeof setImmediate === 'function' ?
    setImmediate(fn) :
    setTimeout(fn, 0)
}

},{}],28:[function(require,module,exports){
/*!
 * JavaScript Cookie v2.1.4
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

},{}],29:[function(require,module,exports){
/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message) {
  this.message = message;
}

InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function polyfill (input) {
  var str = String(input).replace(/=+$/, '');
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}


module.exports = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;

},{}],30:[function(require,module,exports){
var atob = require('./atob');

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = '0' + code;
    }
    return '%' + code;
  }));
}

module.exports = function(str) {
  var output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }

  try{
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};

},{"./atob":29}],31:[function(require,module,exports){
'use strict';

var base64_url_decode = require('./base64_url_decode');

function InvalidTokenError(message) {
  this.message = message;
}

InvalidTokenError.prototype = new Error();
InvalidTokenError.prototype.name = 'InvalidTokenError';

module.exports = function (token,options) {
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Invalid token specified');
  }

  options = options || {};
  var pos = options.header === true ? 0 : 1;
  try {
    return JSON.parse(base64_url_decode(token.split('.')[pos]));
  } catch (e) {
    throw new InvalidTokenError('Invalid token specified: ' + e.message);
  }
};

module.exports.InvalidTokenError = InvalidTokenError;

},{"./base64_url_decode":30}],32:[function(require,module,exports){
//! moment.js
//! version : 2.18.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

var hookCallback;

function hooks () {
    return hookCallback.apply(null, arguments);
}

// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback (callback) {
    hookCallback = callback;
}

function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

function isObject(input) {
    // IE8 will treat undefined and null as object if it wasn't for
    // input != null
    return input != null && Object.prototype.toString.call(input) === '[object Object]';
}

function isObjectEmpty(obj) {
    var k;
    for (k in obj) {
        // even if its not own property I'd still call it non-empty
        return false;
    }
    return true;
}

function isUndefined(input) {
    return input === void 0;
}

function isNumber(input) {
    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}

function map(arr, fn) {
    var res = [], i;
    for (i = 0; i < arr.length; ++i) {
        res.push(fn(arr[i], i));
    }
    return res;
}

function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}

function extend(a, b) {
    for (var i in b) {
        if (hasOwnProp(b, i)) {
            a[i] = b[i];
        }
    }

    if (hasOwnProp(b, 'toString')) {
        a.toString = b.toString;
    }

    if (hasOwnProp(b, 'valueOf')) {
        a.valueOf = b.valueOf;
    }

    return a;
}

function createUTC (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, true).utc();
}

function defaultParsingFlags() {
    // We need to deep clone this object.
    return {
        empty           : false,
        unusedTokens    : [],
        unusedInput     : [],
        overflow        : -2,
        charsLeftOver   : 0,
        nullInput       : false,
        invalidMonth    : null,
        invalidFormat   : false,
        userInvalidated : false,
        iso             : false,
        parsedDateParts : [],
        meridiem        : null,
        rfc2822         : false,
        weekdayMismatch : false
    };
}

function getParsingFlags(m) {
    if (m._pf == null) {
        m._pf = defaultParsingFlags();
    }
    return m._pf;
}

var some;
if (Array.prototype.some) {
    some = Array.prototype.some;
} else {
    some = function (fun) {
        var t = Object(this);
        var len = t.length >>> 0;

        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(this, t[i], i, t)) {
                return true;
            }
        }

        return false;
    };
}

var some$1 = some;

function isValid(m) {
    if (m._isValid == null) {
        var flags = getParsingFlags(m);
        var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
            return i != null;
        });
        var isNowValid = !isNaN(m._d.getTime()) &&
            flags.overflow < 0 &&
            !flags.empty &&
            !flags.invalidMonth &&
            !flags.invalidWeekday &&
            !flags.nullInput &&
            !flags.invalidFormat &&
            !flags.userInvalidated &&
            (!flags.meridiem || (flags.meridiem && parsedParts));

        if (m._strict) {
            isNowValid = isNowValid &&
                flags.charsLeftOver === 0 &&
                flags.unusedTokens.length === 0 &&
                flags.bigHour === undefined;
        }

        if (Object.isFrozen == null || !Object.isFrozen(m)) {
            m._isValid = isNowValid;
        }
        else {
            return isNowValid;
        }
    }
    return m._isValid;
}

function createInvalid (flags) {
    var m = createUTC(NaN);
    if (flags != null) {
        extend(getParsingFlags(m), flags);
    }
    else {
        getParsingFlags(m).userInvalidated = true;
    }

    return m;
}

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties = hooks.momentProperties = [];

function copyConfig(to, from) {
    var i, prop, val;

    if (!isUndefined(from._isAMomentObject)) {
        to._isAMomentObject = from._isAMomentObject;
    }
    if (!isUndefined(from._i)) {
        to._i = from._i;
    }
    if (!isUndefined(from._f)) {
        to._f = from._f;
    }
    if (!isUndefined(from._l)) {
        to._l = from._l;
    }
    if (!isUndefined(from._strict)) {
        to._strict = from._strict;
    }
    if (!isUndefined(from._tzm)) {
        to._tzm = from._tzm;
    }
    if (!isUndefined(from._isUTC)) {
        to._isUTC = from._isUTC;
    }
    if (!isUndefined(from._offset)) {
        to._offset = from._offset;
    }
    if (!isUndefined(from._pf)) {
        to._pf = getParsingFlags(from);
    }
    if (!isUndefined(from._locale)) {
        to._locale = from._locale;
    }

    if (momentProperties.length > 0) {
        for (i = 0; i < momentProperties.length; i++) {
            prop = momentProperties[i];
            val = from[prop];
            if (!isUndefined(val)) {
                to[prop] = val;
            }
        }
    }

    return to;
}

var updateInProgress = false;

// Moment prototype object
function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    if (!this.isValid()) {
        this._d = new Date(NaN);
    }
    // Prevent infinite loop in case updateOffset creates new moment
    // objects.
    if (updateInProgress === false) {
        updateInProgress = true;
        hooks.updateOffset(this);
        updateInProgress = false;
    }
}

function isMoment (obj) {
    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
}

function absFloor (number) {
    if (number < 0) {
        // -0 -> 0
        return Math.ceil(number) || 0;
    } else {
        return Math.floor(number);
    }
}

function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
    }

    return value;
}

// compare two arrays, return the number of differences
function compareArrays(array1, array2, dontConvert) {
    var len = Math.min(array1.length, array2.length),
        lengthDiff = Math.abs(array1.length - array2.length),
        diffs = 0,
        i;
    for (i = 0; i < len; i++) {
        if ((dontConvert && array1[i] !== array2[i]) ||
            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
            diffs++;
        }
    }
    return diffs + lengthDiff;
}

function warn(msg) {
    if (hooks.suppressDeprecationWarnings === false &&
            (typeof console !==  'undefined') && console.warn) {
        console.warn('Deprecation warning: ' + msg);
    }
}

function deprecate(msg, fn) {
    var firstTime = true;

    return extend(function () {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(null, msg);
        }
        if (firstTime) {
            var args = [];
            var arg;
            for (var i = 0; i < arguments.length; i++) {
                arg = '';
                if (typeof arguments[i] === 'object') {
                    arg += '\n[' + i + '] ';
                    for (var key in arguments[0]) {
                        arg += key + ': ' + arguments[0][key] + ', ';
                    }
                    arg = arg.slice(0, -2); // Remove trailing comma and space
                } else {
                    arg = arguments[i];
                }
                args.push(arg);
            }
            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
            firstTime = false;
        }
        return fn.apply(this, arguments);
    }, fn);
}

var deprecations = {};

function deprecateSimple(name, msg) {
    if (hooks.deprecationHandler != null) {
        hooks.deprecationHandler(name, msg);
    }
    if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
    }
}

hooks.suppressDeprecationWarnings = false;
hooks.deprecationHandler = null;

function isFunction(input) {
    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
}

function set (config) {
    var prop, i;
    for (i in config) {
        prop = config[i];
        if (isFunction(prop)) {
            this[i] = prop;
        } else {
            this['_' + i] = prop;
        }
    }
    this._config = config;
    // Lenient ordinal parsing accepts just a number in addition to
    // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
    // TODO: Remove "ordinalParse" fallback in next major release.
    this._dayOfMonthOrdinalParseLenient = new RegExp(
        (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
            '|' + (/\d{1,2}/).source);
}

function mergeConfigs(parentConfig, childConfig) {
    var res = extend({}, parentConfig), prop;
    for (prop in childConfig) {
        if (hasOwnProp(childConfig, prop)) {
            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                res[prop] = {};
                extend(res[prop], parentConfig[prop]);
                extend(res[prop], childConfig[prop]);
            } else if (childConfig[prop] != null) {
                res[prop] = childConfig[prop];
            } else {
                delete res[prop];
            }
        }
    }
    for (prop in parentConfig) {
        if (hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])) {
            // make sure changes to properties don't modify parent config
            res[prop] = extend({}, res[prop]);
        }
    }
    return res;
}

function Locale(config) {
    if (config != null) {
        this.set(config);
    }
}

var keys;

if (Object.keys) {
    keys = Object.keys;
} else {
    keys = function (obj) {
        var i, res = [];
        for (i in obj) {
            if (hasOwnProp(obj, i)) {
                res.push(i);
            }
        }
        return res;
    };
}

var keys$1 = keys;

var defaultCalendar = {
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    nextWeek : 'dddd [at] LT',
    lastDay : '[Yesterday at] LT',
    lastWeek : '[Last] dddd [at] LT',
    sameElse : 'L'
};

function calendar (key, mom, now) {
    var output = this._calendar[key] || this._calendar['sameElse'];
    return isFunction(output) ? output.call(mom, now) : output;
}

var defaultLongDateFormat = {
    LTS  : 'h:mm:ss A',
    LT   : 'h:mm A',
    L    : 'MM/DD/YYYY',
    LL   : 'MMMM D, YYYY',
    LLL  : 'MMMM D, YYYY h:mm A',
    LLLL : 'dddd, MMMM D, YYYY h:mm A'
};

function longDateFormat (key) {
    var format = this._longDateFormat[key],
        formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
        return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
        return val.slice(1);
    });

    return this._longDateFormat[key];
}

var defaultInvalidDate = 'Invalid date';

function invalidDate () {
    return this._invalidDate;
}

var defaultOrdinal = '%d';
var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

function ordinal (number) {
    return this._ordinal.replace('%d', number);
}

var defaultRelativeTime = {
    future : 'in %s',
    past   : '%s ago',
    s  : 'a few seconds',
    ss : '%d seconds',
    m  : 'a minute',
    mm : '%d minutes',
    h  : 'an hour',
    hh : '%d hours',
    d  : 'a day',
    dd : '%d days',
    M  : 'a month',
    MM : '%d months',
    y  : 'a year',
    yy : '%d years'
};

function relativeTime (number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return (isFunction(output)) ?
        output(number, withoutSuffix, string, isFuture) :
        output.replace(/%d/i, number);
}

function pastFuture (diff, output) {
    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
}

var aliases = {};

function addUnitAlias (unit, shorthand) {
    var lowerCase = unit.toLowerCase();
    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
}

function normalizeUnits(units) {
    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}

function normalizeObjectUnits(inputObject) {
    var normalizedInput = {},
        normalizedProp,
        prop;

    for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
                normalizedInput[normalizedProp] = inputObject[prop];
            }
        }
    }

    return normalizedInput;
}

var priorities = {};

function addUnitPriority(unit, priority) {
    priorities[unit] = priority;
}

function getPrioritizedUnits(unitsObj) {
    var units = [];
    for (var u in unitsObj) {
        units.push({unit: u, priority: priorities[u]});
    }
    units.sort(function (a, b) {
        return a.priority - b.priority;
    });
    return units;
}

function makeGetSet (unit, keepTime) {
    return function (value) {
        if (value != null) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
        } else {
            return get(this, unit);
        }
    };
}

function get (mom, unit) {
    return mom.isValid() ?
        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
}

function set$1 (mom, unit, value) {
    if (mom.isValid()) {
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }
}

// MOMENTS

function stringGet (units) {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
        return this[units]();
    }
    return this;
}


function stringSet (units, value) {
    if (typeof units === 'object') {
        units = normalizeObjectUnits(units);
        var prioritized = getPrioritizedUnits(units);
        for (var i = 0; i < prioritized.length; i++) {
            this[prioritized[i].unit](units[prioritized[i].unit]);
        }
    } else {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units](value);
        }
    }
    return this;
}

function zeroFill(number, targetLength, forceSign) {
    var absNumber = '' + Math.abs(number),
        zerosToFill = targetLength - absNumber.length,
        sign = number >= 0;
    return (sign ? (forceSign ? '+' : '') : '-') +
        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}

var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

var formatFunctions = {};

var formatTokenFunctions = {};

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken (token, padded, ordinal, callback) {
    var func = callback;
    if (typeof callback === 'string') {
        func = function () {
            return this[callback]();
        };
    }
    if (token) {
        formatTokenFunctions[token] = func;
    }
    if (padded) {
        formatTokenFunctions[padded[0]] = function () {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
    }
    if (ordinal) {
        formatTokenFunctions[ordinal] = function () {
            return this.localeData().ordinal(func.apply(this, arguments), token);
        };
    }
}

function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
    var array = format.match(formattingTokens), i, length;

    for (i = 0, length = array.length; i < length; i++) {
        if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
        } else {
            array[i] = removeFormattingTokens(array[i]);
        }
    }

    return function (mom) {
        var output = '', i;
        for (i = 0; i < length; i++) {
            output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
        }
        return output;
    };
}

// format date using native date object
function formatMoment(m, format) {
    if (!m.isValid()) {
        return m.localeData().invalidDate();
    }

    format = expandFormat(format, m.localeData());
    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

    return formatFunctions[format](m);
}

function expandFormat(format, locale) {
    var i = 5;

    function replaceLongDateFormatTokens(input) {
        return locale.longDateFormat(input) || input;
    }

    localFormattingTokens.lastIndex = 0;
    while (i >= 0 && localFormattingTokens.test(format)) {
        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        localFormattingTokens.lastIndex = 0;
        i -= 1;
    }

    return format;
}

var match1         = /\d/;            //       0 - 9
var match2         = /\d\d/;          //      00 - 99
var match3         = /\d{3}/;         //     000 - 999
var match4         = /\d{4}/;         //    0000 - 9999
var match6         = /[+-]?\d{6}/;    // -999999 - 999999
var match1to2      = /\d\d?/;         //       0 - 99
var match3to4      = /\d\d\d\d?/;     //     999 - 9999
var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
var match1to3      = /\d{1,3}/;       //       0 - 999
var match1to4      = /\d{1,4}/;       //       0 - 9999
var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

var matchUnsigned  = /\d+/;           //       0 - inf
var matchSigned    = /[+-]?\d+/;      //    -inf - inf

var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


var regexes = {};

function addRegexToken (token, regex, strictRegex) {
    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
        return (isStrict && strictRegex) ? strictRegex : regex;
    };
}

function getParseRegexForToken (token, config) {
    if (!hasOwnProp(regexes, token)) {
        return new RegExp(unescapeFormat(token));
    }

    return regexes[token](config._strict, config._locale);
}

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function unescapeFormat(s) {
    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
        return p1 || p2 || p3 || p4;
    }));
}

function regexEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var tokens = {};

function addParseToken (token, callback) {
    var i, func = callback;
    if (typeof token === 'string') {
        token = [token];
    }
    if (isNumber(callback)) {
        func = function (input, array) {
            array[callback] = toInt(input);
        };
    }
    for (i = 0; i < token.length; i++) {
        tokens[token[i]] = func;
    }
}

function addWeekParseToken (token, callback) {
    addParseToken(token, function (input, array, config, token) {
        config._w = config._w || {};
        callback(input, config._w, config, token);
    });
}

function addTimeToArrayFromToken(token, input, config) {
    if (input != null && hasOwnProp(tokens, token)) {
        tokens[token](input, config._a, config, token);
    }
}

var YEAR = 0;
var MONTH = 1;
var DATE = 2;
var HOUR = 3;
var MINUTE = 4;
var SECOND = 5;
var MILLISECOND = 6;
var WEEK = 7;
var WEEKDAY = 8;

var indexOf;

if (Array.prototype.indexOf) {
    indexOf = Array.prototype.indexOf;
} else {
    indexOf = function (o) {
        // I know
        var i;
        for (i = 0; i < this.length; ++i) {
            if (this[i] === o) {
                return i;
            }
        }
        return -1;
    };
}

var indexOf$1 = indexOf;

function daysInMonth(year, month) {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

// FORMATTING

addFormatToken('M', ['MM', 2], 'Mo', function () {
    return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function (format) {
    return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function (format) {
    return this.localeData().months(this, format);
});

// ALIASES

addUnitAlias('month', 'M');

// PRIORITY

addUnitPriority('month', 8);

// PARSING

addRegexToken('M',    match1to2);
addRegexToken('MM',   match1to2, match2);
addRegexToken('MMM',  function (isStrict, locale) {
    return locale.monthsShortRegex(isStrict);
});
addRegexToken('MMMM', function (isStrict, locale) {
    return locale.monthsRegex(isStrict);
});

addParseToken(['M', 'MM'], function (input, array) {
    array[MONTH] = toInt(input) - 1;
});

addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    // if we didn't find a month name, mark the date as invalid.
    if (month != null) {
        array[MONTH] = month;
    } else {
        getParsingFlags(config).invalidMonth = input;
    }
});

// LOCALES

var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
function localeMonths (m, format) {
    if (!m) {
        return isArray(this._months) ? this._months :
            this._months['standalone'];
    }
    return isArray(this._months) ? this._months[m.month()] :
        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
}

var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
function localeMonthsShort (m, format) {
    if (!m) {
        return isArray(this._monthsShort) ? this._monthsShort :
            this._monthsShort['standalone'];
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
}

function handleStrictParse(monthName, format, strict) {
    var i, ii, mom, llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
        // this is not used
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
        for (i = 0; i < 12; ++i) {
            mom = createUTC([2000, i]);
            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeMonthsParse (monthName, format, strict) {
    var i, mom, regex;

    if (this._monthsParseExact) {
        return handleStrictParse.call(this, monthName, format, strict);
    }

    if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
    }

    // TODO: add sorting
    // Sorting makes sure if one month (or abbr) is a prefix of another
    // see sorting in computeMonthsParse
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
        }
        if (!strict && !this._monthsParse[i]) {
            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
            return i;
        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
            return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
        }
    }
}

// MOMENTS

function setMonth (mom, value) {
    var dayOfMonth;

    if (!mom.isValid()) {
        // No op
        return mom;
    }

    if (typeof value === 'string') {
        if (/^\d+$/.test(value)) {
            value = toInt(value);
        } else {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (!isNumber(value)) {
                return mom;
            }
        }
    }

    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
}

function getSetMonth (value) {
    if (value != null) {
        setMonth(this, value);
        hooks.updateOffset(this, true);
        return this;
    } else {
        return get(this, 'Month');
    }
}

function getDaysInMonth () {
    return daysInMonth(this.year(), this.month());
}

var defaultMonthsShortRegex = matchWord;
function monthsShortRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsShortStrictRegex;
        } else {
            return this._monthsShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsShortRegex')) {
            this._monthsShortRegex = defaultMonthsShortRegex;
        }
        return this._monthsShortStrictRegex && isStrict ?
            this._monthsShortStrictRegex : this._monthsShortRegex;
    }
}

var defaultMonthsRegex = matchWord;
function monthsRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsStrictRegex;
        } else {
            return this._monthsRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsRegex')) {
            this._monthsRegex = defaultMonthsRegex;
        }
        return this._monthsStrictRegex && isStrict ?
            this._monthsStrictRegex : this._monthsRegex;
    }
}

function computeMonthsParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom;
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        shortPieces.push(this.monthsShort(mom, ''));
        longPieces.push(this.months(mom, ''));
        mixedPieces.push(this.months(mom, ''));
        mixedPieces.push(this.monthsShort(mom, ''));
    }
    // Sorting makes sure if one month (or abbr) is a prefix of another it
    // will match the longer piece.
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 12; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
    }
    for (i = 0; i < 24; i++) {
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}

// FORMATTING

addFormatToken('Y', 0, 0, function () {
    var y = this.year();
    return y <= 9999 ? '' + y : '+' + y;
});

addFormatToken(0, ['YY', 2], 0, function () {
    return this.year() % 100;
});

addFormatToken(0, ['YYYY',   4],       0, 'year');
addFormatToken(0, ['YYYYY',  5],       0, 'year');
addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// ALIASES

addUnitAlias('year', 'y');

// PRIORITIES

addUnitPriority('year', 1);

// PARSING

addRegexToken('Y',      matchSigned);
addRegexToken('YY',     match1to2, match2);
addRegexToken('YYYY',   match1to4, match4);
addRegexToken('YYYYY',  match1to6, match6);
addRegexToken('YYYYYY', match1to6, match6);

addParseToken(['YYYYY', 'YYYYYY'], YEAR);
addParseToken('YYYY', function (input, array) {
    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
});
addParseToken('YY', function (input, array) {
    array[YEAR] = hooks.parseTwoDigitYear(input);
});
addParseToken('Y', function (input, array) {
    array[YEAR] = parseInt(input, 10);
});

// HELPERS

function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// HOOKS

hooks.parseTwoDigitYear = function (input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
};

// MOMENTS

var getSetYear = makeGetSet('FullYear', true);

function getIsLeapYear () {
    return isLeapYear(this.year());
}

function createDate (y, m, d, h, M, s, ms) {
    // can't just apply() to create a date:
    // https://stackoverflow.com/q/181348
    var date = new Date(y, m, d, h, M, s, ms);

    // the date constructor remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
        date.setFullYear(y);
    }
    return date;
}

function createUTCDate (y) {
    var date = new Date(Date.UTC.apply(null, arguments));

    // the Date.UTC function remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
    }
    return date;
}

// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
        fwd = 7 + dow - doy,
        // first-week day local weekday -- which local weekday is fwd
        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

    return -fwdlw + fwd - 1;
}

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    var localWeekday = (7 + weekday - dow) % 7,
        weekOffset = firstWeekOffset(year, dow, doy),
        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
        resYear, resDayOfYear;

    if (dayOfYear <= 0) {
        resYear = year - 1;
        resDayOfYear = daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > daysInYear(year)) {
        resYear = year + 1;
        resDayOfYear = dayOfYear - daysInYear(year);
    } else {
        resYear = year;
        resDayOfYear = dayOfYear;
    }

    return {
        year: resYear,
        dayOfYear: resDayOfYear
    };
}

function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
        resWeek, resYear;

    if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
    } else {
        resYear = mom.year();
        resWeek = week;
    }

    return {
        week: resWeek,
        year: resYear
    };
}

function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy),
        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
}

// FORMATTING

addFormatToken('w', ['ww', 2], 'wo', 'week');
addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

// ALIASES

addUnitAlias('week', 'w');
addUnitAlias('isoWeek', 'W');

// PRIORITIES

addUnitPriority('week', 5);
addUnitPriority('isoWeek', 5);

// PARSING

addRegexToken('w',  match1to2);
addRegexToken('ww', match1to2, match2);
addRegexToken('W',  match1to2);
addRegexToken('WW', match1to2, match2);

addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input);
});

// HELPERS

// LOCALES

function localeWeek (mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
}

var defaultLocaleWeek = {
    dow : 0, // Sunday is the first day of the week.
    doy : 6  // The week that contains Jan 1st is the first week of the year.
};

function localeFirstDayOfWeek () {
    return this._week.dow;
}

function localeFirstDayOfYear () {
    return this._week.doy;
}

// MOMENTS

function getSetWeek (input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, 'd');
}

function getSetISOWeek (input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, 'd');
}

// FORMATTING

addFormatToken('d', 0, 'do', 'day');

addFormatToken('dd', 0, 0, function (format) {
    return this.localeData().weekdaysMin(this, format);
});

addFormatToken('ddd', 0, 0, function (format) {
    return this.localeData().weekdaysShort(this, format);
});

addFormatToken('dddd', 0, 0, function (format) {
    return this.localeData().weekdays(this, format);
});

addFormatToken('e', 0, 0, 'weekday');
addFormatToken('E', 0, 0, 'isoWeekday');

// ALIASES

addUnitAlias('day', 'd');
addUnitAlias('weekday', 'e');
addUnitAlias('isoWeekday', 'E');

// PRIORITY
addUnitPriority('day', 11);
addUnitPriority('weekday', 11);
addUnitPriority('isoWeekday', 11);

// PARSING

addRegexToken('d',    match1to2);
addRegexToken('e',    match1to2);
addRegexToken('E',    match1to2);
addRegexToken('dd',   function (isStrict, locale) {
    return locale.weekdaysMinRegex(isStrict);
});
addRegexToken('ddd',   function (isStrict, locale) {
    return locale.weekdaysShortRegex(isStrict);
});
addRegexToken('dddd',   function (isStrict, locale) {
    return locale.weekdaysRegex(isStrict);
});

addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
    var weekday = config._locale.weekdaysParse(input, token, config._strict);
    // if we didn't get a weekday name, mark the date as invalid
    if (weekday != null) {
        week.d = weekday;
    } else {
        getParsingFlags(config).invalidWeekday = input;
    }
});

addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
    week[token] = toInt(input);
});

// HELPERS

function parseWeekday(input, locale) {
    if (typeof input !== 'string') {
        return input;
    }

    if (!isNaN(input)) {
        return parseInt(input, 10);
    }

    input = locale.weekdaysParse(input);
    if (typeof input === 'number') {
        return input;
    }

    return null;
}

function parseIsoWeekday(input, locale) {
    if (typeof input === 'string') {
        return locale.weekdaysParse(input) % 7 || 7;
    }
    return isNaN(input) ? null : input;
}

// LOCALES

var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
function localeWeekdays (m, format) {
    if (!m) {
        return isArray(this._weekdays) ? this._weekdays :
            this._weekdays['standalone'];
    }
    return isArray(this._weekdays) ? this._weekdays[m.day()] :
        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
}

var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
function localeWeekdaysShort (m) {
    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
}

var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
function localeWeekdaysMin (m) {
    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
}

function handleStrictParse$1(weekdayName, format, strict) {
    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._minWeekdaysParse = [];

        for (i = 0; i < 7; ++i) {
            mom = createUTC([2000, 1]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeWeekdaysParse (weekdayName, format, strict) {
    var i, mom, regex;

    if (this._weekdaysParseExact) {
        return handleStrictParse$1.call(this, weekdayName, format, strict);
    }

    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._minWeekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._fullWeekdaysParse = [];
    }

    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already

        mom = createUTC([2000, 1]).day(i);
        if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
        }
        if (!this._weekdaysParse[i]) {
            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
            return i;
        }
    }
}

// MOMENTS

function getSetDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
        input = parseWeekday(input, this.localeData());
        return this.add(input - day, 'd');
    } else {
        return day;
    }
}

function getSetLocaleDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return input == null ? weekday : this.add(input - weekday, 'd');
}

function getSetISODayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }

    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.

    if (input != null) {
        var weekday = parseIsoWeekday(input, this.localeData());
        return this.day(this.day() % 7 ? weekday : weekday - 7);
    } else {
        return this.day() || 7;
    }
}

var defaultWeekdaysRegex = matchWord;
function weekdaysRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysStrictRegex;
        } else {
            return this._weekdaysRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            this._weekdaysRegex = defaultWeekdaysRegex;
        }
        return this._weekdaysStrictRegex && isStrict ?
            this._weekdaysStrictRegex : this._weekdaysRegex;
    }
}

var defaultWeekdaysShortRegex = matchWord;
function weekdaysShortRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysShortStrictRegex;
        } else {
            return this._weekdaysShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
        }
        return this._weekdaysShortStrictRegex && isStrict ?
            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
    }
}

var defaultWeekdaysMinRegex = matchWord;
function weekdaysMinRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysMinStrictRegex;
        } else {
            return this._weekdaysMinRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
        }
        return this._weekdaysMinStrictRegex && isStrict ?
            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
    }
}


function computeWeekdaysParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom, minp, shortp, longp;
    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, 1]).day(i);
        minp = this.weekdaysMin(mom, '');
        shortp = this.weekdaysShort(mom, '');
        longp = this.weekdays(mom, '');
        minPieces.push(minp);
        shortPieces.push(shortp);
        longPieces.push(longp);
        mixedPieces.push(minp);
        mixedPieces.push(shortp);
        mixedPieces.push(longp);
    }
    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
    // will match the longer piece.
    minPieces.sort(cmpLenRev);
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 7; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._weekdaysShortRegex = this._weekdaysRegex;
    this._weekdaysMinRegex = this._weekdaysRegex;

    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}

// FORMATTING

function hFormat() {
    return this.hours() % 12 || 12;
}

function kFormat() {
    return this.hours() || 24;
}

addFormatToken('H', ['HH', 2], 0, 'hour');
addFormatToken('h', ['hh', 2], 0, hFormat);
addFormatToken('k', ['kk', 2], 0, kFormat);

addFormatToken('hmm', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
});

addFormatToken('hmmss', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

addFormatToken('Hmm', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2);
});

addFormatToken('Hmmss', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

function meridiem (token, lowercase) {
    addFormatToken(token, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
    });
}

meridiem('a', true);
meridiem('A', false);

// ALIASES

addUnitAlias('hour', 'h');

// PRIORITY
addUnitPriority('hour', 13);

// PARSING

function matchMeridiem (isStrict, locale) {
    return locale._meridiemParse;
}

addRegexToken('a',  matchMeridiem);
addRegexToken('A',  matchMeridiem);
addRegexToken('H',  match1to2);
addRegexToken('h',  match1to2);
addRegexToken('k',  match1to2);
addRegexToken('HH', match1to2, match2);
addRegexToken('hh', match1to2, match2);
addRegexToken('kk', match1to2, match2);

addRegexToken('hmm', match3to4);
addRegexToken('hmmss', match5to6);
addRegexToken('Hmm', match3to4);
addRegexToken('Hmmss', match5to6);

addParseToken(['H', 'HH'], HOUR);
addParseToken(['k', 'kk'], function (input, array, config) {
    var kInput = toInt(input);
    array[HOUR] = kInput === 24 ? 0 : kInput;
});
addParseToken(['a', 'A'], function (input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
});
addParseToken(['h', 'hh'], function (input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
    getParsingFlags(config).bigHour = true;
});
addParseToken('Hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
});
addParseToken('Hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
});

// LOCALES

function localeIsPM (input) {
    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    // Using charAt should be more compatible.
    return ((input + '').toLowerCase().charAt(0) === 'p');
}

var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
function localeMeridiem (hours, minutes, isLower) {
    if (hours > 11) {
        return isLower ? 'pm' : 'PM';
    } else {
        return isLower ? 'am' : 'AM';
    }
}


// MOMENTS

// Setting the hour should keep the time, because the user explicitly
// specified which hour he wants. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
var getSetHour = makeGetSet('Hours', true);

// months
// week
// weekdays
// meridiem
var baseConfig = {
    calendar: defaultCalendar,
    longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    ordinal: defaultOrdinal,
    dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
    relativeTime: defaultRelativeTime,

    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,

    week: defaultLocaleWeek,

    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultLocaleWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,

    meridiemParse: defaultLocaleMeridiemParse
};

// internal storage for locale config files
var locales = {};
var localeFamilies = {};
var globalLocale;

function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
    var i = 0, j, next, locale, split;

    while (i < names.length) {
        split = normalizeLocale(names[i]).split('-');
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split('-') : null;
        while (j > 0) {
            locale = loadLocale(split.slice(0, j).join('-'));
            if (locale) {
                return locale;
            }
            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                //the next array item is better than a shallower substring of this one
                break;
            }
            j--;
        }
        i++;
    }
    return null;
}

function loadLocale(name) {
    var oldLocale = null;
    // TODO: Find a better way to register and load all the locales in Node
    if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
        try {
            oldLocale = globalLocale._abbr;
            require('./locale/' + name);
            // because defineLocale currently also sets the global locale, we
            // want to undo that for lazy loaded locales
            getSetGlobalLocale(oldLocale);
        } catch (e) { }
    }
    return locales[name];
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale (key, values) {
    var data;
    if (key) {
        if (isUndefined(values)) {
            data = getLocale(key);
        }
        else {
            data = defineLocale(key, values);
        }

        if (data) {
            // moment.duration._locale = moment._locale = data;
            globalLocale = data;
        }
    }

    return globalLocale._abbr;
}

function defineLocale (name, config) {
    if (config !== null) {
        var parentConfig = baseConfig;
        config.abbr = name;
        if (locales[name] != null) {
            deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
            parentConfig = locales[name]._config;
        } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
                parentConfig = locales[config.parentLocale]._config;
            } else {
                if (!localeFamilies[config.parentLocale]) {
                    localeFamilies[config.parentLocale] = [];
                }
                localeFamilies[config.parentLocale].push({
                    name: name,
                    config: config
                });
                return null;
            }
        }
        locales[name] = new Locale(mergeConfigs(parentConfig, config));

        if (localeFamilies[name]) {
            localeFamilies[name].forEach(function (x) {
                defineLocale(x.name, x.config);
            });
        }

        // backwards compat for now: also set the locale
        // make sure we set the locale AFTER all child locales have been
        // created, so we won't end up with the child locale set.
        getSetGlobalLocale(name);


        return locales[name];
    } else {
        // useful for testing
        delete locales[name];
        return null;
    }
}

function updateLocale(name, config) {
    if (config != null) {
        var locale, parentConfig = baseConfig;
        // MERGE
        if (locales[name] != null) {
            parentConfig = locales[name]._config;
        }
        config = mergeConfigs(parentConfig, config);
        locale = new Locale(config);
        locale.parentLocale = locales[name];
        locales[name] = locale;

        // backwards compat for now: also set the locale
        getSetGlobalLocale(name);
    } else {
        // pass null for config to unupdate, useful for tests
        if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
                locales[name] = locales[name].parentLocale;
            } else if (locales[name] != null) {
                delete locales[name];
            }
        }
    }
    return locales[name];
}

// returns locale data
function getLocale (key) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
    }

    if (!key) {
        return globalLocale;
    }

    if (!isArray(key)) {
        //short-circuit everything else
        locale = loadLocale(key);
        if (locale) {
            return locale;
        }
        key = [key];
    }

    return chooseLocale(key);
}

function listLocales() {
    return keys$1(locales);
}

function checkOverflow (m) {
    var overflow;
    var a = m._a;

    if (a && getParsingFlags(m).overflow === -2) {
        overflow =
            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
            -1;

        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
        }
        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
            overflow = WEEK;
        }
        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
            overflow = WEEKDAY;
        }

        getParsingFlags(m).overflow = overflow;
    }

    return m;
}

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

var isoDates = [
    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
    ['YYYY-DDD', /\d{4}-\d{3}/],
    ['YYYY-MM', /\d{4}-\d\d/, false],
    ['YYYYYYMMDD', /[+-]\d{10}/],
    ['YYYYMMDD', /\d{8}/],
    // YYYYMM is NOT allowed by the standard
    ['GGGG[W]WWE', /\d{4}W\d{3}/],
    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
    ['YYYYDDD', /\d{7}/]
];

// iso time formats and regexes
var isoTimes = [
    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
    ['HH:mm', /\d\d:\d\d/],
    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
    ['HHmmss', /\d\d\d\d\d\d/],
    ['HHmm', /\d\d\d\d/],
    ['HH', /\d\d/]
];

var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

// date from iso format
function configFromISO(config) {
    var i, l,
        string = config._i,
        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
        allowTime, dateFormat, timeFormat, tzFormat;

    if (match) {
        getParsingFlags(config).iso = true;

        for (i = 0, l = isoDates.length; i < l; i++) {
            if (isoDates[i][1].exec(match[1])) {
                dateFormat = isoDates[i][0];
                allowTime = isoDates[i][2] !== false;
                break;
            }
        }
        if (dateFormat == null) {
            config._isValid = false;
            return;
        }
        if (match[3]) {
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(match[3])) {
                    // match[2] should be 'T' or space
                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (timeFormat == null) {
                config._isValid = false;
                return;
            }
        }
        if (!allowTime && timeFormat != null) {
            config._isValid = false;
            return;
        }
        if (match[4]) {
            if (tzRegex.exec(match[4])) {
                tzFormat = 'Z';
            } else {
                config._isValid = false;
                return;
            }
        }
        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
        configFromStringAndFormat(config);
    } else {
        config._isValid = false;
    }
}

// RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
var basicRfcRegex = /^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(?:\d\d)?\d\d\s)(\d\d:\d\d)(\:\d\d)?(\s(?:UT|GMT|[ECMP][SD]T|[A-IK-Za-ik-z]|[+-]\d{4}))$/;

// date and time from ref 2822 format
function configFromRFC2822(config) {
    var string, match, dayFormat,
        dateFormat, timeFormat, tzFormat;
    var timezones = {
        ' GMT': ' +0000',
        ' EDT': ' -0400',
        ' EST': ' -0500',
        ' CDT': ' -0500',
        ' CST': ' -0600',
        ' MDT': ' -0600',
        ' MST': ' -0700',
        ' PDT': ' -0700',
        ' PST': ' -0800'
    };
    var military = 'YXWVUTSRQPONZABCDEFGHIKLM';
    var timezone, timezoneIndex;

    string = config._i
        .replace(/\([^\)]*\)|[\n\t]/g, ' ') // Remove comments and folding whitespace
        .replace(/(\s\s+)/g, ' ') // Replace multiple-spaces with a single space
        .replace(/^\s|\s$/g, ''); // Remove leading and trailing spaces
    match = basicRfcRegex.exec(string);

    if (match) {
        dayFormat = match[1] ? 'ddd' + ((match[1].length === 5) ? ', ' : ' ') : '';
        dateFormat = 'D MMM ' + ((match[2].length > 10) ? 'YYYY ' : 'YY ');
        timeFormat = 'HH:mm' + (match[4] ? ':ss' : '');

        // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
        if (match[1]) { // day of week given
            var momentDate = new Date(match[2]);
            var momentDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][momentDate.getDay()];

            if (match[1].substr(0,3) !== momentDay) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return;
            }
        }

        switch (match[5].length) {
            case 2: // military
                if (timezoneIndex === 0) {
                    timezone = ' +0000';
                } else {
                    timezoneIndex = military.indexOf(match[5][1].toUpperCase()) - 12;
                    timezone = ((timezoneIndex < 0) ? ' -' : ' +') +
                        (('' + timezoneIndex).replace(/^-?/, '0')).match(/..$/)[0] + '00';
                }
                break;
            case 4: // Zone
                timezone = timezones[match[5]];
                break;
            default: // UT or +/-9999
                timezone = timezones[' GMT'];
        }
        match[5] = timezone;
        config._i = match.splice(1).join('');
        tzFormat = ' ZZ';
        config._f = dayFormat + dateFormat + timeFormat + tzFormat;
        configFromStringAndFormat(config);
        getParsingFlags(config).rfc2822 = true;
    } else {
        config._isValid = false;
    }
}

// date from iso format or fallback
function configFromString(config) {
    var matched = aspNetJsonRegex.exec(config._i);

    if (matched !== null) {
        config._d = new Date(+matched[1]);
        return;
    }

    configFromISO(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    configFromRFC2822(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    // Final attempt, use Input Fallback
    hooks.createFromInputFallback(config);
}

hooks.createFromInputFallback = deprecate(
    'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
    'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
    'discouraged and will be removed in an upcoming major release. Please refer to ' +
    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
    function (config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    }
);

// Pick the first defined of two or three arguments.
function defaults(a, b, c) {
    if (a != null) {
        return a;
    }
    if (b != null) {
        return b;
    }
    return c;
}

function currentDateArray(config) {
    // hooks is actually the exported moment object
    var nowValue = new Date(hooks.now());
    if (config._useUTC) {
        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
    }
    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
}

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function configFromArray (config) {
    var i, date, input = [], currentDate, yearToUse;

    if (config._d) {
        return;
    }

    currentDate = currentDateArray(config);

    //compute day of the year from weeks and weekdays
    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
        dayOfYearFromWeekInfo(config);
    }

    //if the day of the year is set, figure out what it is
    if (config._dayOfYear != null) {
        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

        if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
            getParsingFlags(config)._overflowDayOfYear = true;
        }

        date = createUTCDate(yearToUse, 0, config._dayOfYear);
        config._a[MONTH] = date.getUTCMonth();
        config._a[DATE] = date.getUTCDate();
    }

    // Default to current date.
    // * if no year, month, day of month are given, default to today
    // * if day of month is given, default month and year
    // * if month is given, default only year
    // * if year is given, don't default anything
    for (i = 0; i < 3 && config._a[i] == null; ++i) {
        config._a[i] = input[i] = currentDate[i];
    }

    // Zero out whatever was not defaulted, including time
    for (; i < 7; i++) {
        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
    }

    // Check for 24:00:00.000
    if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
        config._nextDay = true;
        config._a[HOUR] = 0;
    }

    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
    // Apply timezone offset from input. The actual utcOffset can be changed
    // with parseZone.
    if (config._tzm != null) {
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    }

    if (config._nextDay) {
        config._a[HOUR] = 24;
    }
}

function dayOfYearFromWeekInfo(config) {
    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

    w = config._w;
    if (w.GG != null || w.W != null || w.E != null) {
        dow = 1;
        doy = 4;

        // TODO: We need to take the current isoWeekYear, but that depends on
        // how we interpret now (local, utc, fixed offset). So create
        // a now version of current config (take local/utc/offset flags, and
        // create now).
        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
        week = defaults(w.W, 1);
        weekday = defaults(w.E, 1);
        if (weekday < 1 || weekday > 7) {
            weekdayOverflow = true;
        }
    } else {
        dow = config._locale._week.dow;
        doy = config._locale._week.doy;

        var curWeek = weekOfYear(createLocal(), dow, doy);

        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

        // Default to current week.
        week = defaults(w.w, curWeek.week);

        if (w.d != null) {
            // weekday -- low day numbers are considered next week
            weekday = w.d;
            if (weekday < 0 || weekday > 6) {
                weekdayOverflow = true;
            }
        } else if (w.e != null) {
            // local weekday -- counting starts from begining of week
            weekday = w.e + dow;
            if (w.e < 0 || w.e > 6) {
                weekdayOverflow = true;
            }
        } else {
            // default to begining of week
            weekday = dow;
        }
    }
    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
        getParsingFlags(config)._overflowWeeks = true;
    } else if (weekdayOverflow != null) {
        getParsingFlags(config)._overflowWeekday = true;
    } else {
        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }
}

// constant that refers to the ISO standard
hooks.ISO_8601 = function () {};

// constant that refers to the RFC 2822 form
hooks.RFC_2822 = function () {};

// date from string and format string
function configFromStringAndFormat(config) {
    // TODO: Move this to another part of the creation flow to prevent circular deps
    if (config._f === hooks.ISO_8601) {
        configFromISO(config);
        return;
    }
    if (config._f === hooks.RFC_2822) {
        configFromRFC2822(config);
        return;
    }
    config._a = [];
    getParsingFlags(config).empty = true;

    // This array is used to make a Date, either with `new Date` or `Date.UTC`
    var string = '' + config._i,
        i, parsedInput, tokens, token, skipped,
        stringLength = string.length,
        totalParsedInputLength = 0;

    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

    for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
        // console.log('token', token, 'parsedInput', parsedInput,
        //         'regex', getParseRegexForToken(token, config));
        if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
                getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
        }
        // don't parse if it's not a known token
        if (formatTokenFunctions[token]) {
            if (parsedInput) {
                getParsingFlags(config).empty = false;
            }
            else {
                getParsingFlags(config).unusedTokens.push(token);
            }
            addTimeToArrayFromToken(token, parsedInput, config);
        }
        else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token);
        }
    }

    // add remaining unparsed input length to the string
    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
        getParsingFlags(config).unusedInput.push(string);
    }

    // clear _12h flag if hour is <= 12
    if (config._a[HOUR] <= 12 &&
        getParsingFlags(config).bigHour === true &&
        config._a[HOUR] > 0) {
        getParsingFlags(config).bigHour = undefined;
    }

    getParsingFlags(config).parsedDateParts = config._a.slice(0);
    getParsingFlags(config).meridiem = config._meridiem;
    // handle meridiem
    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

    configFromArray(config);
    checkOverflow(config);
}


function meridiemFixWrap (locale, hour, meridiem) {
    var isPm;

    if (meridiem == null) {
        // nothing to do
        return hour;
    }
    if (locale.meridiemHour != null) {
        return locale.meridiemHour(hour, meridiem);
    } else if (locale.isPM != null) {
        // Fallback
        isPm = locale.isPM(meridiem);
        if (isPm && hour < 12) {
            hour += 12;
        }
        if (!isPm && hour === 12) {
            hour = 0;
        }
        return hour;
    } else {
        // this is not supposed to happen
        return hour;
    }
}

// date from string and array of format strings
function configFromStringAndArray(config) {
    var tempConfig,
        bestMoment,

        scoreToBeat,
        i,
        currentScore;

    if (config._f.length === 0) {
        getParsingFlags(config).invalidFormat = true;
        config._d = new Date(NaN);
        return;
    }

    for (i = 0; i < config._f.length; i++) {
        currentScore = 0;
        tempConfig = copyConfig({}, config);
        if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
        }
        tempConfig._f = config._f[i];
        configFromStringAndFormat(tempConfig);

        if (!isValid(tempConfig)) {
            continue;
        }

        // if there is any input that was not parsed add a penalty for that format
        currentScore += getParsingFlags(tempConfig).charsLeftOver;

        //or tokens
        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

        getParsingFlags(tempConfig).score = currentScore;

        if (scoreToBeat == null || currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
        }
    }

    extend(config, bestMoment || tempConfig);
}

function configFromObject(config) {
    if (config._d) {
        return;
    }

    var i = normalizeObjectUnits(config._i);
    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
        return obj && parseInt(obj, 10);
    });

    configFromArray(config);
}

function createFromConfig (config) {
    var res = new Moment(checkOverflow(prepareConfig(config)));
    if (res._nextDay) {
        // Adding is smart enough around DST
        res.add(1, 'd');
        res._nextDay = undefined;
    }

    return res;
}

function prepareConfig (config) {
    var input = config._i,
        format = config._f;

    config._locale = config._locale || getLocale(config._l);

    if (input === null || (format === undefined && input === '')) {
        return createInvalid({nullInput: true});
    }

    if (typeof input === 'string') {
        config._i = input = config._locale.preparse(input);
    }

    if (isMoment(input)) {
        return new Moment(checkOverflow(input));
    } else if (isDate(input)) {
        config._d = input;
    } else if (isArray(format)) {
        configFromStringAndArray(config);
    } else if (format) {
        configFromStringAndFormat(config);
    }  else {
        configFromInput(config);
    }

    if (!isValid(config)) {
        config._d = null;
    }

    return config;
}

function configFromInput(config) {
    var input = config._i;
    if (isUndefined(input)) {
        config._d = new Date(hooks.now());
    } else if (isDate(input)) {
        config._d = new Date(input.valueOf());
    } else if (typeof input === 'string') {
        configFromString(config);
    } else if (isArray(input)) {
        config._a = map(input.slice(0), function (obj) {
            return parseInt(obj, 10);
        });
        configFromArray(config);
    } else if (isObject(input)) {
        configFromObject(config);
    } else if (isNumber(input)) {
        // from milliseconds
        config._d = new Date(input);
    } else {
        hooks.createFromInputFallback(config);
    }
}

function createLocalOrUTC (input, format, locale, strict, isUTC) {
    var c = {};

    if (locale === true || locale === false) {
        strict = locale;
        locale = undefined;
    }

    if ((isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)) {
        input = undefined;
    }
    // object construction must be done this way.
    // https://github.com/moment/moment/issues/1423
    c._isAMomentObject = true;
    c._useUTC = c._isUTC = isUTC;
    c._l = locale;
    c._i = input;
    c._f = format;
    c._strict = strict;

    return createFromConfig(c);
}

function createLocal (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
}

var prototypeMin = deprecate(
    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

var prototypeMax = deprecate(
    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function pickBy(fn, moments) {
    var res, i;
    if (moments.length === 1 && isArray(moments[0])) {
        moments = moments[0];
    }
    if (!moments.length) {
        return createLocal();
    }
    res = moments[0];
    for (i = 1; i < moments.length; ++i) {
        if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
        }
    }
    return res;
}

// TODO: Use [].sort instead?
function min () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isBefore', args);
}

function max () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isAfter', args);
}

var now = function () {
    return Date.now ? Date.now() : +(new Date());
};

var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

function isDurationValid(m) {
    for (var key in m) {
        if (!(ordering.indexOf(key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
            return false;
        }
    }

    var unitHasDecimal = false;
    for (var i = 0; i < ordering.length; ++i) {
        if (m[ordering[i]]) {
            if (unitHasDecimal) {
                return false; // only allow non-integers for smallest unit
            }
            if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                unitHasDecimal = true;
            }
        }
    }

    return true;
}

function isValid$1() {
    return this._isValid;
}

function createInvalid$1() {
    return createDuration(NaN);
}

function Duration (duration) {
    var normalizedInput = normalizeObjectUnits(duration),
        years = normalizedInput.year || 0,
        quarters = normalizedInput.quarter || 0,
        months = normalizedInput.month || 0,
        weeks = normalizedInput.week || 0,
        days = normalizedInput.day || 0,
        hours = normalizedInput.hour || 0,
        minutes = normalizedInput.minute || 0,
        seconds = normalizedInput.second || 0,
        milliseconds = normalizedInput.millisecond || 0;

    this._isValid = isDurationValid(normalizedInput);

    // representation for dateAddRemove
    this._milliseconds = +milliseconds +
        seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
    // Because of dateAddRemove treats 24 hours as different from a
    // day when working around DST, we need to store them separately
    this._days = +days +
        weeks * 7;
    // It is impossible translate months into days without knowing
    // which months you are are talking about, so we have to store
    // it separately.
    this._months = +months +
        quarters * 3 +
        years * 12;

    this._data = {};

    this._locale = getLocale();

    this._bubble();
}

function isDuration (obj) {
    return obj instanceof Duration;
}

function absRound (number) {
    if (number < 0) {
        return Math.round(-1 * number) * -1;
    } else {
        return Math.round(number);
    }
}

// FORMATTING

function offset (token, separator) {
    addFormatToken(token, 0, 0, function () {
        var offset = this.utcOffset();
        var sign = '+';
        if (offset < 0) {
            offset = -offset;
            sign = '-';
        }
        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
    });
}

offset('Z', ':');
offset('ZZ', '');

// PARSING

addRegexToken('Z',  matchShortOffset);
addRegexToken('ZZ', matchShortOffset);
addParseToken(['Z', 'ZZ'], function (input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(matchShortOffset, input);
});

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var chunkOffset = /([\+\-]|\d\d)/gi;

function offsetFromString(matcher, string) {
    var matches = (string || '').match(matcher);

    if (matches === null) {
        return null;
    }

    var chunk   = matches[matches.length - 1] || [];
    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    var minutes = +(parts[1] * 60) + toInt(parts[2]);

    return minutes === 0 ?
      0 :
      parts[0] === '+' ? minutes : -minutes;
}

// Return a moment from input, that is local/utc/zone equivalent to model.
function cloneWithOffset(input, model) {
    var res, diff;
    if (model._isUTC) {
        res = model.clone();
        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
        // Use low-level api, because this fn is low-level api.
        res._d.setTime(res._d.valueOf() + diff);
        hooks.updateOffset(res, false);
        return res;
    } else {
        return createLocal(input).local();
    }
}

function getDateOffset (m) {
    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
    // https://github.com/moment/moment/pull/1871
    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
}

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
hooks.updateOffset = function () {};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function getSetOffset (input, keepLocalTime, keepMinutes) {
    var offset = this._offset || 0,
        localAdjust;
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    if (input != null) {
        if (typeof input === 'string') {
            input = offsetFromString(matchShortOffset, input);
            if (input === null) {
                return this;
            }
        } else if (Math.abs(input) < 16 && !keepMinutes) {
            input = input * 60;
        }
        if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
        }
        this._offset = input;
        this._isUTC = true;
        if (localAdjust != null) {
            this.add(localAdjust, 'm');
        }
        if (offset !== input) {
            if (!keepLocalTime || this._changeInProgress) {
                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
            } else if (!this._changeInProgress) {
                this._changeInProgress = true;
                hooks.updateOffset(this, true);
                this._changeInProgress = null;
            }
        }
        return this;
    } else {
        return this._isUTC ? offset : getDateOffset(this);
    }
}

function getSetZone (input, keepLocalTime) {
    if (input != null) {
        if (typeof input !== 'string') {
            input = -input;
        }

        this.utcOffset(input, keepLocalTime);

        return this;
    } else {
        return -this.utcOffset();
    }
}

function setOffsetToUTC (keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
}

function setOffsetToLocal (keepLocalTime) {
    if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;

        if (keepLocalTime) {
            this.subtract(getDateOffset(this), 'm');
        }
    }
    return this;
}

function setOffsetToParsedOffset () {
    if (this._tzm != null) {
        this.utcOffset(this._tzm, false, true);
    } else if (typeof this._i === 'string') {
        var tZone = offsetFromString(matchOffset, this._i);
        if (tZone != null) {
            this.utcOffset(tZone);
        }
        else {
            this.utcOffset(0, true);
        }
    }
    return this;
}

function hasAlignedHourOffset (input) {
    if (!this.isValid()) {
        return false;
    }
    input = input ? createLocal(input).utcOffset() : 0;

    return (this.utcOffset() - input) % 60 === 0;
}

function isDaylightSavingTime () {
    return (
        this.utcOffset() > this.clone().month(0).utcOffset() ||
        this.utcOffset() > this.clone().month(5).utcOffset()
    );
}

function isDaylightSavingTimeShifted () {
    if (!isUndefined(this._isDSTShifted)) {
        return this._isDSTShifted;
    }

    var c = {};

    copyConfig(c, this);
    c = prepareConfig(c);

    if (c._a) {
        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
        this._isDSTShifted = this.isValid() &&
            compareArrays(c._a, other.toArray()) > 0;
    } else {
        this._isDSTShifted = false;
    }

    return this._isDSTShifted;
}

function isLocal () {
    return this.isValid() ? !this._isUTC : false;
}

function isUtcOffset () {
    return this.isValid() ? this._isUTC : false;
}

function isUtc () {
    return this.isValid() ? this._isUTC && this._offset === 0 : false;
}

// ASP.NET json date format regex
var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

function createDuration (input, key) {
    var duration = input,
        // matching against regexp is expensive, do it on demand
        match = null,
        sign,
        ret,
        diffRes;

    if (isDuration(input)) {
        duration = {
            ms : input._milliseconds,
            d  : input._days,
            M  : input._months
        };
    } else if (isNumber(input)) {
        duration = {};
        if (key) {
            duration[key] = input;
        } else {
            duration.milliseconds = input;
        }
    } else if (!!(match = aspNetRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y  : 0,
            d  : toInt(match[DATE])                         * sign,
            h  : toInt(match[HOUR])                         * sign,
            m  : toInt(match[MINUTE])                       * sign,
            s  : toInt(match[SECOND])                       * sign,
            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
        };
    } else if (!!(match = isoRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y : parseIso(match[2], sign),
            M : parseIso(match[3], sign),
            w : parseIso(match[4], sign),
            d : parseIso(match[5], sign),
            h : parseIso(match[6], sign),
            m : parseIso(match[7], sign),
            s : parseIso(match[8], sign)
        };
    } else if (duration == null) {// checks for null or undefined
        duration = {};
    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

        duration = {};
        duration.ms = diffRes.milliseconds;
        duration.M = diffRes.months;
    }

    ret = new Duration(duration);

    if (isDuration(input) && hasOwnProp(input, '_locale')) {
        ret._locale = input._locale;
    }

    return ret;
}

createDuration.fn = Duration.prototype;
createDuration.invalid = createInvalid$1;

function parseIso (inp, sign) {
    // We'd normally use ~~inp for this, but unfortunately it also
    // converts floats to ints.
    // inp may be undefined, so careful calling replace on it.
    var res = inp && parseFloat(inp.replace(',', '.'));
    // apply sign while we're at it
    return (isNaN(res) ? 0 : res) * sign;
}

function positiveMomentsDifference(base, other) {
    var res = {milliseconds: 0, months: 0};

    res.months = other.month() - base.month() +
        (other.year() - base.year()) * 12;
    if (base.clone().add(res.months, 'M').isAfter(other)) {
        --res.months;
    }

    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

    return res;
}

function momentsDifference(base, other) {
    var res;
    if (!(base.isValid() && other.isValid())) {
        return {milliseconds: 0, months: 0};
    }

    other = cloneWithOffset(other, base);
    if (base.isBefore(other)) {
        res = positiveMomentsDifference(base, other);
    } else {
        res = positiveMomentsDifference(other, base);
        res.milliseconds = -res.milliseconds;
        res.months = -res.months;
    }

    return res;
}

// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
    return function (val, period) {
        var dur, tmp;
        //invert the arguments, but complain about it
        if (period !== null && !isNaN(+period)) {
            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
            tmp = val; val = period; period = tmp;
        }

        val = typeof val === 'string' ? +val : val;
        dur = createDuration(val, period);
        addSubtract(this, dur, direction);
        return this;
    };
}

function addSubtract (mom, duration, isAdding, updateOffset) {
    var milliseconds = duration._milliseconds,
        days = absRound(duration._days),
        months = absRound(duration._months);

    if (!mom.isValid()) {
        // No op
        return;
    }

    updateOffset = updateOffset == null ? true : updateOffset;

    if (milliseconds) {
        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
    }
    if (days) {
        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
    }
    if (months) {
        setMonth(mom, get(mom, 'Month') + months * isAdding);
    }
    if (updateOffset) {
        hooks.updateOffset(mom, days || months);
    }
}

var add      = createAdder(1, 'add');
var subtract = createAdder(-1, 'subtract');

function getCalendarFormat(myMoment, now) {
    var diff = myMoment.diff(now, 'days', true);
    return diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
            diff < 0 ? 'lastDay' :
            diff < 1 ? 'sameDay' :
            diff < 2 ? 'nextDay' :
            diff < 7 ? 'nextWeek' : 'sameElse';
}

function calendar$1 (time, formats) {
    // We want to compare the start of today, vs this.
    // Getting start-of-today depends on whether we're local/utc/offset or not.
    var now = time || createLocal(),
        sod = cloneWithOffset(now, this).startOf('day'),
        format = hooks.calendarFormat(this, sod) || 'sameElse';

    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
}

function clone () {
    return new Moment(this);
}

function isAfter (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() > localInput.valueOf();
    } else {
        return localInput.valueOf() < this.clone().startOf(units).valueOf();
    }
}

function isBefore (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() < localInput.valueOf();
    } else {
        return this.clone().endOf(units).valueOf() < localInput.valueOf();
    }
}

function isBetween (from, to, units, inclusivity) {
    inclusivity = inclusivity || '()';
    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
}

function isSame (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input),
        inputMs;
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(units || 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() === localInput.valueOf();
    } else {
        inputMs = localInput.valueOf();
        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
    }
}

function isSameOrAfter (input, units) {
    return this.isSame(input, units) || this.isAfter(input,units);
}

function isSameOrBefore (input, units) {
    return this.isSame(input, units) || this.isBefore(input,units);
}

function diff (input, units, asFloat) {
    var that,
        zoneDelta,
        delta, output;

    if (!this.isValid()) {
        return NaN;
    }

    that = cloneWithOffset(input, this);

    if (!that.isValid()) {
        return NaN;
    }

    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

    units = normalizeUnits(units);

    if (units === 'year' || units === 'month' || units === 'quarter') {
        output = monthDiff(this, that);
        if (units === 'quarter') {
            output = output / 3;
        } else if (units === 'year') {
            output = output / 12;
        }
    } else {
        delta = this - that;
        output = units === 'second' ? delta / 1e3 : // 1000
            units === 'minute' ? delta / 6e4 : // 1000 * 60
            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
            delta;
    }
    return asFloat ? output : absFloor(output);
}

function monthDiff (a, b) {
    // difference in months
    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
        // b is in (anchor - 1 month, anchor + 1 month)
        anchor = a.clone().add(wholeMonthDiff, 'months'),
        anchor2, adjust;

    if (b - anchor < 0) {
        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor - anchor2);
    } else {
        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor2 - anchor);
    }

    //check for negative zero, return zero if negative zero
    return -(wholeMonthDiff + adjust) || 0;
}

hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

function toString () {
    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}

function toISOString() {
    if (!this.isValid()) {
        return null;
    }
    var m = this.clone().utc();
    if (m.year() < 0 || m.year() > 9999) {
        return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
    if (isFunction(Date.prototype.toISOString)) {
        // native implementation is ~50x faster, use it when we can
        return this.toDate().toISOString();
    }
    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
}

/**
 * Return a human readable representation of a moment that can
 * also be evaluated to get a new moment which is the same
 *
 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
 */
function inspect () {
    if (!this.isValid()) {
        return 'moment.invalid(/* ' + this._i + ' */)';
    }
    var func = 'moment';
    var zone = '';
    if (!this.isLocal()) {
        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
        zone = 'Z';
    }
    var prefix = '[' + func + '("]';
    var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
    var suffix = zone + '[")]';

    return this.format(prefix + year + datetime + suffix);
}

function format (inputString) {
    if (!inputString) {
        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
    }
    var output = formatMoment(this, inputString);
    return this.localeData().postformat(output);
}

function from (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function fromNow (withoutSuffix) {
    return this.from(createLocal(), withoutSuffix);
}

function to (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function toNow (withoutSuffix) {
    return this.to(createLocal(), withoutSuffix);
}

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale (key) {
    var newLocaleData;

    if (key === undefined) {
        return this._locale._abbr;
    } else {
        newLocaleData = getLocale(key);
        if (newLocaleData != null) {
            this._locale = newLocaleData;
        }
        return this;
    }
}

var lang = deprecate(
    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
    function (key) {
        if (key === undefined) {
            return this.localeData();
        } else {
            return this.locale(key);
        }
    }
);

function localeData () {
    return this._locale;
}

function startOf (units) {
    units = normalizeUnits(units);
    // the following switch intentionally omits break keywords
    // to utilize falling through the cases.
    switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
        case 'date':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
    }

    // weeks are a special case
    if (units === 'week') {
        this.weekday(0);
    }
    if (units === 'isoWeek') {
        this.isoWeekday(1);
    }

    // quarters are also special
    if (units === 'quarter') {
        this.month(Math.floor(this.month() / 3) * 3);
    }

    return this;
}

function endOf (units) {
    units = normalizeUnits(units);
    if (units === undefined || units === 'millisecond') {
        return this;
    }

    // 'date' is an alias for 'day', so it should be considered as such.
    if (units === 'date') {
        units = 'day';
    }

    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
}

function valueOf () {
    return this._d.valueOf() - ((this._offset || 0) * 60000);
}

function unix () {
    return Math.floor(this.valueOf() / 1000);
}

function toDate () {
    return new Date(this.valueOf());
}

function toArray () {
    var m = this;
    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}

function toObject () {
    var m = this;
    return {
        years: m.year(),
        months: m.month(),
        date: m.date(),
        hours: m.hours(),
        minutes: m.minutes(),
        seconds: m.seconds(),
        milliseconds: m.milliseconds()
    };
}

function toJSON () {
    // new Date(NaN).toJSON() === null
    return this.isValid() ? this.toISOString() : null;
}

function isValid$2 () {
    return isValid(this);
}

function parsingFlags () {
    return extend({}, getParsingFlags(this));
}

function invalidAt () {
    return getParsingFlags(this).overflow;
}

function creationData() {
    return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
    };
}

// FORMATTING

addFormatToken(0, ['gg', 2], 0, function () {
    return this.weekYear() % 100;
});

addFormatToken(0, ['GG', 2], 0, function () {
    return this.isoWeekYear() % 100;
});

function addWeekYearFormatToken (token, getter) {
    addFormatToken(0, [token, token.length], 0, getter);
}

addWeekYearFormatToken('gggg',     'weekYear');
addWeekYearFormatToken('ggggg',    'weekYear');
addWeekYearFormatToken('GGGG',  'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

addUnitAlias('weekYear', 'gg');
addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

addUnitPriority('weekYear', 1);
addUnitPriority('isoWeekYear', 1);


// PARSING

addRegexToken('G',      matchSigned);
addRegexToken('g',      matchSigned);
addRegexToken('GG',     match1to2, match2);
addRegexToken('gg',     match1to2, match2);
addRegexToken('GGGG',   match1to4, match4);
addRegexToken('gggg',   match1to4, match4);
addRegexToken('GGGGG',  match1to6, match6);
addRegexToken('ggggg',  match1to6, match6);

addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
    week[token.substr(0, 2)] = toInt(input);
});

addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
    week[token] = hooks.parseTwoDigitYear(input);
});

// MOMENTS

function getSetWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy);
}

function getSetISOWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input, this.isoWeek(), this.isoWeekday(), 1, 4);
}

function getISOWeeksInYear () {
    return weeksInYear(this.year(), 1, 4);
}

function getWeeksInYear () {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
}

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
    var weeksTarget;
    if (input == null) {
        return weekOfYear(this, dow, doy).year;
    } else {
        weeksTarget = weeksInYear(input, dow, doy);
        if (week > weeksTarget) {
            week = weeksTarget;
        }
        return setWeekAll.call(this, input, week, weekday, dow, doy);
    }
}

function setWeekAll(weekYear, week, weekday, dow, doy) {
    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

    this.year(date.getUTCFullYear());
    this.month(date.getUTCMonth());
    this.date(date.getUTCDate());
    return this;
}

// FORMATTING

addFormatToken('Q', 0, 'Qo', 'quarter');

// ALIASES

addUnitAlias('quarter', 'Q');

// PRIORITY

addUnitPriority('quarter', 7);

// PARSING

addRegexToken('Q', match1);
addParseToken('Q', function (input, array) {
    array[MONTH] = (toInt(input) - 1) * 3;
});

// MOMENTS

function getSetQuarter (input) {
    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
}

// FORMATTING

addFormatToken('D', ['DD', 2], 'Do', 'date');

// ALIASES

addUnitAlias('date', 'D');

// PRIOROITY
addUnitPriority('date', 9);

// PARSING

addRegexToken('D',  match1to2);
addRegexToken('DD', match1to2, match2);
addRegexToken('Do', function (isStrict, locale) {
    // TODO: Remove "ordinalParse" fallback in next major release.
    return isStrict ?
      (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
      locale._dayOfMonthOrdinalParseLenient;
});

addParseToken(['D', 'DD'], DATE);
addParseToken('Do', function (input, array) {
    array[DATE] = toInt(input.match(match1to2)[0], 10);
});

// MOMENTS

var getSetDayOfMonth = makeGetSet('Date', true);

// FORMATTING

addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// ALIASES

addUnitAlias('dayOfYear', 'DDD');

// PRIORITY
addUnitPriority('dayOfYear', 4);

// PARSING

addRegexToken('DDD',  match1to3);
addRegexToken('DDDD', match3);
addParseToken(['DDD', 'DDDD'], function (input, array, config) {
    config._dayOfYear = toInt(input);
});

// HELPERS

// MOMENTS

function getSetDayOfYear (input) {
    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
}

// FORMATTING

addFormatToken('m', ['mm', 2], 0, 'minute');

// ALIASES

addUnitAlias('minute', 'm');

// PRIORITY

addUnitPriority('minute', 14);

// PARSING

addRegexToken('m',  match1to2);
addRegexToken('mm', match1to2, match2);
addParseToken(['m', 'mm'], MINUTE);

// MOMENTS

var getSetMinute = makeGetSet('Minutes', false);

// FORMATTING

addFormatToken('s', ['ss', 2], 0, 'second');

// ALIASES

addUnitAlias('second', 's');

// PRIORITY

addUnitPriority('second', 15);

// PARSING

addRegexToken('s',  match1to2);
addRegexToken('ss', match1to2, match2);
addParseToken(['s', 'ss'], SECOND);

// MOMENTS

var getSetSecond = makeGetSet('Seconds', false);

// FORMATTING

addFormatToken('S', 0, 0, function () {
    return ~~(this.millisecond() / 100);
});

addFormatToken(0, ['SS', 2], 0, function () {
    return ~~(this.millisecond() / 10);
});

addFormatToken(0, ['SSS', 3], 0, 'millisecond');
addFormatToken(0, ['SSSS', 4], 0, function () {
    return this.millisecond() * 10;
});
addFormatToken(0, ['SSSSS', 5], 0, function () {
    return this.millisecond() * 100;
});
addFormatToken(0, ['SSSSSS', 6], 0, function () {
    return this.millisecond() * 1000;
});
addFormatToken(0, ['SSSSSSS', 7], 0, function () {
    return this.millisecond() * 10000;
});
addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
    return this.millisecond() * 100000;
});
addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
    return this.millisecond() * 1000000;
});


// ALIASES

addUnitAlias('millisecond', 'ms');

// PRIORITY

addUnitPriority('millisecond', 16);

// PARSING

addRegexToken('S',    match1to3, match1);
addRegexToken('SS',   match1to3, match2);
addRegexToken('SSS',  match1to3, match3);

var token;
for (token = 'SSSS'; token.length <= 9; token += 'S') {
    addRegexToken(token, matchUnsigned);
}

function parseMs(input, array) {
    array[MILLISECOND] = toInt(('0.' + input) * 1000);
}

for (token = 'S'; token.length <= 9; token += 'S') {
    addParseToken(token, parseMs);
}
// MOMENTS

var getSetMillisecond = makeGetSet('Milliseconds', false);

// FORMATTING

addFormatToken('z',  0, 0, 'zoneAbbr');
addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

function getZoneAbbr () {
    return this._isUTC ? 'UTC' : '';
}

function getZoneName () {
    return this._isUTC ? 'Coordinated Universal Time' : '';
}

var proto = Moment.prototype;

proto.add               = add;
proto.calendar          = calendar$1;
proto.clone             = clone;
proto.diff              = diff;
proto.endOf             = endOf;
proto.format            = format;
proto.from              = from;
proto.fromNow           = fromNow;
proto.to                = to;
proto.toNow             = toNow;
proto.get               = stringGet;
proto.invalidAt         = invalidAt;
proto.isAfter           = isAfter;
proto.isBefore          = isBefore;
proto.isBetween         = isBetween;
proto.isSame            = isSame;
proto.isSameOrAfter     = isSameOrAfter;
proto.isSameOrBefore    = isSameOrBefore;
proto.isValid           = isValid$2;
proto.lang              = lang;
proto.locale            = locale;
proto.localeData        = localeData;
proto.max               = prototypeMax;
proto.min               = prototypeMin;
proto.parsingFlags      = parsingFlags;
proto.set               = stringSet;
proto.startOf           = startOf;
proto.subtract          = subtract;
proto.toArray           = toArray;
proto.toObject          = toObject;
proto.toDate            = toDate;
proto.toISOString       = toISOString;
proto.inspect           = inspect;
proto.toJSON            = toJSON;
proto.toString          = toString;
proto.unix              = unix;
proto.valueOf           = valueOf;
proto.creationData      = creationData;

// Year
proto.year       = getSetYear;
proto.isLeapYear = getIsLeapYear;

// Week Year
proto.weekYear    = getSetWeekYear;
proto.isoWeekYear = getSetISOWeekYear;

// Quarter
proto.quarter = proto.quarters = getSetQuarter;

// Month
proto.month       = getSetMonth;
proto.daysInMonth = getDaysInMonth;

// Week
proto.week           = proto.weeks        = getSetWeek;
proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
proto.weeksInYear    = getWeeksInYear;
proto.isoWeeksInYear = getISOWeeksInYear;

// Day
proto.date       = getSetDayOfMonth;
proto.day        = proto.days             = getSetDayOfWeek;
proto.weekday    = getSetLocaleDayOfWeek;
proto.isoWeekday = getSetISODayOfWeek;
proto.dayOfYear  = getSetDayOfYear;

// Hour
proto.hour = proto.hours = getSetHour;

// Minute
proto.minute = proto.minutes = getSetMinute;

// Second
proto.second = proto.seconds = getSetSecond;

// Millisecond
proto.millisecond = proto.milliseconds = getSetMillisecond;

// Offset
proto.utcOffset            = getSetOffset;
proto.utc                  = setOffsetToUTC;
proto.local                = setOffsetToLocal;
proto.parseZone            = setOffsetToParsedOffset;
proto.hasAlignedHourOffset = hasAlignedHourOffset;
proto.isDST                = isDaylightSavingTime;
proto.isLocal              = isLocal;
proto.isUtcOffset          = isUtcOffset;
proto.isUtc                = isUtc;
proto.isUTC                = isUtc;

// Timezone
proto.zoneAbbr = getZoneAbbr;
proto.zoneName = getZoneName;

// Deprecations
proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

function createUnix (input) {
    return createLocal(input * 1000);
}

function createInZone () {
    return createLocal.apply(null, arguments).parseZone();
}

function preParsePostFormat (string) {
    return string;
}

var proto$1 = Locale.prototype;

proto$1.calendar        = calendar;
proto$1.longDateFormat  = longDateFormat;
proto$1.invalidDate     = invalidDate;
proto$1.ordinal         = ordinal;
proto$1.preparse        = preParsePostFormat;
proto$1.postformat      = preParsePostFormat;
proto$1.relativeTime    = relativeTime;
proto$1.pastFuture      = pastFuture;
proto$1.set             = set;

// Month
proto$1.months            =        localeMonths;
proto$1.monthsShort       =        localeMonthsShort;
proto$1.monthsParse       =        localeMonthsParse;
proto$1.monthsRegex       = monthsRegex;
proto$1.monthsShortRegex  = monthsShortRegex;

// Week
proto$1.week = localeWeek;
proto$1.firstDayOfYear = localeFirstDayOfYear;
proto$1.firstDayOfWeek = localeFirstDayOfWeek;

// Day of Week
proto$1.weekdays       =        localeWeekdays;
proto$1.weekdaysMin    =        localeWeekdaysMin;
proto$1.weekdaysShort  =        localeWeekdaysShort;
proto$1.weekdaysParse  =        localeWeekdaysParse;

proto$1.weekdaysRegex       =        weekdaysRegex;
proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

// Hours
proto$1.isPM = localeIsPM;
proto$1.meridiem = localeMeridiem;

function get$1 (format, index, field, setter) {
    var locale = getLocale();
    var utc = createUTC().set(setter, index);
    return locale[field](utc, format);
}

function listMonthsImpl (format, index, field) {
    if (isNumber(format)) {
        index = format;
        format = undefined;
    }

    format = format || '';

    if (index != null) {
        return get$1(format, index, field, 'month');
    }

    var i;
    var out = [];
    for (i = 0; i < 12; i++) {
        out[i] = get$1(format, i, field, 'month');
    }
    return out;
}

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function listWeekdaysImpl (localeSorted, format, index, field) {
    if (typeof localeSorted === 'boolean') {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    } else {
        format = localeSorted;
        index = format;
        localeSorted = false;

        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    }

    var locale = getLocale(),
        shift = localeSorted ? locale._week.dow : 0;

    if (index != null) {
        return get$1(format, (index + shift) % 7, field, 'day');
    }

    var i;
    var out = [];
    for (i = 0; i < 7; i++) {
        out[i] = get$1(format, (i + shift) % 7, field, 'day');
    }
    return out;
}

function listMonths (format, index) {
    return listMonthsImpl(format, index, 'months');
}

function listMonthsShort (format, index) {
    return listMonthsImpl(format, index, 'monthsShort');
}

function listWeekdays (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
}

function listWeekdaysShort (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
}

function listWeekdaysMin (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
}

getSetGlobalLocale('en', {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (toInt(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});

// Side effect imports
hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

var mathAbs = Math.abs;

function abs () {
    var data           = this._data;

    this._milliseconds = mathAbs(this._milliseconds);
    this._days         = mathAbs(this._days);
    this._months       = mathAbs(this._months);

    data.milliseconds  = mathAbs(data.milliseconds);
    data.seconds       = mathAbs(data.seconds);
    data.minutes       = mathAbs(data.minutes);
    data.hours         = mathAbs(data.hours);
    data.months        = mathAbs(data.months);
    data.years         = mathAbs(data.years);

    return this;
}

function addSubtract$1 (duration, input, value, direction) {
    var other = createDuration(input, value);

    duration._milliseconds += direction * other._milliseconds;
    duration._days         += direction * other._days;
    duration._months       += direction * other._months;

    return duration._bubble();
}

// supports only 2.0-style add(1, 's') or add(duration)
function add$1 (input, value) {
    return addSubtract$1(this, input, value, 1);
}

// supports only 2.0-style subtract(1, 's') or subtract(duration)
function subtract$1 (input, value) {
    return addSubtract$1(this, input, value, -1);
}

function absCeil (number) {
    if (number < 0) {
        return Math.floor(number);
    } else {
        return Math.ceil(number);
    }
}

function bubble () {
    var milliseconds = this._milliseconds;
    var days         = this._days;
    var months       = this._months;
    var data         = this._data;
    var seconds, minutes, hours, years, monthsFromDays;

    // if we have a mix of positive and negative values, bubble down first
    // check: https://github.com/moment/moment/issues/2166
    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
            (milliseconds <= 0 && days <= 0 && months <= 0))) {
        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
        days = 0;
        months = 0;
    }

    // The following code bubbles up values, see the tests for
    // examples of what that means.
    data.milliseconds = milliseconds % 1000;

    seconds           = absFloor(milliseconds / 1000);
    data.seconds      = seconds % 60;

    minutes           = absFloor(seconds / 60);
    data.minutes      = minutes % 60;

    hours             = absFloor(minutes / 60);
    data.hours        = hours % 24;

    days += absFloor(hours / 24);

    // convert days to months
    monthsFromDays = absFloor(daysToMonths(days));
    months += monthsFromDays;
    days -= absCeil(monthsToDays(monthsFromDays));

    // 12 months -> 1 year
    years = absFloor(months / 12);
    months %= 12;

    data.days   = days;
    data.months = months;
    data.years  = years;

    return this;
}

function daysToMonths (days) {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    return days * 4800 / 146097;
}

function monthsToDays (months) {
    // the reverse of daysToMonths
    return months * 146097 / 4800;
}

function as (units) {
    if (!this.isValid()) {
        return NaN;
    }
    var days;
    var months;
    var milliseconds = this._milliseconds;

    units = normalizeUnits(units);

    if (units === 'month' || units === 'year') {
        days   = this._days   + milliseconds / 864e5;
        months = this._months + daysToMonths(days);
        return units === 'month' ? months : months / 12;
    } else {
        // handle milliseconds separately because of floating point math errors (issue #1867)
        days = this._days + Math.round(monthsToDays(this._months));
        switch (units) {
            case 'week'   : return days / 7     + milliseconds / 6048e5;
            case 'day'    : return days         + milliseconds / 864e5;
            case 'hour'   : return days * 24    + milliseconds / 36e5;
            case 'minute' : return days * 1440  + milliseconds / 6e4;
            case 'second' : return days * 86400 + milliseconds / 1000;
            // Math.floor prevents floating point math errors here
            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
            default: throw new Error('Unknown unit ' + units);
        }
    }
}

// TODO: Use this.as('ms')?
function valueOf$1 () {
    if (!this.isValid()) {
        return NaN;
    }
    return (
        this._milliseconds +
        this._days * 864e5 +
        (this._months % 12) * 2592e6 +
        toInt(this._months / 12) * 31536e6
    );
}

function makeAs (alias) {
    return function () {
        return this.as(alias);
    };
}

var asMilliseconds = makeAs('ms');
var asSeconds      = makeAs('s');
var asMinutes      = makeAs('m');
var asHours        = makeAs('h');
var asDays         = makeAs('d');
var asWeeks        = makeAs('w');
var asMonths       = makeAs('M');
var asYears        = makeAs('y');

function get$2 (units) {
    units = normalizeUnits(units);
    return this.isValid() ? this[units + 's']() : NaN;
}

function makeGetter(name) {
    return function () {
        return this.isValid() ? this._data[name] : NaN;
    };
}

var milliseconds = makeGetter('milliseconds');
var seconds      = makeGetter('seconds');
var minutes      = makeGetter('minutes');
var hours        = makeGetter('hours');
var days         = makeGetter('days');
var months       = makeGetter('months');
var years        = makeGetter('years');

function weeks () {
    return absFloor(this.days() / 7);
}

var round = Math.round;
var thresholds = {
    ss: 44,         // a few seconds to seconds
    s : 45,         // seconds to minute
    m : 45,         // minutes to hour
    h : 22,         // hours to day
    d : 26,         // days to month
    M : 11          // months to year
};

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
    var duration = createDuration(posNegDuration).abs();
    var seconds  = round(duration.as('s'));
    var minutes  = round(duration.as('m'));
    var hours    = round(duration.as('h'));
    var days     = round(duration.as('d'));
    var months   = round(duration.as('M'));
    var years    = round(duration.as('y'));

    var a = seconds <= thresholds.ss && ['s', seconds]  ||
            seconds < thresholds.s   && ['ss', seconds] ||
            minutes <= 1             && ['m']           ||
            minutes < thresholds.m   && ['mm', minutes] ||
            hours   <= 1             && ['h']           ||
            hours   < thresholds.h   && ['hh', hours]   ||
            days    <= 1             && ['d']           ||
            days    < thresholds.d   && ['dd', days]    ||
            months  <= 1             && ['M']           ||
            months  < thresholds.M   && ['MM', months]  ||
            years   <= 1             && ['y']           || ['yy', years];

    a[2] = withoutSuffix;
    a[3] = +posNegDuration > 0;
    a[4] = locale;
    return substituteTimeAgo.apply(null, a);
}

// This function allows you to set the rounding function for relative time strings
function getSetRelativeTimeRounding (roundingFunction) {
    if (roundingFunction === undefined) {
        return round;
    }
    if (typeof(roundingFunction) === 'function') {
        round = roundingFunction;
        return true;
    }
    return false;
}

// This function allows you to set a threshold for relative time strings
function getSetRelativeTimeThreshold (threshold, limit) {
    if (thresholds[threshold] === undefined) {
        return false;
    }
    if (limit === undefined) {
        return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    if (threshold === 's') {
        thresholds.ss = limit - 1;
    }
    return true;
}

function humanize (withSuffix) {
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var locale = this.localeData();
    var output = relativeTime$1(this, !withSuffix, locale);

    if (withSuffix) {
        output = locale.pastFuture(+this, output);
    }

    return locale.postformat(output);
}

var abs$1 = Math.abs;

function toISOString$1() {
    // for ISO strings we do not use the normal bubbling rules:
    //  * milliseconds bubble up until they become hours
    //  * days do not bubble at all
    //  * months bubble up until they become years
    // This is because there is no context-free conversion between hours and days
    // (think of clock changes)
    // and also not between days and months (28-31 days per month)
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var seconds = abs$1(this._milliseconds) / 1000;
    var days         = abs$1(this._days);
    var months       = abs$1(this._months);
    var minutes, hours, years;

    // 3600 seconds -> 60 minutes -> 1 hour
    minutes           = absFloor(seconds / 60);
    hours             = absFloor(minutes / 60);
    seconds %= 60;
    minutes %= 60;

    // 12 months -> 1 year
    years  = absFloor(months / 12);
    months %= 12;


    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
    var Y = years;
    var M = months;
    var D = days;
    var h = hours;
    var m = minutes;
    var s = seconds;
    var total = this.asSeconds();

    if (!total) {
        // this is the same as C#'s (Noda) and python (isodate)...
        // but not other JS (goog.date)
        return 'P0D';
    }

    return (total < 0 ? '-' : '') +
        'P' +
        (Y ? Y + 'Y' : '') +
        (M ? M + 'M' : '') +
        (D ? D + 'D' : '') +
        ((h || m || s) ? 'T' : '') +
        (h ? h + 'H' : '') +
        (m ? m + 'M' : '') +
        (s ? s + 'S' : '');
}

var proto$2 = Duration.prototype;

proto$2.isValid        = isValid$1;
proto$2.abs            = abs;
proto$2.add            = add$1;
proto$2.subtract       = subtract$1;
proto$2.as             = as;
proto$2.asMilliseconds = asMilliseconds;
proto$2.asSeconds      = asSeconds;
proto$2.asMinutes      = asMinutes;
proto$2.asHours        = asHours;
proto$2.asDays         = asDays;
proto$2.asWeeks        = asWeeks;
proto$2.asMonths       = asMonths;
proto$2.asYears        = asYears;
proto$2.valueOf        = valueOf$1;
proto$2._bubble        = bubble;
proto$2.get            = get$2;
proto$2.milliseconds   = milliseconds;
proto$2.seconds        = seconds;
proto$2.minutes        = minutes;
proto$2.hours          = hours;
proto$2.days           = days;
proto$2.weeks          = weeks;
proto$2.months         = months;
proto$2.years          = years;
proto$2.humanize       = humanize;
proto$2.toISOString    = toISOString$1;
proto$2.toString       = toISOString$1;
proto$2.toJSON         = toISOString$1;
proto$2.locale         = locale;
proto$2.localeData     = localeData;

// Deprecations
proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
proto$2.lang = lang;

// Side effect imports

// FORMATTING

addFormatToken('X', 0, 0, 'unix');
addFormatToken('x', 0, 0, 'valueOf');

// PARSING

addRegexToken('x', matchSigned);
addRegexToken('X', matchTimestamp);
addParseToken('X', function (input, array, config) {
    config._d = new Date(parseFloat(input, 10) * 1000);
});
addParseToken('x', function (input, array, config) {
    config._d = new Date(toInt(input));
});

// Side effect imports


hooks.version = '2.18.1';

setHookCallback(createLocal);

hooks.fn                    = proto;
hooks.min                   = min;
hooks.max                   = max;
hooks.now                   = now;
hooks.utc                   = createUTC;
hooks.unix                  = createUnix;
hooks.months                = listMonths;
hooks.isDate                = isDate;
hooks.locale                = getSetGlobalLocale;
hooks.invalid               = createInvalid;
hooks.duration              = createDuration;
hooks.isMoment              = isMoment;
hooks.weekdays              = listWeekdays;
hooks.parseZone             = createInZone;
hooks.localeData            = getLocale;
hooks.isDuration            = isDuration;
hooks.monthsShort           = listMonthsShort;
hooks.weekdaysMin           = listWeekdaysMin;
hooks.defineLocale          = defineLocale;
hooks.updateLocale          = updateLocale;
hooks.locales               = listLocales;
hooks.weekdaysShort         = listWeekdaysShort;
hooks.normalizeUnits        = normalizeUnits;
hooks.relativeTimeRounding = getSetRelativeTimeRounding;
hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
hooks.calendarFormat        = getCalendarFormat;
hooks.prototype             = proto;

return hooks;

})));

},{}],33:[function(require,module,exports){
(function (global){
/*! Native Promise Only
    v0.8.1 (c) Kyle Simpson
    MIT License: http://getify.mit-license.org
*/
!function(t,n,e){n[t]=n[t]||e(),"undefined"!=typeof module&&module.exports?module.exports=n[t]:"function"==typeof define&&define.amd&&define(function(){return n[t]})}("Promise","undefined"!=typeof global?global:this,function(){"use strict";function t(t,n){l.add(t,n),h||(h=y(l.drain))}function n(t){var n,e=typeof t;return null==t||"object"!=e&&"function"!=e||(n=t.then),"function"==typeof n?n:!1}function e(){for(var t=0;t<this.chain.length;t++)o(this,1===this.state?this.chain[t].success:this.chain[t].failure,this.chain[t]);this.chain.length=0}function o(t,e,o){var r,i;try{e===!1?o.reject(t.msg):(r=e===!0?t.msg:e.call(void 0,t.msg),r===o.promise?o.reject(TypeError("Promise-chain cycle")):(i=n(r))?i.call(r,o.resolve,o.reject):o.resolve(r))}catch(c){o.reject(c)}}function r(o){var c,u=this;if(!u.triggered){u.triggered=!0,u.def&&(u=u.def);try{(c=n(o))?t(function(){var t=new f(u);try{c.call(o,function(){r.apply(t,arguments)},function(){i.apply(t,arguments)})}catch(n){i.call(t,n)}}):(u.msg=o,u.state=1,u.chain.length>0&&t(e,u))}catch(a){i.call(new f(u),a)}}}function i(n){var o=this;o.triggered||(o.triggered=!0,o.def&&(o=o.def),o.msg=n,o.state=2,o.chain.length>0&&t(e,o))}function c(t,n,e,o){for(var r=0;r<n.length;r++)!function(r){t.resolve(n[r]).then(function(t){e(r,t)},o)}(r)}function f(t){this.def=t,this.triggered=!1}function u(t){this.promise=t,this.state=0,this.triggered=!1,this.chain=[],this.msg=void 0}function a(n){if("function"!=typeof n)throw TypeError("Not a function");if(0!==this.__NPO__)throw TypeError("Not a promise");this.__NPO__=1;var o=new u(this);this.then=function(n,r){var i={success:"function"==typeof n?n:!0,failure:"function"==typeof r?r:!1};return i.promise=new this.constructor(function(t,n){if("function"!=typeof t||"function"!=typeof n)throw TypeError("Not a function");i.resolve=t,i.reject=n}),o.chain.push(i),0!==o.state&&t(e,o),i.promise},this["catch"]=function(t){return this.then(void 0,t)};try{n.call(void 0,function(t){r.call(o,t)},function(t){i.call(o,t)})}catch(c){i.call(o,c)}}var s,h,l,p=Object.prototype.toString,y="undefined"!=typeof setImmediate?function(t){return setImmediate(t)}:setTimeout;try{Object.defineProperty({},"x",{}),s=function(t,n,e,o){return Object.defineProperty(t,n,{value:e,writable:!0,configurable:o!==!1})}}catch(d){s=function(t,n,e){return t[n]=e,t}}l=function(){function t(t,n){this.fn=t,this.self=n,this.next=void 0}var n,e,o;return{add:function(r,i){o=new t(r,i),e?e.next=o:n=o,e=o,o=void 0},drain:function(){var t=n;for(n=e=h=void 0;t;)t.fn.call(t.self),t=t.next}}}();var g=s({},"constructor",a,!1);return a.prototype=g,s(g,"__NPO__",0,!1),s(a,"resolve",function(t){var n=this;return t&&"object"==typeof t&&1===t.__NPO__?t:new n(function(n,e){if("function"!=typeof n||"function"!=typeof e)throw TypeError("Not a function");n(t)})}),s(a,"reject",function(t){return new this(function(n,e){if("function"!=typeof n||"function"!=typeof e)throw TypeError("Not a function");e(t)})}),s(a,"all",function(t){var n=this;return"[object Array]"!=p.call(t)?n.reject(TypeError("Not an array")):0===t.length?n.resolve([]):new n(function(e,o){if("function"!=typeof e||"function"!=typeof o)throw TypeError("Not a function");var r=t.length,i=Array(r),f=0;c(n,t,function(t,n){i[t]=n,++f===r&&e(i)},o)})}),s(a,"race",function(t){var n=this;return"[object Array]"!=p.call(t)?n.reject(TypeError("Not an array")):new n(function(e,o){if("function"!=typeof e||"function"!=typeof o)throw TypeError("Not a function");c(n,t,function(t,n){e(n)},o)})}),a});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],34:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],35:[function(require,module,exports){
var parser = require('./path-parser')
var stringifyQuerystring = require('query-string').stringify

module.exports = function(pathStr, parameters) {
	var parsed = typeof pathStr === 'string' ? parser(pathStr) : pathStr
	var allTokens = parsed.allTokens
	var regex = parsed.regex

	if (parameters) {
		var path = allTokens.map(function(bit) {
			if (bit.string) {
				return bit.string
			}

			var defined = typeof parameters[bit.name] !== 'undefined'
			if (!bit.optional && !defined) {
				throw new Error('Must supply argument ' + bit.name + ' for path ' + pathStr)
			}

			return defined ? (bit.delimiter + encodeURIComponent(parameters[bit.name])) : ''
		}).join('')

		if (!regex.test(path)) {
			throw new Error('Provided arguments do not match the original arguments')
		}

		return buildPathWithQuerystring(path, parameters, allTokens)
	} else {
		return parsed
	}
}

function buildPathWithQuerystring(path, parameters, tokenArray) {
	var parametersInQuerystring = getParametersWithoutMatchingToken(parameters, tokenArray)

	if (Object.keys(parametersInQuerystring).length === 0) {
		return path
	}

	return path + '?' + stringifyQuerystring(parametersInQuerystring)
}

function getParametersWithoutMatchingToken(parameters, tokenArray) {
	var tokenHash = tokenArray.reduce(function(memo, bit) {
		if (!bit.string) {
			memo[bit.name] = bit
		}
		return memo
	}, {})

	return Object.keys(parameters).filter(function(param) {
		return !tokenHash[param]
	}).reduce(function(newParameters, param) {
		newParameters[param] = parameters[param]
		return newParameters
	}, {})
}

},{"./path-parser":36,"query-string":39}],36:[function(require,module,exports){
// This file to be replaced with an official implementation maintained by
// the page.js crew if and when that becomes an option

var pathToRegexp = require('path-to-regexp-with-reversible-keys')

module.exports = function(pathString) {
	var parseResults = pathToRegexp(pathString)

	// The only reason I'm returning a new object instead of the results of the pathToRegexp
	// function is so that if the official implementation ends up returning an
	// allTokens-style array via some other mechanism, I may be able to change this file
	// without having to change the rest of the module in index.js
	return {
		regex: parseResults,
		allTokens: parseResults.allTokens
	}
}

},{"path-to-regexp-with-reversible-keys":37}],37:[function(require,module,exports){
var isArray = require('isarray');

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
  // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
  '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',
  // Match regexp special characters that are always escaped.
  '([.+*?=^!:${}()[\\]|\\/])'
].join('|'), 'g');

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1');
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
function attachKeys (re, keys, allTokens) {
  re.keys = keys;
  re.allTokens = allTokens;
  return re;
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */
function flags (options) {
  return options.sensitive ? '' : 'i';
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */
function regexpToRegexp (path, keys, allTokens) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name:      i,
        delimiter: null,
        optional:  false,
        repeat:    false
      });
    }
  }

  return attachKeys(path, keys, allTokens);
}

/**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function arrayToRegexp (path, keys, options, allTokens) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options, allTokens).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));
  return attachKeys(regexp, keys, allTokens);
}

/**
 * Replace the specific tags with regexp strings.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @return {String}
 */
function replacePath (path, keys, allTokens) {
  var index = 0;
  var lastEndIndex = 0

  function addLastToken(lastToken) {
    if (lastEndIndex === 0 && lastToken[0] !== '/') {
      lastToken = '/' + lastToken
    }
    allTokens.push({
      string: lastToken
    });
  }


  function replace (match, escaped, prefix, key, capture, group, suffix, escape, offset) {
    if (escaped) {
      return escaped;
    }

    if (escape) {
      return '\\' + escape;
    }

    var repeat   = suffix === '+' || suffix === '*';
    var optional = suffix === '?' || suffix === '*';

    if (offset > lastEndIndex) {
      addLastToken(path.substring(lastEndIndex, offset));
    }

    lastEndIndex = offset + match.length;

    var newKey = {
      name:      key || index++,
      delimiter: prefix || '/',
      optional:  optional,
      repeat:    repeat
    }

    keys.push(newKey);
    allTokens.push(newKey);

    prefix = prefix ? ('\\' + prefix) : '';
    capture = escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');

    if (repeat) {
      capture = capture + '(?:' + prefix + capture + ')*';
    }

    if (optional) {
      return '(?:' + prefix + '(' + capture + '))?';
    }

    // Basic parameter support.
    return prefix + '(' + capture + ')';
  }

  var newPath = path.replace(PATH_REGEXP, replace);

  if (lastEndIndex < path.length) {
    addLastToken(path.substring(lastEndIndex))
  }

  return newPath;
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [options]
 * @return {RegExp}
 */
function pathToRegexp (path, keys, options, allTokens) {
  keys = keys || [];
  allTokens = allTokens || [];

  if (!isArray(keys)) {
    options = keys;
    keys = [];
  } else if (!options) {
    options = {};
  }

  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys, options, allTokens);
  }

  if (isArray(path)) {
    return arrayToRegexp(path, keys, options, allTokens);
  }

  var strict = options.strict;
  var end = options.end !== false;
  var route = replacePath(path, keys, allTokens);
  var endsWithSlash = path.charAt(path.length - 1) === '/';

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys, allTokens);
}

},{"isarray":26}],38:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],39:[function(require,module,exports){
'use strict';
var strictUriEncode = require('strict-uri-encode');
var objectAssign = require('object-assign');

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		formatter(decodeURIComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
};

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

},{"object-assign":34,"strict-uri-encode":42}],40:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var UPDATE_ROUTE_KEY = 'update_route';

function wrapWackyPromise(promise, cb) {
	promise.then(function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		cb.apply(undefined, [null].concat(args));
	}, cb);
}

module.exports = function RactiveStateRouter(Ractive, ractiveOptions, options) {
	function copyIfAppropriate(value) {
		if (options && options.deepCopyDataOnSet) {
			return copy(value);
		} else {
			return value;
		}
	}
	return function makeRenderer(stateRouter) {
		var ExtendedRactive = Ractive.extend(ractiveOptions || {});
		var extendedData = ExtendedRactive.defaults.data;
		var ractiveData = Ractive.defaults.data;

		var globalData = {};
		globalData[UPDATE_ROUTE_KEY] = {};
		var globalRactive = new Ractive({
			data: globalData
		});

		stateRouter.on('stateChangeEnd', function () {
			globalRactive.update(UPDATE_ROUTE_KEY);
		});

		extendedData.makePath = ractiveData.makePath = function makePath() {
			globalRactive.get(UPDATE_ROUTE_KEY);
			return stateRouter.makePath.apply(null, arguments);
		};

		extendedData.active = ractiveData.active = function active(stateName, options) {
			var className = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'active';

			globalRactive.get(UPDATE_ROUTE_KEY);
			return stateRouter.stateIsActive(stateName, options) ? className : '';
		};

		var activeDecorator = makeStateIsActiveDecorator(stateRouter);

		return {
			render: function render(context, cb) {
				var element = context.element;
				var inputTemplate = context.template;

				var defaultDecorators = {
					active: activeDecorator
				};

				function getData() {
					var copyOfContent = copyIfAppropriate(context.content);
					return isTemplate(inputTemplate) ? copyOfContent : Object.assign({}, inputTemplate.data, copyOfContent);
				}
				function getDecorators() {
					return isTemplate(inputTemplate) ? defaultDecorators : Object.assign(defaultDecorators, inputTemplate.decorators);
				}
				function getOptions() {
					var bareOptions = isTemplate(inputTemplate) ? { template: inputTemplate } : inputTemplate;

					return Object.assign({}, bareOptions, {
						decorators: getDecorators(),
						data: getData(),
						el: element
					});
				}

				try {
					var ractive = new ExtendedRactive(getOptions());
					cb(null, ractive);
				} catch (e) {
					cb(e);
				}
			},
			reset: function reset(context, cb) {
				var ractive = context.domApi;
				ractive.off();
				wrapWackyPromise(ractive.reset(copyIfAppropriate(context.content)), cb);
			},
			destroy: function destroy(ractive, cb) {
				wrapWackyPromise(ractive.teardown(), cb);
			},
			getChildElement: function getChildElement(ractive, cb) {
				try {
					var child = ractive.find('ui-view');
					cb(null, child);
				} catch (e) {
					cb(e);
				}
			}
		};
	};
};

function copy(value) {
	if (Array.isArray(value)) {
		return value.map(copy);
	} else if (object(value)) {
		var target = {};
		Object.keys(value).forEach(function (key) {
			target[key] = copy(value[key]);
		});
		return target;
	} else {
		return value;
	}
}

function object(o) {
	return o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object';
}

function makeStateIsActiveDecorator(stateRouter) {
	return function activeDecorator(node, stateName, options) {
		var className = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'active';

		function applyCurrentState() {
			if (stateRouter.stateIsActive(stateName, options)) {
				node.classList.add(className);
			} else {
				node.classList.remove(className);
			}
		}

		stateRouter.on('stateChangeEnd', applyCurrentState);

		function teardown() {
			stateRouter.removeListener('stateChangeEnd', applyCurrentState);
			node.classList.remove(className);
		}

		return {
			teardown: teardown
		};
	};
}

function isTemplate(inputTemplate) {
	return typeof inputTemplate === 'string' || isRactiveTemplateObject(inputTemplate);
}

function isRactiveTemplateObject(template) {
	// Based on https://github.com/ractivejs/ractive/blob/b1c9e1e5c22daac3210ee7db0f511065b31aac3c/src/Ractive/config/custom/template/template.js#L113-L116
	return template && typeof template.v === 'number';
}

},{}],41:[function(require,module,exports){
(function (global){
/*
	Ractive.js v0.9.2
	Build: 914a7dac7cbeaf720abf7913326927e1dda77767
	Date: Fri Jun 30 2017 16:35:02 GMT+0000 (UTC)
	Website: http://ractivejs.org
	License: MIT
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(function() {
		var current = global.Ractive;
		var exports = factory();
		global.Ractive = exports;
		exports.noConflict = function() { global.Ractive = current; return exports; };
	})();
}(this, (function () { 'use strict';

var defaults = {
	// render placement:
	el:                     void 0,
	append:                 false,
	delegate:               true,

	// template:
	template:               null,

	// parse:
	delimiters:             [ '{{', '}}' ],
	tripleDelimiters:       [ '{{{', '}}}' ],
	staticDelimiters:       [ '[[', ']]' ],
	staticTripleDelimiters: [ '[[[', ']]]' ],
	csp:                    true,
	interpolate:            false,
	preserveWhitespace:     false,
	sanitize:               false,
	stripComments:          true,
	contextLines:           0,
	parserTransforms:       [],

	// data & binding:
	data:                   {},
	computed:               {},
	syncComputedChildren:   false,
	resolveInstanceMembers: true,
	warnAboutAmbiguity:     false,
	adapt:                  [],
	isolated:               true,
	twoway:                 true,
	lazy:                   false,

	// transitions:
	noIntro:                false,
	noOutro:                false,
	transitionsEnabled:     true,
	complete:               void 0,
	nestedTransitions:      true,

	// css:
	css:                    null,
	noCssTransform:         false
};

// These are a subset of the easing equations found at
// https://raw.github.com/danro/easing-js - license info
// follows:

// --------------------------------------------------
// easing.js v0.5.4
// Generic set of easing functions with AMD support
// https://github.com/danro/easing-js
// This code may be freely distributed under the MIT license
// http://danro.mit-license.org/
// --------------------------------------------------
// All functions adapted from Thomas Fuchs & Jeremy Kahn
// Easing Equations (c) 2003 Robert Penner, BSD license
// https://raw.github.com/danro/easing-js/master/LICENSE
// --------------------------------------------------

// In that library, the functions named easeIn, easeOut, and
// easeInOut below are named easeInCubic, easeOutCubic, and
// (you guessed it) easeInOutCubic.
//
// You can add additional easing functions to this list, and they
// will be globally available.


var easing = {
	linear: function linear ( pos ) { return pos; },
	easeIn: function easeIn ( pos ) { return Math.pow( pos, 3 ); },
	easeOut: function easeOut ( pos ) { return ( Math.pow( ( pos - 1 ), 3 ) + 1 ); },
	easeInOut: function easeInOut ( pos ) {
		if ( ( pos /= 0.5 ) < 1 ) { return ( 0.5 * Math.pow( pos, 3 ) ); }
		return ( 0.5 * ( Math.pow( ( pos - 2 ), 3 ) + 2 ) );
	}
};

var toString = Object.prototype.toString;


function isEqual ( a, b ) {
	if ( a === null && b === null ) {
		return true;
	}

	if ( typeof a === 'object' || typeof b === 'object' ) {
		return false;
	}

	return a === b;
}

// http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
function isNumeric ( thing ) {
	return !isNaN( parseFloat( thing ) ) && isFinite( thing );
}

function isObject ( thing ) {
	return ( thing && toString.call( thing ) === '[object Object]' );
}

function isObjectLike ( thing ) {
	if ( !thing ) { return false; }
	var type = typeof thing;
	if ( type === 'object' || type === 'function' ) { return true; }
}

/* eslint no-console:"off" */
var win = typeof window !== 'undefined' ? window : null;
var doc = win ? document : null;
var isClient = !!doc;
var hasConsole = ( typeof console !== 'undefined' && typeof console.warn === 'function' && typeof console.warn.apply === 'function' );

var svg = doc ?
	doc.implementation.hasFeature( 'http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1' ) :
	false;

var vendors = [ 'o', 'ms', 'moz', 'webkit' ];

var noop = function () {};

/* global console */
/* eslint no-console:"off" */

var alreadyWarned = {};
var log;
var printWarning;
var welcome;

if ( hasConsole ) {
	var welcomeIntro = [
		"%cRactive.js %c0.9.2 %cin debug mode, %cmore...",
		'color: rgb(114, 157, 52); font-weight: normal;',
		'color: rgb(85, 85, 85); font-weight: normal;',
		'color: rgb(85, 85, 85); font-weight: normal;',
		'color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;'
	];
	var welcomeMessage = "You're running Ractive 0.9.2 in debug mode - messages will be printed to the console to help you fix problems and optimise your application.\n\nTo disable debug mode, add this line at the start of your app:\n  Ractive.DEBUG = false;\n\nTo disable debug mode when your app is minified, add this snippet:\n  Ractive.DEBUG = /unminified/.test(function(){/*unminified*/});\n\nGet help and support:\n  http://docs.ractivejs.org\n  http://stackoverflow.com/questions/tagged/ractivejs\n  http://groups.google.com/forum/#!forum/ractive-js\n  http://twitter.com/ractivejs\n\nFound a bug? Raise an issue:\n  https://github.com/ractivejs/ractive/issues\n\n";

	welcome = function () {
		if ( Ractive.WELCOME_MESSAGE === false ) {
			welcome = noop;
			return;
		}
		var message = 'WELCOME_MESSAGE' in Ractive ? Ractive.WELCOME_MESSAGE : welcomeMessage;
		var hasGroup = !!console.groupCollapsed;
		if ( hasGroup ) { console.groupCollapsed.apply( console, welcomeIntro ); }
		console.log( message );
		if ( hasGroup ) {
			console.groupEnd( welcomeIntro );
		}

		welcome = noop;
	};

	printWarning = function ( message, args ) {
		welcome();

		// extract information about the instance this message pertains to, if applicable
		if ( typeof args[ args.length - 1 ] === 'object' ) {
			var options = args.pop();
			var ractive = options ? options.ractive : null;

			if ( ractive ) {
				// if this is an instance of a component that we know the name of, add
				// it to the message
				var name;
				if ( ractive.component && ( name = ractive.component.name ) ) {
					message = "<" + name + "> " + message;
				}

				var node;
				if ( node = ( options.node || ( ractive.fragment && ractive.fragment.rendered && ractive.find( '*' ) ) ) ) {
					args.push( node );
				}
			}
		}

		console.warn.apply( console, [ '%cRactive.js: %c' + message, 'color: rgb(114, 157, 52);', 'color: rgb(85, 85, 85);' ].concat( args ) );
	};

	log = function () {
		console.log.apply( console, arguments );
	};
} else {
	printWarning = log = welcome = noop;
}

function format ( message, args ) {
	return message.replace( /%s/g, function () { return args.shift(); } );
}

function fatal ( message ) {
	var args = [], len = arguments.length - 1;
	while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

	message = format( message, args );
	throw new Error( message );
}

function logIfDebug () {
	if ( Ractive.DEBUG ) {
		log.apply( null, arguments );
	}
}

function warn ( message ) {
	var args = [], len = arguments.length - 1;
	while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

	message = format( message, args );
	printWarning( message, args );
}

function warnOnce ( message ) {
	var args = [], len = arguments.length - 1;
	while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

	message = format( message, args );

	if ( alreadyWarned[ message ] ) {
		return;
	}

	alreadyWarned[ message ] = true;
	printWarning( message, args );
}

function warnIfDebug () {
	if ( Ractive.DEBUG ) {
		warn.apply( null, arguments );
	}
}

function warnOnceIfDebug () {
	if ( Ractive.DEBUG ) {
		warnOnce.apply( null, arguments );
	}
}

// Error messages that are used (or could be) in multiple places
var badArguments = 'Bad arguments';
var noRegistryFunctionReturn = 'A function was specified for "%s" %s, but no %s was returned';
var missingPlugin = function ( name, type ) { return ("Missing \"" + name + "\" " + type + " plugin. You may need to download a plugin via http://docs.ractivejs.org/latest/plugins#" + type + "s"); };

function findInViewHierarchy ( registryName, ractive, name ) {
	var instance = findInstance( registryName, ractive, name );
	return instance ? instance[ registryName ][ name ] : null;
}

function findInstance ( registryName, ractive, name ) {
	while ( ractive ) {
		if ( name in ractive[ registryName ] ) {
			return ractive;
		}

		if ( ractive.isolated ) {
			return null;
		}

		ractive = ractive.parent;
	}
}

function interpolate ( from, to, ractive, type ) {
	if ( from === to ) { return null; }

	if ( type ) {
		var interpol = findInViewHierarchy( 'interpolators', ractive, type );
		if ( interpol ) { return interpol( from, to ) || null; }

		fatal( missingPlugin( type, 'interpolator' ) );
	}

	return interpolators.number( from, to ) ||
	       interpolators.array( from, to ) ||
	       interpolators.object( from, to ) ||
	       null;
}

function snap ( to ) {
	return function () { return to; };
}

var interpolators = {
	number: function number ( from, to ) {
		if ( !isNumeric( from ) || !isNumeric( to ) ) {
			return null;
		}

		from = +from;
		to = +to;

		var delta = to - from;

		if ( !delta ) {
			return function () { return from; };
		}

		return function ( t ) {
			return from + ( t * delta );
		};
	},

	array: function array ( from, to ) {
		var len, i;

		if ( !Array.isArray( from ) || !Array.isArray( to ) ) {
			return null;
		}

		var intermediate = [];
		var interpolators = [];

		i = len = Math.min( from.length, to.length );
		while ( i-- ) {
			interpolators[i] = interpolate( from[i], to[i] );
		}

		// surplus values - don't interpolate, but don't exclude them either
		for ( i=len; i<from.length; i+=1 ) {
			intermediate[i] = from[i];
		}

		for ( i=len; i<to.length; i+=1 ) {
			intermediate[i] = to[i];
		}

		return function ( t ) {
			var i = len;

			while ( i-- ) {
				intermediate[i] = interpolators[i]( t );
			}

			return intermediate;
		};
	},

	object: function object ( from, to ) {
		if ( !isObject( from ) || !isObject( to ) ) {
			return null;
		}

		var properties = [];
		var intermediate = {};
		var interpolators = {};

		for ( var prop in from ) {
			if ( from.hasOwnProperty( prop ) ) {
				if ( to.hasOwnProperty( prop ) ) {
					properties.push( prop );
					interpolators[ prop ] = interpolate( from[ prop ], to[ prop ] ) || snap( to[ prop ] );
				}

				else {
					intermediate[ prop ] = from[ prop ];
				}
			}
		}

		for ( var prop$1 in to ) {
			if ( to.hasOwnProperty( prop$1 ) && !from.hasOwnProperty( prop$1 ) ) {
				intermediate[ prop$1 ] = to[ prop$1 ];
			}
		}

		var len = properties.length;

		return function ( t ) {
			var i = len;

			while ( i-- ) {
				var prop = properties[i];

				intermediate[ prop ] = interpolators[ prop ]( t );
			}

			return intermediate;
		};
	}
};

function addToArray ( array, value ) {
	var index = array.indexOf( value );

	if ( index === -1 ) {
		array.push( value );
	}
}

function arrayContains ( array, value ) {
	for ( var i = 0, c = array.length; i < c; i++ ) {
		if ( array[i] == value ) {
			return true;
		}
	}

	return false;
}

function arrayContentsMatch ( a, b ) {
	var i;

	if ( !Array.isArray( a ) || !Array.isArray( b ) ) {
		return false;
	}

	if ( a.length !== b.length ) {
		return false;
	}

	i = a.length;
	while ( i-- ) {
		if ( a[i] !== b[i] ) {
			return false;
		}
	}

	return true;
}

function ensureArray ( x ) {
	if ( typeof x === 'string' ) {
		return [ x ];
	}

	if ( x === undefined ) {
		return [];
	}

	return x;
}

function lastItem ( array ) {
	return array[ array.length - 1 ];
}

function removeFromArray ( array, member ) {
	if ( !array ) {
		return;
	}

	var index = array.indexOf( member );

	if ( index !== -1 ) {
		array.splice( index, 1 );
	}
}

function combine () {
	var arrays = [], len = arguments.length;
	while ( len-- ) arrays[ len ] = arguments[ len ];

	var res = arrays.concat.apply( [], arrays );
	var i = res.length;
	while ( i-- ) {
		var idx = res.indexOf( res[i] );
		if ( ~idx && idx < i ) { res.splice( i, 1 ); }
	}

	return res;
}

function toArray ( arrayLike ) {
	var array = [];
	var i = arrayLike.length;
	while ( i-- ) {
		array[i] = arrayLike[i];
	}

	return array;
}

function findMap ( array, fn ) {
	var len = array.length;
	for ( var i = 0; i < len; i++ ) {
		var result = fn( array[i] );
		if ( result ) { return result; }
	}
}

var TransitionManager = function TransitionManager ( callback, parent ) {
	this.callback = callback;
	this.parent = parent;

	this.intros = [];
	this.outros = [];

	this.children = [];
	this.totalChildren = this.outroChildren = 0;

	this.detachQueue = [];
	this.outrosComplete = false;

	if ( parent ) {
		parent.addChild( this );
	}
};

TransitionManager.prototype.add = function add ( transition ) {
	var list = transition.isIntro ? this.intros : this.outros;
	transition.starting = true;
	list.push( transition );
};

TransitionManager.prototype.addChild = function addChild ( child ) {
	this.children.push( child );

	this.totalChildren += 1;
	this.outroChildren += 1;
};

TransitionManager.prototype.decrementOutros = function decrementOutros () {
	this.outroChildren -= 1;
	check( this );
};

TransitionManager.prototype.decrementTotal = function decrementTotal () {
	this.totalChildren -= 1;
	check( this );
};

TransitionManager.prototype.detachNodes = function detachNodes () {
	this.detachQueue.forEach( detach );
	this.children.forEach( _detachNodes );
	this.detachQueue = [];
};

TransitionManager.prototype.ready = function ready () {
	if ( this.detachQueue.length ) { detachImmediate( this ); }
};

TransitionManager.prototype.remove = function remove ( transition ) {
	var list = transition.isIntro ? this.intros : this.outros;
	removeFromArray( list, transition );
	check( this );
};

TransitionManager.prototype.start = function start () {
	this.children.forEach( function (c) { return c.start(); } );
	this.intros.concat( this.outros ).forEach( function (t) { return t.start(); } );
	this.ready = true;
	check( this );
};

function detach ( element ) {
	element.detach();
}

function _detachNodes ( tm ) { // _ to avoid transpiler quirk
	tm.detachNodes();
}

function check ( tm ) {
	if ( !tm.ready || tm.outros.length || tm.outroChildren ) { return; }

	// If all outros are complete, and we haven't already done this,
	// we notify the parent if there is one, otherwise
	// start detaching nodes
	if ( !tm.outrosComplete ) {
		tm.outrosComplete = true;

		if ( tm.parent && !tm.parent.outrosComplete ) {
			tm.parent.decrementOutros( tm );
		} else {
			tm.detachNodes();
		}
	}

	// Once everything is done, we can notify parent transition
	// manager and call the callback
	if ( !tm.intros.length && !tm.totalChildren ) {
		if ( typeof tm.callback === 'function' ) {
			tm.callback();
		}

		if ( tm.parent && !tm.notifiedTotal ) {
			tm.notifiedTotal = true;
			tm.parent.decrementTotal();
		}
	}
}

// check through the detach queue to see if a node is up or downstream from a
// transition and if not, go ahead and detach it
function detachImmediate ( manager ) {
	var queue = manager.detachQueue;
	var outros = collectAllOutros( manager );

	var i = queue.length;
	var j = 0;
	var node, trans;
	start: while ( i-- ) {
		node = queue[i].node;
		j = outros.length;
		while ( j-- ) {
			trans = outros[j].element.node;
			// check to see if the node is, contains, or is contained by the transitioning node
			if ( trans === node || trans.contains( node ) || node.contains( trans ) ) { continue start; }
		}

		// no match, we can drop it
		queue[i].detach();
		queue.splice( i, 1 );
	}
}

function collectAllOutros ( manager, _list ) {
	var list = _list;

	// if there's no list, we're starting at the root to build one
	if ( !list ) {
		list = [];
		var parent = manager;
		while ( parent.parent ) { parent = parent.parent; }
		return collectAllOutros( parent, list );
	} else {
		// grab all outros from child managers
		var i = manager.children.length;
		while ( i-- ) {
			list = collectAllOutros( manager.children[i], list );
		}

		// grab any from this manager if there are any
		if ( manager.outros.length ) { list = list.concat( manager.outros ); }

		return list;
	}
}

var batch;

var runloop = {
	start: function start ( instance ) {
		var fulfilPromise;
		var promise = new Promise( function (f) { return ( fulfilPromise = f ); } );

		batch = {
			previousBatch: batch,
			transitionManager: new TransitionManager( fulfilPromise, batch && batch.transitionManager ),
			fragments: [],
			tasks: [],
			immediateObservers: [],
			deferredObservers: [],
			instance: instance,
			promise: promise
		};

		return promise;
	},

	end: function end () {
		flushChanges();

		if ( !batch.previousBatch ) { batch.transitionManager.start(); }

		batch = batch.previousBatch;
	},

	addFragment: function addFragment ( fragment ) {
		addToArray( batch.fragments, fragment );
	},

	// TODO: come up with a better way to handle fragments that trigger their own update
	addFragmentToRoot: function addFragmentToRoot ( fragment ) {
		if ( !batch ) { return; }

		var b = batch;
		while ( b.previousBatch ) {
			b = b.previousBatch;
		}

		addToArray( b.fragments, fragment );
	},

	addObserver: function addObserver ( observer, defer ) {
		if ( !batch ) {
			observer.dispatch();
		} else {
			addToArray( defer ? batch.deferredObservers : batch.immediateObservers, observer );
		}
	},

	registerTransition: function registerTransition ( transition ) {
		transition._manager = batch.transitionManager;
		batch.transitionManager.add( transition );
	},

	// synchronise node detachments with transition ends
	detachWhenReady: function detachWhenReady ( thing ) {
		batch.transitionManager.detachQueue.push( thing );
	},

	scheduleTask: function scheduleTask ( task, postRender ) {
		var _batch;

		if ( !batch ) {
			task();
		} else {
			_batch = batch;
			while ( postRender && _batch.previousBatch ) {
				// this can't happen until the DOM has been fully updated
				// otherwise in some situations (with components inside elements)
				// transitions and decorators will initialise prematurely
				_batch = _batch.previousBatch;
			}

			_batch.tasks.push( task );
		}
	},

	promise: function promise () {
		if ( !batch ) { return Promise.resolve(); }

		var target = batch;
		while ( target.previousBatch ) {
			target = target.previousBatch;
		}

		return target.promise || Promise.resolve();
	}
};

function dispatch ( observer ) {
	observer.dispatch();
}

function flushChanges () {
	var which = batch.immediateObservers;
	batch.immediateObservers = [];
	which.forEach( dispatch );

	// Now that changes have been fully propagated, we can update the DOM
	// and complete other tasks
	var i = batch.fragments.length;
	var fragment;

	which = batch.fragments;
	batch.fragments = [];

	while ( i-- ) {
		fragment = which[i];
		fragment.update();
	}

	batch.transitionManager.ready();

	which = batch.deferredObservers;
	batch.deferredObservers = [];
	which.forEach( dispatch );

	var tasks = batch.tasks;
	batch.tasks = [];

	for ( i = 0; i < tasks.length; i += 1 ) {
		tasks[i]();
	}

	// If updating the view caused some model blowback - e.g. a triple
	// containing <option> elements caused the binding on the <select>
	// to update - then we start over
	if ( batch.fragments.length || batch.immediateObservers.length || batch.deferredObservers.length || batch.tasks.length ) { return flushChanges(); }
}

var refPattern = /\[\s*(\*|[0-9]|[1-9][0-9]+)\s*\]/g;
var splitPattern = /([^\\](?:\\\\)*)\./;
var escapeKeyPattern = /\\|\./g;
var unescapeKeyPattern = /((?:\\)+)\1|\\(\.)/g;

function escapeKey ( key ) {
	if ( typeof key === 'string' ) {
		return key.replace( escapeKeyPattern, '\\$&' );
	}

	return key;
}

function normalise ( ref ) {
	return ref ? ref.replace( refPattern, '.$1' ) : '';
}

function splitKeypath ( keypath ) {
	var result = [];
	var match;

	keypath = normalise( keypath );

	while ( match = splitPattern.exec( keypath ) ) {
		var index = match.index + match[1].length;
		result.push( keypath.substr( 0, index ) );
		keypath = keypath.substr( index + 1 );
	}

	result.push( keypath );

	return result;
}

function unescapeKey ( key ) {
	if ( typeof key === 'string' ) {
		return key.replace( unescapeKeyPattern, '$1$2' );
	}

	return key;
}

var stack = [];
var captureGroup;

function startCapturing () {
	stack.push( captureGroup = [] );
}

function stopCapturing () {
	var dependencies = stack.pop();
	captureGroup = stack[ stack.length - 1 ];
	return dependencies;
}

function capture ( model ) {
	if ( captureGroup ) {
		captureGroup.push( model );
	}
}

var KeyModel = function KeyModel ( key, parent ) {
	this.value = key;
	this.isReadonly = this.isKey = true;
	this.deps = [];
	this.links = [];
	this.parent = parent;
};

KeyModel.prototype.get = function get ( shouldCapture ) {
	if ( shouldCapture ) { capture( this ); }
	return unescapeKey( this.value );
};

KeyModel.prototype.getKeypath = function getKeypath () {
	return unescapeKey( this.value );
};

KeyModel.prototype.rebind = function rebind ( next, previous ) {
		var this$1 = this;

	var i = this.deps.length;
	while ( i-- ) { this$1.deps[i].rebind( next, previous, false ); }

	i = this.links.length;
	while ( i-- ) { this$1.links[i].rebind( next, previous, false ); }
};

KeyModel.prototype.register = function register ( dependant ) {
	this.deps.push( dependant );
};

KeyModel.prototype.registerLink = function registerLink ( link ) {
	addToArray( this.links, link );
};

KeyModel.prototype.unregister = function unregister ( dependant ) {
	removeFromArray( this.deps, dependant );
};

KeyModel.prototype.unregisterLink = function unregisterLink ( link ) {
	removeFromArray( this.links, link );
};

KeyModel.prototype.reference = noop;
KeyModel.prototype.unreference = noop;

function bind               ( x ) { x.bind(); }
function cancel             ( x ) { x.cancel(); }
function destroyed          ( x ) { x.destroyed(); }
function handleChange       ( x ) { x.handleChange(); }
function mark               ( x ) { x.mark(); }
function markForce          ( x ) { x.mark( true ); }
function marked             ( x ) { x.marked(); }
function markedAll          ( x ) { x.markedAll(); }
function render             ( x ) { x.render(); }
function shuffled           ( x ) { x.shuffled(); }
function teardown           ( x ) { x.teardown(); }
function unbind             ( x ) { x.unbind(); }
function unrender           ( x ) { x.unrender(); }
function unrenderAndDestroy ( x ) { x.unrender( true ); }
function update             ( x ) { x.update(); }
function toString$1           ( x ) { return x.toString(); }
function toEscapedString    ( x ) { return x.toString( true ); }

var KeypathModel = function KeypathModel ( parent, ractive ) {
	this.parent = parent;
	this.ractive = ractive;
	this.value = ractive ? parent.getKeypath( ractive ) : parent.getKeypath();
	this.deps = [];
	this.children = {};
	this.isReadonly = this.isKeypath = true;
};

KeypathModel.prototype.get = function get ( shouldCapture ) {
	if ( shouldCapture ) { capture( this ); }
	return this.value;
};

KeypathModel.prototype.getChild = function getChild ( ractive ) {
	if ( !( ractive._guid in this.children ) ) {
		var model = new KeypathModel( this.parent, ractive );
		this.children[ ractive._guid ] = model;
		model.owner = this;
	}
	return this.children[ ractive._guid ];
};

KeypathModel.prototype.getKeypath = function getKeypath () {
	return this.value;
};

KeypathModel.prototype.handleChange = function handleChange$1 () {
		var this$1 = this;

	var keys = Object.keys( this.children );
	var i = keys.length;
	while ( i-- ) {
		this$1.children[ keys[i] ].handleChange();
	}

	this.deps.forEach( handleChange );
};

KeypathModel.prototype.rebindChildren = function rebindChildren ( next ) {
		var this$1 = this;

	var keys = Object.keys( this.children );
	var i = keys.length;
	while ( i-- ) {
		var child = this$1.children[keys[i]];
		child.value = next.getKeypath( child.ractive );
		child.handleChange();
	}
};

KeypathModel.prototype.rebind = function rebind ( next, previous ) {
		var this$1 = this;

	var model = next ? next.getKeypathModel( this.ractive ) : undefined;

	var keys = Object.keys( this.children );
	var i = keys.length;
	while ( i-- ) {
		this$1.children[ keys[i] ].rebind( next, previous, false );
	}

	i = this.deps.length;
	while ( i-- ) {
		this$1.deps[i].rebind( model, this$1, false );
	}
};

KeypathModel.prototype.register = function register ( dep ) {
	this.deps.push( dep );
};

KeypathModel.prototype.removeChild = function removeChild ( model ) {
	if ( model.ractive ) { delete this.children[ model.ractive._guid ]; }
};

KeypathModel.prototype.teardown = function teardown$$1 () {
		var this$1 = this;

	if ( this.owner ) { this.owner.removeChild( this ); }

	var keys = Object.keys( this.children );
	var i = keys.length;
	while ( i-- ) {
		this$1.children[ keys[i] ].teardown();
	}
};

KeypathModel.prototype.unregister = function unregister ( dep ) {
	removeFromArray( this.deps, dep );
	if ( !this.deps.length ) { this.teardown(); }
};

KeypathModel.prototype.reference = noop;
KeypathModel.prototype.unreference = noop;

var fnBind = Function.prototype.bind;

function bind$1 ( fn, context ) {
	if ( !/this/.test( fn.toString() ) ) { return fn; }

	var bound = fnBind.call( fn, context );
	for ( var prop in fn ) { bound[ prop ] = fn[ prop ]; }

	return bound;
}

var hasProp = Object.prototype.hasOwnProperty;

var shuffleTasks = { early: [], mark: [] };
var registerQueue = { early: [], mark: [] };

var ModelBase = function ModelBase ( parent ) {
	this.deps = [];

	this.children = [];
	this.childByKey = {};
	this.links = [];

	this.keyModels = {};

	this.bindings = [];
	this.patternObservers = [];

	if ( parent ) {
		this.parent = parent;
		this.root = parent.root;
	}
};

ModelBase.prototype.addShuffleTask = function addShuffleTask ( task, stage ) {
	if ( stage === void 0 ) stage = 'early';
 shuffleTasks[stage].push( task ); };
ModelBase.prototype.addShuffleRegister = function addShuffleRegister ( item, stage ) {
	if ( stage === void 0 ) stage = 'early';
 registerQueue[stage].push({ model: this, item: item }); };

ModelBase.prototype.findMatches = function findMatches ( keys ) {
	var len = keys.length;

	var existingMatches = [ this ];
	var matches;
	var i;

	var loop = function (  ) {
		var key = keys[i];

		if ( key === '*' ) {
			matches = [];
			existingMatches.forEach( function (model) {
				matches.push.apply( matches, model.getValueChildren( model.get() ) );
			});
		} else {
			matches = existingMatches.map( function (model) { return model.joinKey( key ); } );
		}

		existingMatches = matches;
	};

		for ( i = 0; i < len; i += 1 ) loop(  );

	return matches;
};

ModelBase.prototype.getKeyModel = function getKeyModel ( key, skip ) {
	if ( key !== undefined && !skip ) { return this.parent.getKeyModel( key, true ); }

	if ( !( key in this.keyModels ) ) { this.keyModels[ key ] = new KeyModel( escapeKey( key ), this ); }

	return this.keyModels[ key ];
};

ModelBase.prototype.getKeypath = function getKeypath ( ractive ) {
	if ( ractive !== this.ractive && this._link ) { return this._link.target.getKeypath( ractive ); }

	if ( !this.keypath ) {
		var parent = this.parent && this.parent.getKeypath( ractive );
		this.keypath = parent ? ((this.parent.getKeypath( ractive )) + "." + (escapeKey( this.key ))) : escapeKey( this.key );
	}

	return this.keypath;
};

ModelBase.prototype.getValueChildren = function getValueChildren ( value ) {
		var this$1 = this;

	var children;
	if ( Array.isArray( value ) ) {
		children = [];
		if ( 'length' in this && this.length !== value.length ) {
			children.push( this.joinKey( 'length' ) );
		}
		value.forEach( function ( m, i ) {
			children.push( this$1.joinKey( i ) );
		});
	}

	else if ( isObject( value ) || typeof value === 'function' ) {
		children = Object.keys( value ).map( function (key) { return this$1.joinKey( key ); } );
	}

	else if ( value != null ) {
		return [];
	}

	return children;
};

ModelBase.prototype.getVirtual = function getVirtual ( shouldCapture ) {
		var this$1 = this;

	var value = this.get( shouldCapture, { virtual: false } );
	if ( isObject( value ) ) {
		var result = Array.isArray( value ) ? [] : {};

		var keys = Object.keys( value );
		var i = keys.length;
		while ( i-- ) {
			var child = this$1.childByKey[ keys[i] ];
			if ( !child ) { result[ keys[i] ] = value[ keys[i] ]; }
			else if ( child._link ) { result[ keys[i] ] = child._link.getVirtual(); }
			else { result[ keys[i] ] = child.getVirtual(); }
		}

		i = this.children.length;
		while ( i-- ) {
			var child$1 = this$1.children[i];
			if ( !( child$1.key in result ) && child$1._link ) {
				result[ child$1.key ] = child$1._link.getVirtual();
			}
		}

		return result;
	} else { return value; }
};

ModelBase.prototype.has = function has ( key ) {
	if ( this._link ) { return this._link.has( key ); }

	var value = this.get();
	if ( !value ) { return false; }

	key = unescapeKey( key );
	if ( hasProp.call( value, key ) ) { return true; }

	// We climb up the constructor chain to find if one of them contains the key
	var constructor = value.constructor;
	while ( constructor !== Function && constructor !== Array && constructor !== Object ) {
		if ( hasProp.call( constructor.prototype, key ) ) { return true; }
		constructor = constructor.constructor;
	}

	return false;
};

ModelBase.prototype.joinAll = function joinAll ( keys, opts ) {
	var model = this;
	for ( var i = 0; i < keys.length; i += 1 ) {
		if ( opts && opts.lastLink === false && i + 1 === keys.length && model.childByKey[keys[i]] && model.childByKey[keys[i]]._link ) { return model.childByKey[keys[i]]; }
		model = model.joinKey( keys[i], opts );
	}

	return model;
};

ModelBase.prototype.notifyUpstream = function notifyUpstream ( startPath ) {
		var this$1 = this;

	var parent = this.parent;
	var path = startPath || [ this.key ];
	while ( parent ) {
		if ( parent.patternObservers.length ) { parent.patternObservers.forEach( function (o) { return o.notify( path.slice() ); } ); }
		path.unshift( parent.key );
		parent.links.forEach( function (l) { return l.notifiedUpstream( path, this$1.root ); } );
		parent.deps.forEach( handleChange );
		parent = parent.parent;
	}
};

ModelBase.prototype.rebind = function rebind ( next, previous, safe ) {
		var this$1 = this;

	// tell the deps to move to the new target
	var i = this.deps.length;
	while ( i-- ) {
		if ( this$1.deps[i].rebind ) { this$1.deps[i].rebind( next, previous, safe ); }
	}

	i = this.links.length;
	while ( i-- ) {
		var link = this$1.links[i];
		// only relink the root of the link tree
		if ( link.owner._link ) { link.relinking( next, safe ); }
	}

	i = this.children.length;
	while ( i-- ) {
		var child = this$1.children[i];
		child.rebind( next ? next.joinKey( child.key ) : undefined, child, safe );
	}

	if ( this.keypathModel ) { this.keypathModel.rebind( next, previous, false ); }

	i = this.bindings.length;
	while ( i-- ) {
		this$1.bindings[i].rebind( next, previous, safe );
	}
};

ModelBase.prototype.reference = function reference () {
	'refs' in this ? this.refs++ : this.refs = 1;
};

ModelBase.prototype.register = function register ( dep ) {
	this.deps.push( dep );
};

ModelBase.prototype.registerLink = function registerLink ( link ) {
	addToArray( this.links, link );
};

ModelBase.prototype.registerPatternObserver = function registerPatternObserver ( observer ) {
	this.patternObservers.push( observer );
	this.register( observer );
};

ModelBase.prototype.registerTwowayBinding = function registerTwowayBinding ( binding ) {
	this.bindings.push( binding );
};

ModelBase.prototype.unreference = function unreference () {
	if ( 'refs' in this ) { this.refs--; }
};

ModelBase.prototype.unregister = function unregister ( dep ) {
	removeFromArray( this.deps, dep );
};

ModelBase.prototype.unregisterLink = function unregisterLink ( link ) {
	removeFromArray( this.links, link );
};

ModelBase.prototype.unregisterPatternObserver = function unregisterPatternObserver ( observer ) {
	removeFromArray( this.patternObservers, observer );
	this.unregister( observer );
};

ModelBase.prototype.unregisterTwowayBinding = function unregisterTwowayBinding ( binding ) {
	removeFromArray( this.bindings, binding );
};

ModelBase.prototype.updateFromBindings = function updateFromBindings$1 ( cascade ) {
		var this$1 = this;

	var i = this.bindings.length;
	while ( i-- ) {
		var value = this$1.bindings[i].getValue();
		if ( value !== this$1.value ) { this$1.set( value ); }
	}

	// check for one-way bindings if there are no two-ways
	if ( !this.bindings.length ) {
		var oneway = findBoundValue( this.deps );
		if ( oneway && oneway.value !== this.value ) { this.set( oneway.value ); }
	}

	if ( cascade ) {
		this.children.forEach( updateFromBindings );
		this.links.forEach( updateFromBindings );
		if ( this._link ) { this._link.updateFromBindings( cascade ); }
	}
};

// TODO: this may be better handled by overreiding `get` on models with a parent that isRoot
function maybeBind ( model, value, shouldBind ) {
	if ( shouldBind && typeof value === 'function' && model.parent && model.parent.isRoot ) {
		if ( !model.boundValue ) {
			model.boundValue = bind$1( value._r_unbound || value, model.parent.ractive );
		}

		return model.boundValue;
	}

	return value;
}

function updateFromBindings ( model ) {
	model.updateFromBindings( true );
}

function findBoundValue( list ) {
	var i = list.length;
	while ( i-- ) {
		if ( list[i].bound ) {
			var owner = list[i].owner;
			if ( owner ) {
				var value = owner.name === 'checked' ?
					owner.node.checked :
					owner.node.value;
				return { value: value };
			}
		}
	}
}

function fireShuffleTasks ( stage ) {
	if ( !stage ) {
		fireShuffleTasks( 'early' );
		fireShuffleTasks( 'mark' );
	} else {
		var tasks = shuffleTasks[stage];
		shuffleTasks[stage] = [];
		var i = tasks.length;
		while ( i-- ) { tasks[i](); }

		var register = registerQueue[stage];
		registerQueue[stage] = [];
		i = register.length;
		while ( i-- ) { register[i].model.register( register[i].item ); }
	}
}

function shuffle ( model, newIndices, link, unsafe ) {
	model.shuffling = true;

	var i = newIndices.length;
	while ( i-- ) {
		var idx = newIndices[ i ];
		// nothing is actually changing, so move in the index and roll on
		if ( i === idx ) {
			continue;
		}

		// rebind the children on i to idx
		if ( i in model.childByKey ) { model.childByKey[ i ].rebind( !~idx ? undefined : model.joinKey( idx ), model.childByKey[ i ], !unsafe ); }

		if ( !~idx && model.keyModels[ i ] ) {
			model.keyModels[i].rebind( undefined, model.keyModels[i], false );
		} else if ( ~idx && model.keyModels[ i ] ) {
			if ( !model.keyModels[ idx ] ) { model.childByKey[ idx ].getKeyModel( idx ); }
			model.keyModels[i].rebind( model.keyModels[ idx ], model.keyModels[i], false );
		}
	}

	var upstream = model.source().length !== model.source().value.length;

	model.links.forEach( function (l) { return l.shuffle( newIndices ); } );
	if ( !link ) { fireShuffleTasks( 'early' ); }

	i = model.deps.length;
	while ( i-- ) {
		if ( model.deps[i].shuffle ) { model.deps[i].shuffle( newIndices ); }
	}

	model[ link ? 'marked' : 'mark' ]();
	if ( !link ) { fireShuffleTasks( 'mark' ); }

	if ( upstream ) { model.notifyUpstream(); }

	model.shuffling = false;
}

KeyModel.prototype.addShuffleTask = ModelBase.prototype.addShuffleTask;
KeyModel.prototype.addShuffleRegister = ModelBase.prototype.addShuffleRegister;
KeypathModel.prototype.addShuffleTask = ModelBase.prototype.addShuffleTask;
KeypathModel.prototype.addShuffleRegister = ModelBase.prototype.addShuffleRegister;

// this is the dry method of checking to see if a rebind applies to
// a particular keypath because in some cases, a dep may be bound
// directly to a particular keypath e.g. foo.bars.0.baz and need
// to avoid getting kicked to foo.bars.1.baz if foo.bars is unshifted
function rebindMatch ( template, next, previous, fragment ) {
	var keypath = template.r || template;

	// no valid keypath, go with next
	if ( !keypath || typeof keypath !== 'string' ) { return next; }

	// completely contextual ref, go with next
	if ( keypath === '.' || keypath[0] === '@' || ( next || previous ).isKey || ( next || previous ).isKeypath ) { return next; }

	var parts = keypath.split( '/' );
	var keys = splitKeypath( parts[ parts.length - 1 ] );
	var last = keys[ keys.length - 1 ];

	// check the keypath against the model keypath to see if it matches
	var model = next || previous;

	// check to see if this was an alias
	if ( model && keys.length === 1 && last !== model.key && fragment ) {
		keys = findAlias( last, fragment ) || keys;
	}

	var i = keys.length;
	var match = true;
	var shuffling = false;

	while ( model && i-- ) {
		if ( model.shuffling ) { shuffling = true; }
		// non-strict comparison to account for indices in keypaths
		if ( keys[i] != model.key ) { match = false; }
		model = model.parent;
	}

	// next is undefined, but keypath is shuffling and previous matches
	if ( !next && match && shuffling ) { return previous; }
	// next is defined, but doesn't match the keypath
	else if ( next && !match && shuffling ) { return previous; }
	else { return next; }
}

function findAlias ( name, fragment ) {
	while ( fragment ) {
		var z = fragment.aliases;
		if ( z && z[ name ] ) {
			var aliases = ( fragment.owner.iterations ? fragment.owner : fragment ).owner.template.z;
			for ( var i = 0; i < aliases.length; i++ ) {
				if ( aliases[i].n === name ) {
					var alias = aliases[i].x;
					if ( !alias.r ) { return false; }
					var parts = alias.r.split( '/' );
					return splitKeypath( parts[ parts.length - 1 ] );
				}
			}
			return;
		}

		fragment = fragment.componentParent || fragment.parent;
	}
}

// temporary placeholder target for detached implicit links
var Missing = {
	key: '@missing',
	animate: noop,
	applyValue: noop,
	get: noop,
	getKeypath: function getKeypath () { return this.key; },
	joinAll: function joinAll () { return this; },
	joinKey: function joinKey () { return this; },
	mark: noop,
	registerLink: noop,
	shufle: noop,
	set: noop,
	unregisterLink: noop
};
Missing.parent = Missing;

var LinkModel = (function (ModelBase$$1) {
	function LinkModel ( parent, owner, target, key ) {
		ModelBase$$1.call( this, parent );

		this.owner = owner;
		this.target = target;
		this.key = key === undefined ? owner.key : key;
		if ( owner.isLink ) { this.sourcePath = (owner.sourcePath) + "." + (this.key); }

		target.registerLink( this );

		if ( parent ) { this.isReadonly = parent.isReadonly; }

		this.isLink = true;
	}

	if ( ModelBase$$1 ) LinkModel.__proto__ = ModelBase$$1;
	LinkModel.prototype = Object.create( ModelBase$$1 && ModelBase$$1.prototype );
	LinkModel.prototype.constructor = LinkModel;

	LinkModel.prototype.animate = function animate ( from, to, options, interpolator ) {
		return this.target.animate( from, to, options, interpolator );
	};

	LinkModel.prototype.applyValue = function applyValue ( value ) {
		if ( this.boundValue ) { this.boundValue = null; }
		this.target.applyValue( value );
	};

	LinkModel.prototype.attach = function attach ( fragment ) {
		var model = resolveReference( fragment, this.key );
		if ( model ) {
			this.relinking( model, false );
		} else { // if there is no link available, move everything here to real models
			this.owner.unlink();
		}
	};

	LinkModel.prototype.detach = function detach () {
		this.relinking( Missing, false );
	};

	LinkModel.prototype.get = function get ( shouldCapture, opts ) {
		if ( opts === void 0 ) opts = {};

		if ( shouldCapture ) {
			capture( this );

			// may need to tell the target to unwrap
			opts.unwrap = true;
		}

		var bind$$1 = 'shouldBind' in opts ? opts.shouldBind : true;
		opts.shouldBind = false;

		return maybeBind( this, this.target.get( false, opts ), bind$$1 );
	};

	LinkModel.prototype.getKeypath = function getKeypath ( ractive ) {
		if ( ractive && ractive !== this.root.ractive ) { return this.target.getKeypath( ractive ); }

		return ModelBase$$1.prototype.getKeypath.call( this, ractive );
	};

	LinkModel.prototype.getKeypathModel = function getKeypathModel ( ractive ) {
		if ( !this.keypathModel ) { this.keypathModel = new KeypathModel( this ); }
		if ( ractive && ractive !== this.root.ractive ) { return this.keypathModel.getChild( ractive ); }
		return this.keypathModel;
	};

	LinkModel.prototype.handleChange = function handleChange$1 () {
		this.deps.forEach( handleChange );
		this.links.forEach( handleChange );
		this.notifyUpstream();
	};

	LinkModel.prototype.isDetached = function isDetached () { return this.virtual && this.target === Missing; };

	LinkModel.prototype.joinKey = function joinKey ( key ) {
		// TODO: handle nested links
		if ( key === undefined || key === '' ) { return this; }

		if ( !this.childByKey.hasOwnProperty( key ) ) {
			var child = new LinkModel( this, this, this.target.joinKey( key ), key );
			this.children.push( child );
			this.childByKey[ key ] = child;
		}

		return this.childByKey[ key ];
	};

	LinkModel.prototype.mark = function mark$$1 ( force ) {
		this.target.mark( force );
	};

	LinkModel.prototype.marked = function marked$1 () {
		if ( this.boundValue ) { this.boundValue = null; }

		this.links.forEach( marked );

		this.deps.forEach( handleChange );
	};

	LinkModel.prototype.markedAll = function markedAll$1 () {
		this.children.forEach( markedAll );
		this.marked();
	};

	LinkModel.prototype.notifiedUpstream = function notifiedUpstream ( startPath, root ) {
		var this$1 = this;

		this.links.forEach( function (l) { return l.notifiedUpstream( startPath, this$1.root ); } );
		this.deps.forEach( handleChange );
		if ( startPath && this.rootLink && this.root !== root ) {
			var path = startPath.slice( 1 );
			path.unshift( this.key );
			this.notifyUpstream( path );
		}
	};

	LinkModel.prototype.relinked = function relinked () {
		this.target.registerLink( this );
		this.children.forEach( function (c) { return c.relinked(); } );
	};

	LinkModel.prototype.relinking = function relinking ( target, safe ) {
		var this$1 = this;

		if ( this.rootLink && this.sourcePath ) { target = rebindMatch( this.sourcePath, target, this.target ); }
		if ( !target || this.target === target ) { return; }

		this.target.unregisterLink( this );
		if ( this.keypathModel ) { this.keypathModel.rebindChildren( target ); }

		this.target = target;
		this.children.forEach( function (c) {
			c.relinking( target.joinKey( c.key ), safe );
		});

		if ( this.rootLink ) { this.addShuffleTask( function () {
			this$1.relinked();
			if ( !safe ) {
				this$1.markedAll();
				this$1.notifyUpstream();
			}
		}); }
	};

	LinkModel.prototype.set = function set ( value ) {
		if ( this.boundValue ) { this.boundValue = null; }
		this.target.set( value );
	};

	LinkModel.prototype.shuffle = function shuffle$1 ( newIndices ) {
		// watch for extra shuffles caused by a shuffle in a downstream link
		if ( this.shuffling ) { return; }

		// let the real model handle firing off shuffles
		if ( !this.target.shuffling ) {
			this.target.shuffle( newIndices );
		} else {
			shuffle( this, newIndices, true );
		}

	};

	LinkModel.prototype.source = function source () {
		if ( this.target.source ) { return this.target.source(); }
		else { return this.target; }
	};

	LinkModel.prototype.teardown = function teardown$1 () {
		if ( this._link ) { this._link.teardown(); }
		this.target.unregisterLink( this );
		this.children.forEach( teardown );
	};

	return LinkModel;
}(ModelBase));

ModelBase.prototype.link = function link ( model, keypath, options ) {
	var lnk = this._link || new LinkModel( this.parent, this, model, this.key );
	lnk.implicit = options && options.implicit;
	lnk.sourcePath = keypath;
	lnk.rootLink = true;
	if ( this._link ) { this._link.relinking( model, false ); }
	this.rebind( lnk, this, false );
	fireShuffleTasks();

	this._link = lnk;
	lnk.markedAll();

	this.notifyUpstream();
	return lnk;
};

ModelBase.prototype.unlink = function unlink () {
	if ( this._link ) {
		var ln = this._link;
		this._link = undefined;
		ln.rebind( this, ln, false );
		fireShuffleTasks();
		ln.teardown();
		this.notifyUpstream();
	}
};

// TODO what happens if a transition is aborted?

var tickers = [];
var running = false;

function tick () {
	runloop.start();

	var now = performance.now();

	var i;
	var ticker;

	for ( i = 0; i < tickers.length; i += 1 ) {
		ticker = tickers[i];

		if ( !ticker.tick( now ) ) {
			// ticker is complete, remove it from the stack, and decrement i so we don't miss one
			tickers.splice( i--, 1 );
		}
	}

	runloop.end();

	if ( tickers.length ) {
		requestAnimationFrame( tick );
	} else {
		running = false;
	}
}

var Ticker = function Ticker ( options ) {
	this.duration = options.duration;
	this.step = options.step;
	this.complete = options.complete;
	this.easing = options.easing;

	this.start = performance.now();
	this.end = this.start + this.duration;

	this.running = true;

	tickers.push( this );
	if ( !running ) { requestAnimationFrame( tick ); }
};

Ticker.prototype.tick = function tick ( now ) {
	if ( !this.running ) { return false; }

	if ( now > this.end ) {
		if ( this.step ) { this.step( 1 ); }
		if ( this.complete ) { this.complete( 1 ); }

		return false;
	}

	var elapsed = now - this.start;
	var eased = this.easing( elapsed / this.duration );

	if ( this.step ) { this.step( eased ); }

	return true;
};

Ticker.prototype.stop = function stop () {
	if ( this.abort ) { this.abort(); }
	this.running = false;
};

var prefixers = {};

// TODO this is legacy. sooner we can replace the old adaptor API the better
function prefixKeypath ( obj, prefix ) {
	var prefixed = {};

	if ( !prefix ) {
		return obj;
	}

	prefix += '.';

	for ( var key in obj ) {
		if ( obj.hasOwnProperty( key ) ) {
			prefixed[ prefix + key ] = obj[ key ];
		}
	}

	return prefixed;
}

function getPrefixer ( rootKeypath ) {
	var rootDot;

	if ( !prefixers[ rootKeypath ] ) {
		rootDot = rootKeypath ? rootKeypath + '.' : '';

		prefixers[ rootKeypath ] = function ( relativeKeypath, value ) {
			var obj;

			if ( typeof relativeKeypath === 'string' ) {
				obj = {};
				obj[ rootDot + relativeKeypath ] = value;
				return obj;
			}

			if ( typeof relativeKeypath === 'object' ) {
				// 'relativeKeypath' is in fact a hash, not a keypath
				return rootDot ? prefixKeypath( relativeKeypath, rootKeypath ) : relativeKeypath;
			}
		};
	}

	return prefixers[ rootKeypath ];
}

var Model = (function (ModelBase$$1) {
	function Model ( parent, key ) {
		ModelBase$$1.call( this, parent );

		this.ticker = null;

		if ( parent ) {
			this.key = unescapeKey( key );
			this.isReadonly = parent.isReadonly;

			if ( parent.value ) {
				this.value = parent.value[ this.key ];
				if ( Array.isArray( this.value ) ) { this.length = this.value.length; }
				this.adapt();
			}
		}
	}

	if ( ModelBase$$1 ) Model.__proto__ = ModelBase$$1;
	Model.prototype = Object.create( ModelBase$$1 && ModelBase$$1.prototype );
	Model.prototype.constructor = Model;

	Model.prototype.adapt = function adapt () {
		var this$1 = this;

		var adaptors = this.root.adaptors;
		var len = adaptors.length;

		this.rewrap = false;

		// Exit early if no adaptors
		if ( len === 0 ) { return; }

		var value = this.wrapper ? ( 'newWrapperValue' in this ? this.newWrapperValue : this.wrapperValue ) : this.value;

		// TODO remove this legacy nonsense
		var ractive = this.root.ractive;
		var keypath = this.getKeypath();

		// tear previous adaptor down if present
		if ( this.wrapper ) {
			var shouldTeardown = this.wrapperValue === value ? false : !this.wrapper.reset || this.wrapper.reset( value ) === false;

			if ( shouldTeardown ) {
				this.wrapper.teardown();
				this.wrapper = null;

				// don't branch for undefined values
				if ( this.value !== undefined ) {
					var parentValue = this.parent.value || this.parent.createBranch( this.key );
					if ( parentValue[ this.key ] !== value ) { parentValue[ this.key ] = value; }
				}
			} else {
				delete this.newWrapperValue;
				this.wrapperValue = value;
				this.value = this.wrapper.get();
				return;
			}
		}

		var i;

		for ( i = 0; i < len; i += 1 ) {
			var adaptor = adaptors[i];
			if ( adaptor.filter( value, keypath, ractive ) ) {
				this$1.wrapper = adaptor.wrap( ractive, value, keypath, getPrefixer( keypath ) );
				this$1.wrapperValue = value;
				this$1.wrapper.__model = this$1; // massive temporary hack to enable array adaptor

				this$1.value = this$1.wrapper.get();

				break;
			}
		}
	};

	Model.prototype.animate = function animate ( from, to, options, interpolator ) {
		var this$1 = this;

		if ( this.ticker ) { this.ticker.stop(); }

		var fulfilPromise;
		var promise = new Promise( function (fulfil) { return fulfilPromise = fulfil; } );

		this.ticker = new Ticker({
			duration: options.duration,
			easing: options.easing,
			step: function (t) {
				var value = interpolator( t );
				this$1.applyValue( value );
				if ( options.step ) { options.step( t, value ); }
			},
			complete: function () {
				this$1.applyValue( to );
				if ( options.complete ) { options.complete( to ); }

				this$1.ticker = null;
				fulfilPromise();
			}
		});

		promise.stop = this.ticker.stop;
		return promise;
	};

	Model.prototype.applyValue = function applyValue ( value, notify ) {
		if ( notify === void 0 ) notify = true;

		if ( isEqual( value, this.value ) ) { return; }
		if ( this.boundValue ) { this.boundValue = null; }

		if ( this.parent.wrapper && this.parent.wrapper.set ) {
			this.parent.wrapper.set( this.key, value );
			this.parent.value = this.parent.wrapper.get();

			this.value = this.parent.value[ this.key ];
			if ( this.wrapper ) { this.newWrapperValue = this.value; }
			this.adapt();
		} else if ( this.wrapper ) {
			this.newWrapperValue = value;
			this.adapt();
		} else {
			var parentValue = this.parent.value || this.parent.createBranch( this.key );
			if ( isObjectLike( parentValue ) ) {
				parentValue[ this.key ] = value;
			} else {
				warnIfDebug( ("Attempted to set a property of a non-object '" + (this.getKeypath()) + "'") );
				return;
			}

			this.value = value;
			this.adapt();
		}

		// keep track of array stuff
		if ( Array.isArray( value ) ) {
			this.length = value.length;
			this.isArray = true;
		} else {
			this.isArray = false;
		}

		// notify dependants
		this.links.forEach( handleChange );
		this.children.forEach( mark );
		this.deps.forEach( handleChange );

		if ( notify ) { this.notifyUpstream(); }

		if ( this.parent.isArray ) {
			if ( this.key === 'length' ) { this.parent.length = value; }
			else { this.parent.joinKey( 'length' ).mark(); }
		}
	};

	Model.prototype.createBranch = function createBranch ( key ) {
		var branch = isNumeric( key ) ? [] : {};
		this.applyValue( branch, false );

		return branch;
	};

	Model.prototype.get = function get ( shouldCapture, opts ) {
		if ( this._link ) { return this._link.get( shouldCapture, opts ); }
		if ( shouldCapture ) { capture( this ); }
		// if capturing, this value needs to be unwrapped because it's for external use
		if ( opts && opts.virtual ) { return this.getVirtual( false ); }
		return maybeBind( this, ( ( opts && 'unwrap' in opts ) ? opts.unwrap !== false : shouldCapture ) && this.wrapper ? this.wrapperValue : this.value, !opts || opts.shouldBind !== false );
	};

	Model.prototype.getKeypathModel = function getKeypathModel () {
		if ( !this.keypathModel ) { this.keypathModel = new KeypathModel( this ); }
		return this.keypathModel;
	};

	Model.prototype.joinKey = function joinKey ( key, opts ) {
		if ( this._link ) {
			if ( opts && opts.lastLink !== false && ( key === undefined || key === '' ) ) { return this; }
			return this._link.joinKey( key );
		}

		if ( key === undefined || key === '' ) { return this; }


		if ( !this.childByKey.hasOwnProperty( key ) ) {
			var child = new Model( this, key );
			this.children.push( child );
			this.childByKey[ key ] = child;
		}

		if ( this.childByKey[ key ]._link && ( !opts || opts.lastLink !== false ) ) { return this.childByKey[ key ]._link; }
		return this.childByKey[ key ];
	};

	Model.prototype.mark = function mark$1 ( force ) {
		if ( this._link ) { return this._link.mark( force ); }

		var value = this.retrieve();

		if ( force || !isEqual( value, this.value ) ) {
			var old = this.value;
			this.value = value;
			if ( this.boundValue ) { this.boundValue = null; }

			// make sure the wrapper stays in sync
			if ( old !== value || this.rewrap ) {
				if ( this.wrapper ) { this.newWrapperValue = value; }
				this.adapt();
			}

			// keep track of array stuff
			if ( Array.isArray( value ) ) {
				this.length = value.length;
				this.isArray = true;
			} else {
				this.isArray = false;
			}

			this.children.forEach( force ? markForce : mark );
			this.links.forEach( marked );

			this.deps.forEach( handleChange );
		}
	};

	Model.prototype.merge = function merge ( array, comparator ) {
		var oldArray = this.value;
		var newArray = array;
		if ( oldArray === newArray ) { oldArray = recreateArray( this ); }
		if ( comparator ) {
			oldArray = oldArray.map( comparator );
			newArray = newArray.map( comparator );
		}

		var oldLength = oldArray.length;

		var usedIndices = {};
		var firstUnusedIndex = 0;

		var newIndices = oldArray.map( function (item) {
			var index;
			var start = firstUnusedIndex;

			do {
				index = newArray.indexOf( item, start );

				if ( index === -1 ) {
					return -1;
				}

				start = index + 1;
			} while ( ( usedIndices[ index ] === true ) && start < oldLength );

			// keep track of the first unused index, so we don't search
			// the whole of newArray for each item in oldArray unnecessarily
			if ( index === firstUnusedIndex ) {
				firstUnusedIndex += 1;
			}
			// allow next instance of next "equal" to be found item
			usedIndices[ index ] = true;
			return index;
		});

		this.parent.value[ this.key ] = array;
		this.shuffle( newIndices, true );
	};

	Model.prototype.retrieve = function retrieve () {
		return this.parent.value ? this.parent.value[ this.key ] : undefined;
	};

	Model.prototype.set = function set ( value ) {
		if ( this.ticker ) { this.ticker.stop(); }
		this.applyValue( value );
	};

	Model.prototype.shuffle = function shuffle$1 ( newIndices, unsafe ) {
		shuffle( this, newIndices, false, unsafe );
	};

	Model.prototype.source = function source () { return this; };

	Model.prototype.teardown = function teardown$1 () {
		if ( this._link ) { this._link.teardown(); }
		this.children.forEach( teardown );
		if ( this.wrapper ) { this.wrapper.teardown(); }
		if ( this.keypathModel ) { this.keypathModel.teardown(); }
	};

	return Model;
}(ModelBase));

function recreateArray( model ) {
	var array = [];

	for ( var i = 0; i < model.length; i++ ) {
		array[ i ] = (model.childByKey[i] || {}).value;
	}

	return array;
}

/* global global */
var data = {};

var SharedModel = (function (Model$$1) {
	function SharedModel ( value, name ) {
		Model$$1.call( this, null, ("@" + name) );
		this.key = "@" + name;
		this.value = value;
		this.isRoot = true;
		this.root = this;
		this.adaptors = [];
	}

	if ( Model$$1 ) SharedModel.__proto__ = Model$$1;
	SharedModel.prototype = Object.create( Model$$1 && Model$$1.prototype );
	SharedModel.prototype.constructor = SharedModel;

	SharedModel.prototype.getKeypath = function getKeypath () {
		return this.key;
	};

	return SharedModel;
}(Model));

var SharedModel$1 = new SharedModel( data, 'shared' );

var GlobalModel = new SharedModel( typeof global !== 'undefined' ? global : window, 'global' );

function resolveReference ( fragment, ref ) {
	var initialFragment = fragment;
	// current context ref
	if ( ref === '.' ) { return fragment.findContext(); }

	// ancestor references
	if ( ref[0] === '~' ) { return fragment.ractive.viewmodel.joinAll( splitKeypath( ref.slice( 2 ) ) ); }

	// scoped references
	if ( ref[0] === '.' || ref[0] === '^' ) {
		var frag = fragment;
		var parts = ref.split( '/' );
		var explicitContext = parts[0] === '^^';
		var context$1 = explicitContext ? null : fragment.findContext();

		// account for the first context hop
		if ( explicitContext ) { parts.unshift( '^^' ); }

		// walk up the context chain
		while ( parts[0] === '^^' ) {
			parts.shift();
			context$1 = null;
			while ( frag && !context$1 ) {
				context$1 = frag.context;
				frag = frag.parent.component ? frag.parent.component.parentFragment : frag.parent;
			}
		}

		if ( !context$1 && explicitContext ) {
			throw new Error( ("Invalid context parent reference ('" + ref + "'). There is not context at that level.") );
		}

		// walk up the context path
		while ( parts[0] === '.' || parts[0] === '..' ) {
			var part = parts.shift();

			if ( part === '..' ) {
				context$1 = context$1.parent;
			}
		}

		ref = parts.join( '/' );

		// special case - `{{.foo}}` means the same as `{{./foo}}`
		if ( ref[0] === '.' ) { ref = ref.slice( 1 ); }
		return context$1.joinAll( splitKeypath( ref ) );
	}

	var keys = splitKeypath( ref );
	if ( !keys.length ) { return; }
	var base = keys.shift();

	// special refs
	if ( base[0] === '@' ) {
		// shorthand from outside the template
		// @this referring to local ractive instance
		if ( base === '@this' || base === '@' ) {
			return fragment.ractive.viewmodel.getRactiveModel().joinAll( keys );
		}

		// @index or @key referring to the nearest repeating index or key
		else if ( base === '@index' || base === '@key' ) {
			if ( keys.length ) { badReference( base ); }
			var repeater = fragment.findRepeatingFragment();
			// make sure the found fragment is actually an iteration
			if ( !repeater.isIteration ) { return; }
			return repeater.context && repeater.context.getKeyModel( repeater[ ref[1] === 'i' ? 'index' : 'key' ] );
		}

		// @global referring to window or global
		else if ( base === '@global' ) {
			return GlobalModel.joinAll( keys );
		}

		// @global referring to window or global
		else if ( base === '@shared' ) {
			return SharedModel$1.joinAll( keys );
		}

		// @keypath or @rootpath, the current keypath string
		else if ( base === '@keypath' || base === '@rootpath' ) {
			var root = ref[1] === 'r' ? fragment.ractive.root : null;
			var context$2 = fragment.findContext();

			// skip over component roots, which provide no context
			while ( root && context$2.isRoot && context$2.ractive.component ) {
				context$2 = context$2.ractive.component.parentFragment.findContext();
			}

			return context$2.getKeypathModel( root );
		}

		else if ( base === '@context' ) {
			return new ContextModel( fragment.getContext() );
		}

		// @context-local data
		else if ( base === '@local' ) {
			return fragment.getContext()._data.joinAll( keys );
		}

		// nope
		else {
			throw new Error( ("Invalid special reference '" + base + "'") );
		}
	}

	var context = fragment.findContext();

	// check immediate context for a match
	if ( context.has( base ) ) {
		return context.joinKey( base ).joinAll( keys );
	}

	// walk up the fragment hierarchy looking for a matching ref, alias, or key in a context
	var createMapping = false;
	var shouldWarn = fragment.ractive.warnAboutAmbiguity;

	while ( fragment ) {
		// repeated fragments
		if ( fragment.isIteration ) {
			if ( base === fragment.parent.keyRef ) {
				if ( keys.length ) { badReference( base ); }
				return fragment.context.getKeyModel( fragment.key );
			}

			if ( base === fragment.parent.indexRef ) {
				if ( keys.length ) { badReference( base ); }
				return fragment.context.getKeyModel( fragment.index );
			}
		}

		// alias node or iteration
		if ( fragment.aliases  && fragment.aliases.hasOwnProperty( base ) ) {
			var model = fragment.aliases[ base ];

			if ( keys.length === 0 ) { return model; }
			else if ( typeof model.joinAll === 'function' ) {
				return model.joinAll( keys );
			}
		}

		// check fragment context to see if it has the key we need
		if ( fragment.context && fragment.context.has( base ) ) {
			// this is an implicit mapping
			if ( createMapping ) {
				if ( shouldWarn ) { warnIfDebug( ("'" + ref + "' resolved but is ambiguous and will create a mapping to a parent component.") ); }
				return context.root.createLink( base, fragment.context.joinKey( base ), base, { implicit: true }).joinAll( keys );
			}

			if ( shouldWarn ) { warnIfDebug( ("'" + ref + "' resolved but is ambiguous.") ); }
			return fragment.context.joinKey( base ).joinAll( keys );
		}

		if ( ( fragment.componentParent || ( !fragment.parent && fragment.ractive.component ) ) && !fragment.ractive.isolated ) {
			// ascend through component boundary
			fragment = fragment.componentParent || fragment.ractive.component.parentFragment;
			createMapping = true;
		} else {
			fragment = fragment.parent;
		}
	}

	// if enabled, check the instance for a match
	if ( initialFragment.ractive.resolveInstanceMembers ) {
		var model$1 = initialFragment.ractive.viewmodel.getRactiveModel();
		if ( model$1.has( base ) ) {
			return model$1.joinKey( base ).joinAll( keys );
		}
	}

	if ( shouldWarn ) {
		warnIfDebug( ("'" + ref + "' is ambiguous and did not resolve.") );
	}

	// didn't find anything, so go ahead and create the key on the local model
	return context.joinKey( base ).joinAll( keys );
}

function badReference ( key ) {
	throw new Error( ("An index or key reference (" + key + ") cannot have child properties") );
}

var ContextModel = function ContextModel ( context ) {
	this.context = context;
};

ContextModel.prototype.get = function get () { return this.context; };

var extern = {};

function getRactiveContext ( ractive ) {
	var assigns = [], len = arguments.length - 1;
	while ( len-- > 0 ) assigns[ len ] = arguments[ len + 1 ];

	var fragment = ractive.fragment || ractive._fakeFragment || ( ractive._fakeFragment = new FakeFragment( ractive ) );
	return fragment.getContext.apply( fragment, assigns );
}

function getContext () {
	var assigns = [], len = arguments.length;
	while ( len-- ) assigns[ len ] = arguments[ len ];

	if ( !this.ctx ) { this.ctx = new extern.Context( this ); }
	assigns.unshift( Object.create( this.ctx ) );
	return Object.assign.apply( null, assigns );
}

var FakeFragment = function FakeFragment ( ractive ) {
	this.ractive = ractive;
};

FakeFragment.prototype.findContext = function findContext () { return this.ractive.viewmodel; };
var proto$1 = FakeFragment.prototype;
proto$1.getContext = getContext;
proto$1.find = proto$1.findComponent = proto$1.findAll = proto$1.findAllComponents = noop;

var keep = false;

function set ( ractive, pairs, options ) {
	var k = keep;

	var deep = options && options.deep;
	var shuffle = options && options.shuffle;
	var promise = runloop.start( ractive, true );
	if ( options && 'keep' in options ) { keep = options.keep; }

	var i = pairs.length;
	while ( i-- ) {
		var model = pairs[i][0];
		var value = pairs[i][1];
		var keypath = pairs[i][2];

		if ( !model ) {
			runloop.end();
			throw new Error( ("Failed to set invalid keypath '" + keypath + "'") );
		}

		if ( deep ) { deepSet( model, value ); }
		else if ( shuffle ) {
			var array = value;
			var target = model.get();
			// shuffle target array with itself
			if ( !array ) { array = target; }

			if ( !Array.isArray( target ) || !Array.isArray( array ) ) {
				throw new Error( 'You cannot merge an array with a non-array' );
			}

			var comparator = getComparator( shuffle );
			model.merge( array, comparator );
		} else { model.set( value ); }
	}

	runloop.end();

	keep = k;

	return promise;
}

var star = /\*/;
function gather ( ractive, keypath, base, isolated ) {
	if ( !base && ( keypath[0] === '.' || keypath[1] === '^' ) ) {
		warnIfDebug( "Attempted to set a relative keypath from a non-relative context. You can use a context object to set relative keypaths." );
		return [];
	}

	var keys = splitKeypath( keypath );
	var model = base || ractive.viewmodel;

	if ( star.test( keypath ) ) {
		return model.findMatches( keys );
	} else {
		if ( model === ractive.viewmodel ) {
			// allow implicit mappings
			if ( ractive.component && !ractive.isolated && !model.has( keys[0] ) && keypath[0] !== '@' && keypath[0] && !isolated ) {
				return [ resolveReference( ractive.fragment || new FakeFragment( ractive ), keypath ) ];
			} else {
				return [ model.joinAll( keys ) ];
			}
		} else {
			return [ model.joinAll( keys ) ];
		}
	}
}

function build ( ractive, keypath, value, isolated ) {
	var sets = [];

	// set multiple keypaths in one go
	if ( isObject( keypath ) ) {
		var loop = function ( k ) {
			if ( keypath.hasOwnProperty( k ) ) {
				sets.push.apply( sets, gather( ractive, k, null, isolated ).map( function (m) { return [ m, keypath[k], k ]; } ) );
			}
		};

		for ( var k in keypath ) loop( k );

	}
	// set a single keypath
	else {
		sets.push.apply( sets, gather( ractive, keypath, null, isolated ).map( function (m) { return [ m, value, keypath ]; } ) );
	}

	return sets;
}

var deepOpts = { virtual: false };
function deepSet( model, value ) {
	var dest = model.get( false, deepOpts );

	// if dest doesn't exist, just set it
	if ( dest == null || typeof value !== 'object' ) { return model.set( value ); }
	if ( typeof dest !== 'object' ) { return model.set( value ); }

	for ( var k in value ) {
		if ( value.hasOwnProperty( k ) ) {
			deepSet( model.joinKey( k ), value[k] );
		}
	}
}

var comparators = {};
function getComparator ( option ) {
	if ( option === true ) { return null; } // use existing arrays
	if ( typeof option === 'function' ) { return option; }

	if ( typeof option === 'string' ) {
		return comparators[ option ] || ( comparators[ option ] = function (thing) { return thing[ option ]; } );
	}

	throw new Error( 'If supplied, options.compare must be a string, function, or true' ); // TODO link to docs
}

var errorMessage = 'Cannot add to a non-numeric value';

function add ( ractive, keypath, d, options ) {
	if ( typeof keypath !== 'string' || !isNumeric( d ) ) {
		throw new Error( 'Bad arguments' );
	}

	var sets = build( ractive, keypath, d, options && options.isolated );

	return set( ractive, sets.map( function (pair) {
		var model = pair[0];
		var add = pair[1];
		var value = model.get();
		if ( !isNumeric( add ) || !isNumeric( value ) ) { throw new Error( errorMessage ); }
		return [ model, value + add ];
	}));
}

function Ractive$add ( keypath, d, options ) {
	var num = typeof d === 'number' ? d : 1;
	var opts = typeof d === 'object' ? d : options;
	return add( this, keypath, num, opts );
}

var noAnimation = Promise.resolve();
Object.defineProperty( noAnimation, 'stop', { value: noop });

var linear = easing.linear;

function getOptions ( options, instance ) {
	options = options || {};

	var easing$$1;
	if ( options.easing ) {
		easing$$1 = typeof options.easing === 'function' ?
			options.easing :
			instance.easing[ options.easing ];
	}

	return {
		easing: easing$$1 || linear,
		duration: 'duration' in options ? options.duration : 400,
		complete: options.complete || noop,
		step: options.step || noop
	};
}

function animate ( ractive, model, to, options ) {
	options = getOptions( options, ractive );
	var from = model.get();

	// don't bother animating values that stay the same
	if ( isEqual( from, to ) ) {
		options.complete( options.to );
		return noAnimation; // TODO should this have .then and .catch methods?
	}

	var interpolator = interpolate( from, to, ractive, options.interpolator );

	// if we can't interpolate the value, set it immediately
	if ( !interpolator ) {
		runloop.start();
		model.set( to );
		runloop.end();

		return noAnimation;
	}

	return model.animate( from, to, options, interpolator );
}

function Ractive$animate ( keypath, to, options ) {
	if ( typeof keypath === 'object' ) {
		var keys = Object.keys( keypath );

		throw new Error( ("ractive.animate(...) no longer supports objects. Instead of ractive.animate({\n  " + (keys.map( function (key) { return ("'" + key + "': " + (keypath[ key ])); } ).join( '\n  ' )) + "\n}, {...}), do\n\n" + (keys.map( function (key) { return ("ractive.animate('" + key + "', " + (keypath[ key ]) + ", {...});"); } ).join( '\n' )) + "\n") );
	}


	return animate( this, this.viewmodel.joinAll( splitKeypath( keypath ) ), to, options );
}

function enqueue ( ractive, event ) {
	if ( ractive.event ) {
		ractive._eventQueue.push( ractive.event );
	}

	ractive.event = event;
}

function dequeue ( ractive ) {
	if ( ractive._eventQueue.length ) {
		ractive.event = ractive._eventQueue.pop();
	} else {
		ractive.event = null;
	}
}

var initStars = {};
var bubbleStars = {};

// cartesian product of name parts and stars
// adjusted appropriately for special cases
function variants ( name, initial ) {
	var map = initial ? initStars : bubbleStars;
	if ( map[ name ] ) { return map[ name ]; }

	var parts = name.split( '.' );
	var result = [];
	var base = false;

	// initial events the implicit namespace of 'this'
	if ( initial ) {
		parts.unshift( 'this' );
		base = true;
	}

	// use max - 1 bits as a bitmap to pick a part or a *
	// need to skip the full star case if the namespace is synthetic
	var max = Math.pow( 2, parts.length ) - ( initial ? 1 : 0 );
	for ( var i = 0; i < max; i++ ) {
		var join = [];
		for ( var j = 0; j < parts.length; j++ ) {
			join.push( 1 & ( i >> j ) ? '*' : parts[j] );
		}
		result.unshift( join.join( '.' ) );
	}

	if ( base ) {
		// include non-this-namespaced versions
		if ( parts.length > 2 ) {
			result.push.apply( result, variants( name, false ) );
		} else {
			result.push( '*' );
			result.push( name );
		}
	}

	map[ name ] = result;
	return result;
}

function fireEvent ( ractive, eventName, context, args ) {
	if ( args === void 0 ) args = [];

	if ( !eventName ) { return; }

	context.name = eventName;
	args.unshift( context );

	var eventNames = ractive._nsSubs ? variants( eventName, true ) : [ '*', eventName ];

	return fireEventAs( ractive, eventNames, context, args, true );
}

function fireEventAs  ( ractive, eventNames, context, args, initialFire ) {
	if ( initialFire === void 0 ) initialFire = false;

	var bubble = true;

	if ( initialFire || ractive._nsSubs ) {
		enqueue( ractive, context );

		var i = eventNames.length;
		while ( i-- ) {
			if ( eventNames[ i ] in ractive._subs ) {
				bubble = notifySubscribers( ractive, ractive._subs[ eventNames[ i ] ], context, args ) && bubble;
			}
		}

		dequeue( ractive );
	}

	if ( ractive.parent && bubble ) {
		if ( initialFire && ractive.component ) {
			var fullName = ractive.component.name + '.' + eventNames[ eventNames.length - 1 ];
			eventNames = variants( fullName, false );

			if ( context && !context.component ) {
				context.component = ractive;
			}
		}

		bubble = fireEventAs( ractive.parent, eventNames, context, args );
	}

	return bubble;
}

function notifySubscribers ( ractive, subscribers, context, args ) {
	var originalEvent = null;
	var stopEvent = false;

	// subscribers can be modified inflight, e.g. "once" functionality
	// so we need to copy to make sure everyone gets called
	subscribers = subscribers.slice();

	for ( var i = 0, len = subscribers.length; i < len; i += 1 ) {
		if ( !subscribers[ i ].off && subscribers[ i ].handler.apply( ractive, args ) === false ) {
			stopEvent = true;
		}
	}

	if ( context && stopEvent && ( originalEvent = context.event ) ) {
		originalEvent.preventDefault && originalEvent.preventDefault();
		originalEvent.stopPropagation && originalEvent.stopPropagation();
	}

	return !stopEvent;
}

var Hook = function Hook ( event ) {
	this.event = event;
	this.method = 'on' + event;
};

Hook.prototype.fire = function fire ( ractive, arg ) {
	var context = getRactiveContext( ractive );

	if ( ractive[ this.method ] ) {
		arg ? ractive[ this.method ]( context, arg ) : ractive[ this.method ]( context );
	}

	fireEvent( ractive, this.event, context, arg ? [ arg, ractive ] : [ ractive ] );
};

function findAnchors ( fragment, name ) {
	if ( name === void 0 ) name = null;

	var res = [];

	findAnchorsIn( fragment, name, res );

	return res;
}

function findAnchorsIn ( item, name, result ) {
	if ( item.isAnchor ) {
		if ( !name || item.name === name ) {
			result.push( item );
		}
	} else if ( item.items ) {
		item.items.forEach( function (i) { return findAnchorsIn( i, name, result ); } );
	} else if ( item.iterations ) {
		item.iterations.forEach( function (i) { return findAnchorsIn( i, name, result ); } );
	} else if ( item.fragment && !item.component ) {
		findAnchorsIn( item.fragment, name, result );
	}
}

function updateAnchors ( instance, name ) {
	if ( name === void 0 ) name = null;

	var anchors = findAnchors( instance.fragment, name );
	var idxs = {};
	var children = instance._children.byName;

	anchors.forEach( function (a) {
		var name = a.name;
		if ( !( name in idxs ) ) { idxs[name] = 0; }
		var idx = idxs[name];
		var child = ( children[name] || [] )[idx];

		if ( child && child.lastBound !== a ) {
			if ( child.lastBound ) { child.lastBound.removeChild( child ); }
			a.addChild( child );
		}

		idxs[name]++;
	});
}

function unrenderChild ( meta ) {
	if ( meta.instance.fragment.rendered ) {
		meta.shouldDestroy = true;
		meta.instance.unrender();
	}
	meta.instance.el = null;
}

var attachHook = new Hook( 'attachchild' );

function attachChild ( child, options ) {
	if ( options === void 0 ) options = {};

	var children = this._children;

	if ( child.parent && child.parent !== this ) { throw new Error( ("Instance " + (child._guid) + " is already attached to a different instance " + (child.parent._guid) + ". Please detach it from the other instance using detachChild first.") ); }
	else if ( child.parent ) { throw new Error( ("Instance " + (child._guid) + " is already attached to this instance.") ); }

	var meta = {
		instance: child,
		ractive: this,
		name: options.name || child.constructor.name || 'Ractive',
		target: options.target || false,
		bubble: bubble,
		findNextNode: findNextNode
	};
	meta.nameOption = options.name;

	// child is managing itself
	if ( !meta.target ) {
		meta.parentFragment = this.fragment;
		meta.external = true;
	} else {
		var list;
		if ( !( list = children.byName[ meta.target ] ) ) {
			list = [];
			this.set( ("@this.children.byName." + (meta.target)), list );
		}
		var idx = options.prepend ? 0 : options.insertAt !== undefined ? options.insertAt : list.length;
		list.splice( idx, 0, meta );
	}

	child.set({
		'@this.parent': this,
		'@this.root': this.root
	});
	child.component = meta;
	children.push( meta );

	attachHook.fire( child );

	var promise = runloop.start( child, true );

	if ( meta.target ) {
		unrenderChild( meta );
		this.set( ("@this.children.byName." + (meta.target)), null, { shuffle: true } );
		updateAnchors( this, meta.target );
	} else {
		if ( !child.isolated ) { child.viewmodel.attached( this.fragment ); }
	}

	runloop.end();

	promise.ractive = child;
	return promise.then( function () { return child; } );
}

function bubble () { runloop.addFragment( this.instance.fragment ); }

function findNextNode () {
	if ( this.anchor ) { return this.anchor.findNextNode(); }
}

var detachHook = new Hook( 'detach' );

function Ractive$detach () {
	if ( this.isDetached ) {
		return this.el;
	}

	if ( this.el ) {
		removeFromArray( this.el.__ractive_instances__, this );
	}

	this.el = this.fragment.detach();
	this.isDetached = true;

	detachHook.fire( this );
	return this.el;
}

var detachHook$1 = new Hook( 'detachchild' );

function detachChild ( child ) {
	var children = this._children;
	var meta, index;

	var i = children.length;
	while ( i-- ) {
		if ( children[i].instance === child ) {
			index = i;
			meta = children[i];
			break;
		}
	}

	if ( !meta || child.parent !== this ) { throw new Error( ("Instance " + (child._guid) + " is not attached to this instance.") ); }

	var promise = runloop.start( child, true );

	if ( meta.anchor ) { meta.anchor.removeChild( meta ); }
	if ( !child.isolated ) { child.viewmodel.detached(); }

	runloop.end();

	children.splice( index, 1 );
	if ( meta.target ) {
		var list = children.byName[ meta.target ];
		list.splice( list.indexOf( meta ), 1 );
		this.set( ("@this.children.byName." + (meta.target)), null, { shuffle: true } );
		updateAnchors( this, meta.target );
	}
	child.set({
		'@this.parent': undefined,
		'@this.root': child
	});
	child.component = null;

	detachHook$1.fire( child );

	promise.ractive = child;
	return promise.then( function () { return child; } );
}

function Ractive$find ( selector, options ) {
	var this$1 = this;
	if ( options === void 0 ) options = {};

	if ( !this.el ) { throw new Error( ("Cannot call ractive.find('" + selector + "') unless instance is rendered to the DOM") ); }

	var node = this.fragment.find( selector, options );
	if ( node ) { return node; }

	if ( options.remote ) {
		for ( var i = 0; i < this._children.length; i++ ) {
			if ( !this$1._children[i].instance.fragment.rendered ) { continue; }
			node = this$1._children[i].instance.find( selector, options );
			if ( node ) { return node; }
		}
	}
}

function Ractive$findAll ( selector, options ) {
	if ( options === void 0 ) options = {};

	if ( !this.el ) { throw new Error( ("Cannot call ractive.findAll('" + selector + "', ...) unless instance is rendered to the DOM") ); }

	if ( !Array.isArray( options.result ) ) { options.result = []; }

	this.fragment.findAll( selector, options );

	if ( options.remote ) {
		// seach non-fragment children
		this._children.forEach( function (c) {
			if ( !c.target && c.instance.fragment && c.instance.fragment.rendered ) {
				c.instance.findAll( selector, options );
			}
		});
	}

	return options.result;
}

function Ractive$findAllComponents ( selector, options ) {
	if ( !options && typeof selector === 'object' ) {
		options = selector;
		selector = '';
	}

	options = options || {};

	if ( !Array.isArray( options.result ) ) { options.result = []; }

	this.fragment.findAllComponents( selector, options );

	if ( options.remote ) {
		// search non-fragment children
		this._children.forEach( function (c) {
			if ( !c.target && c.instance.fragment && c.instance.fragment.rendered ) {
				if ( !selector || c.name === selector ) {
					options.result.push( c.instance );
				}

				c.instance.findAllComponents( selector, options );
			}
		});
	}

	return options.result;
}

function Ractive$findComponent ( selector, options ) {
	var this$1 = this;
	if ( options === void 0 ) options = {};

	if ( typeof selector === 'object' ) {
		options = selector;
		selector = '';
	}

	var child = this.fragment.findComponent( selector, options );
	if ( child ) { return child; }

	if ( options.remote ) {
		if ( !selector && this._children.length ) { return this._children[0].instance; }
		for ( var i = 0; i < this._children.length; i++ ) {
			// skip children that are or should be in an anchor
			if ( this$1._children[i].target ) { continue; }
			if ( this$1._children[i].name === selector ) { return this$1._children[i].instance; }
			child = this$1._children[i].instance.findComponent( selector, options );
			if ( child ) { return child; }
		}
	}
}

function Ractive$findContainer ( selector ) {
	if ( this.container ) {
		if ( this.container.component && this.container.component.name === selector ) {
			return this.container;
		} else {
			return this.container.findContainer( selector );
		}
	}

	return null;
}

function Ractive$findParent ( selector ) {

	if ( this.parent ) {
		if ( this.parent.component && this.parent.component.name === selector ) {
			return this.parent;
		} else {
			return this.parent.findParent ( selector );
		}
	}

	return null;
}

// This function takes an array, the name of a mutator method, and the
// arguments to call that mutator method with, and returns an array that
// maps the old indices to their new indices.

// So if you had something like this...
//
//     array = [ 'a', 'b', 'c', 'd' ];
//     array.push( 'e' );
//
// ...you'd get `[ 0, 1, 2, 3 ]` - in other words, none of the old indices
// have changed. If you then did this...
//
//     array.unshift( 'z' );
//
// ...the indices would be `[ 1, 2, 3, 4, 5 ]` - every item has been moved
// one higher to make room for the 'z'. If you removed an item, the new index
// would be -1...
//
//     array.splice( 2, 2 );
//
// ...this would result in [ 0, 1, -1, -1, 2, 3 ].
//
// This information is used to enable fast, non-destructive shuffling of list
// sections when you do e.g. `ractive.splice( 'items', 2, 2 );

function getNewIndices ( length, methodName, args ) {
	var newIndices = [];

	var spliceArguments = getSpliceEquivalent( length, methodName, args );

	if ( !spliceArguments ) {
		return null; // TODO support reverse and sort?
	}

	var balance = ( spliceArguments.length - 2 ) - spliceArguments[1];

	var removeStart = Math.min( length, spliceArguments[0] );
	var removeEnd = removeStart + spliceArguments[1];
	newIndices.startIndex = removeStart;

	var i;
	for ( i = 0; i < removeStart; i += 1 ) {
		newIndices.push( i );
	}

	for ( ; i < removeEnd; i += 1 ) {
		newIndices.push( -1 );
	}

	for ( ; i < length; i += 1 ) {
		newIndices.push( i + balance );
	}

	// there is a net shift for the rest of the array starting with index + balance
	if ( balance !== 0 ) {
		newIndices.touchedFrom = spliceArguments[0];
	} else {
		newIndices.touchedFrom = length;
	}

	return newIndices;
}


// The pop, push, shift an unshift methods can all be represented
// as an equivalent splice
function getSpliceEquivalent ( length, methodName, args ) {
	switch ( methodName ) {
		case 'splice':
			if ( args[0] !== undefined && args[0] < 0 ) {
				args[0] = length + Math.max( args[0], -length );
			}

			if ( args[0] === undefined ) { args[0] = 0; }

			while ( args.length < 2 ) {
				args.push( length - args[0] );
			}

			if ( typeof args[1] !== 'number' ) {
				args[1] = length - args[0];
			}

			// ensure we only remove elements that exist
			args[1] = Math.min( args[1], length - args[0] );

			return args;

		case 'sort':
		case 'reverse':
			return null;

		case 'pop':
			if ( length ) {
				return [ length - 1, 1 ];
			}
			return [ 0, 0 ];

		case 'push':
			return [ length, 0 ].concat( args );

		case 'shift':
			return [ 0, length ? 1 : 0 ];

		case 'unshift':
			return [ 0, 0 ].concat( args );
	}
}

var arrayProto = Array.prototype;

var makeArrayMethod = function ( methodName ) {
	function path ( keypath ) {
		var args = [], len = arguments.length - 1;
		while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

		return model( this.viewmodel.joinAll( splitKeypath( keypath ) ), args );
	}

	function model ( mdl, args ) {
		var array = mdl.get();

		if ( !Array.isArray( array ) ) {
			if ( array === undefined ) {
				array = [];
				var result$1 = arrayProto[ methodName ].apply( array, args );
				var promise$1 = runloop.start( this, true ).then( function () { return result$1; } );
				mdl.set( array );
				runloop.end();
				return promise$1;
			} else {
				throw new Error( ("shuffle array method " + methodName + " called on non-array at " + (mdl.getKeypath())) );
			}
		}

		var newIndices = getNewIndices( array.length, methodName, args );
		var result = arrayProto[ methodName ].apply( array, args );

		var promise = runloop.start( this, true ).then( function () { return result; } );
		promise.result = result;

		if ( newIndices ) {
			mdl.shuffle( newIndices );
		} else {
			mdl.set( result );
		}

		runloop.end();

		return promise;
	}

	return { path: path, model: model };
};

var updateHook = new Hook( 'update' );

function update$1 ( ractive, model, options ) {
	// if the parent is wrapped, the adaptor will need to be updated before
	// updating on this keypath
	if ( model.parent && model.parent.wrapper ) {
		model.parent.adapt();
	}

	var promise = runloop.start( ractive, true );

	model.mark( options && options.force );

	// notify upstream of changes
	model.notifyUpstream();

	runloop.end();

	updateHook.fire( ractive, model );

	return promise;
}

function Ractive$update ( keypath, options ) {
	var opts, path;

	if ( typeof keypath === 'string' ) {
		path = splitKeypath( keypath );
		opts = options;
	} else {
		opts = keypath;
	}

	return update$1( this, path ? this.viewmodel.joinAll( path ) : this.viewmodel, opts );
}

var TEXT              = 1;
var INTERPOLATOR      = 2;
var TRIPLE            = 3;
var SECTION           = 4;
var INVERTED          = 5;
var CLOSING           = 6;
var ELEMENT           = 7;
var PARTIAL           = 8;
var COMMENT           = 9;
var DELIMCHANGE       = 10;
var ANCHOR            = 11;
var ATTRIBUTE         = 13;
var CLOSING_TAG       = 14;
var COMPONENT         = 15;
var YIELDER           = 16;
var INLINE_PARTIAL    = 17;
var DOCTYPE           = 18;
var ALIAS             = 19;

var NUMBER_LITERAL    = 20;
var STRING_LITERAL    = 21;
var ARRAY_LITERAL     = 22;
var OBJECT_LITERAL    = 23;
var BOOLEAN_LITERAL   = 24;
var REGEXP_LITERAL    = 25;

var GLOBAL            = 26;
var KEY_VALUE_PAIR    = 27;


var REFERENCE         = 30;
var REFINEMENT        = 31;
var MEMBER            = 32;
var PREFIX_OPERATOR   = 33;
var BRACKETED         = 34;
var CONDITIONAL       = 35;
var INFIX_OPERATOR    = 36;

var INVOCATION        = 40;

var SECTION_IF        = 50;
var SECTION_UNLESS    = 51;
var SECTION_EACH      = 52;
var SECTION_WITH      = 53;
var SECTION_IF_WITH   = 54;

var ELSE              = 60;
var ELSEIF            = 61;

var EVENT             = 70;
var DECORATOR         = 71;
var TRANSITION        = 72;
var BINDING_FLAG      = 73;
var DELEGATE_FLAG     = 74;

function findElement( start, orComponent, name ) {
	if ( orComponent === void 0 ) orComponent = true;

	while ( start && ( start.type !== ELEMENT || ( name && start.name !== name ) ) && ( !orComponent || ( start.type !== COMPONENT && start.type !== ANCHOR ) ) ) {
		// start is a fragment - look at the owner
		if ( start.owner ) { start = start.owner; }
		// start is a component or yielder - look at the container
		else if ( start.component ) { start = start.containerFragment || start.component.parentFragment; }
		// start is an item - look at the parent
		else if ( start.parent ) { start = start.parent; }
		// start is an item without a parent - look at the parent fragment
		else if ( start.parentFragment ) { start = start.parentFragment; }

		else { start = undefined; }
	}

	return start;
}

var modelPush = makeArrayMethod( 'push' ).model;
var modelPop = makeArrayMethod( 'pop' ).model;
var modelShift = makeArrayMethod( 'shift' ).model;
var modelUnshift = makeArrayMethod( 'unshift' ).model;
var modelSort = makeArrayMethod( 'sort' ).model;
var modelSplice = makeArrayMethod( 'splice' ).model;
var modelReverse = makeArrayMethod( 'reverse' ).model;

var ContextData = (function (Model$$1) {
	function ContextData ( options ) {
		Model$$1.call( this, null, null );

		this.isRoot = true;
		this.root = this;
		this.value = {};
		this.ractive = options.ractive;
		this.adaptors = [];
		this.context = options.context;
	}

	if ( Model$$1 ) ContextData.__proto__ = Model$$1;
	ContextData.prototype = Object.create( Model$$1 && Model$$1.prototype );
	ContextData.prototype.constructor = ContextData;

	ContextData.prototype.getKeypath = function getKeypath () {
		return '@context.data';
	};

	return ContextData;
}(Model));

var Context = function Context ( fragment, element ) {
	this.fragment = fragment;
	this.element = element || findElement( fragment );
	this.node = this.element && this.element.node;
	this.ractive = fragment.ractive;
	this.root = this;
};

var prototypeAccessors = { decorators: {},_data: {} };

prototypeAccessors.decorators.get = function () {
	var items = {};
	if ( !this.element ) { return items; }
	this.element.decorators.forEach( function (d) { return items[ d.name ] = d.intermediary; } );
	return items;
};

prototypeAccessors._data.get = function () {
	return this.model || ( this.root.model = new ContextData({ ractive: this.ractive, context: this.root }) );
};

// the usual mutation suspects
Context.prototype.add = function add ( keypath, d, options ) {
	var num = typeof d === 'number' ? +d : 1;
	var opts = typeof d === 'object' ? d : options;
	return set( this.ractive, build$1( this, keypath, num ).map( function (pair) {
		var model = pair[0];
			var val = pair[1];
		var value = model.get();
		if ( !isNumeric( val ) || !isNumeric( value ) ) { throw new Error( 'Cannot add non-numeric value' ); }
		return [ model, value + val ];
	}), opts );
};

Context.prototype.animate = function animate$$1 ( keypath, value, options ) {
	var model = findModel( this, keypath ).model;
	return animate( this.ractive, model, value, options );
};

// get relative keypaths and values
Context.prototype.get = function get ( keypath ) {
	if ( !keypath ) { return this.fragment.findContext().get( true ); }

	var ref = findModel( this, keypath );
		var model = ref.model;

	return model ? model.get( true ) : undefined;
};

Context.prototype.link = function link ( source, dest ) {
	var there = findModel( this, source ).model;
	var here = findModel( this, dest ).model;
	var promise = runloop.start( this.ractive, true );
	here.link( there, source );
	runloop.end();
	return promise;
};

Context.prototype.listen = function listen ( event, handler ) {
	var el = this.element;
	el.on( event, handler );
	return {
		cancel: function cancel () { el.off( event, handler ); }
	};
};

Context.prototype.observe = function observe ( keypath, callback, options ) {
		if ( options === void 0 ) options = {};

	if ( isObject( keypath ) ) { options = callback || {}; }
	options.fragment = this.fragment;
	return this.ractive.observe( keypath, callback, options );
};

Context.prototype.observeOnce = function observeOnce ( keypath, callback, options ) {
		if ( options === void 0 ) options = {};

	if ( isObject( keypath ) ) { options = callback || {}; }
	options.fragment = this.fragment;
	return this.ractive.observeOnce( keypath, callback, options );
};

Context.prototype.pop = function pop ( keypath ) {
	return modelPop( findModel( this, keypath ).model, [] );
};

Context.prototype.push = function push ( keypath ) {
		var values = [], len = arguments.length - 1;
		while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];

	return modelPush( findModel( this, keypath ).model, values );
};

Context.prototype.raise = function raise ( name, event ) {
		var args = [], len = arguments.length - 2;
		while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

	var element = this.element;

	while ( element ) {
		var events = element.events;
		for ( var i = 0; i < events.length; i++ ) {
			var ev = events[i];
			if ( ~ev.template.n.indexOf( name ) ) {
				var ctx = !event || !( 'original' in event ) ?
					ev.element.getContext( event || {}, { original: {} } ) :
					ev.element.getContext( event || {} );
				return ev.fire( ctx, args );
			}
		}

		element = element.parent;
	}
};

Context.prototype.readLink = function readLink ( keypath, options ) {
	return this.ractive.readLink( this.resolve( keypath ), options );
};

Context.prototype.resolve = function resolve ( path, ractive ) {
	var ref = findModel( this, path );
		var model = ref.model;
		var instance = ref.instance;
	return model ? model.getKeypath( ractive || instance ) : path;
};

Context.prototype.reverse = function reverse ( keypath ) {
	return modelReverse( findModel( this, keypath ).model, [] );
};

Context.prototype.set = function set$$1 ( keypath, value, options ) {
	return set( this.ractive, build$1( this, keypath, value ), options );
};

Context.prototype.shift = function shift ( keypath ) {
	return modelShift( findModel( this, keypath ).model, [] );
};

Context.prototype.splice = function splice ( keypath, index, drop ) {
		var add = [], len = arguments.length - 3;
		while ( len-- > 0 ) add[ len ] = arguments[ len + 3 ];

	add.unshift( index, drop );
	return modelSplice( findModel( this, keypath ).model, add );
};

Context.prototype.sort = function sort ( keypath ) {
	return modelSort( findModel( this, keypath ).model, [] );
};

Context.prototype.subtract = function subtract ( keypath, d, options ) {
	var num = typeof d === 'number' ? d : 1;
	var opts = typeof d === 'object' ? d : options;
	return set( this.ractive, build$1( this, keypath, num ).map( function (pair) {
		var model = pair[0];
			var val = pair[1];
		var value = model.get();
		if ( !isNumeric( val ) || !isNumeric( value ) ) { throw new Error( 'Cannot add non-numeric value' ); }
		return [ model, value - val ];
	}), opts );
};

Context.prototype.toggle = function toggle ( keypath, options ) {
	var ref = findModel( this, keypath );
		var model = ref.model;
	return set( this.ractive, [ [ model, !model.get() ] ], options );
};

Context.prototype.unlink = function unlink ( dest ) {
	var here = findModel( this, dest ).model;
	var promise = runloop.start( this.ractive, true );
	if ( here.owner && here.owner._link ) { here.owner.unlink(); }
	runloop.end();
	return promise;
};

Context.prototype.unlisten = function unlisten ( event, handler ) {
	this.element.off( event, handler );
};

Context.prototype.unshift = function unshift ( keypath ) {
		var add = [], len = arguments.length - 1;
		while ( len-- > 0 ) add[ len ] = arguments[ len + 1 ];

	return modelUnshift( findModel( this, keypath ).model, add );
};

Context.prototype.update = function update$$1 ( keypath, options ) {
	return update$1( this.ractive, findModel( this, keypath ).model, options );
};

Context.prototype.updateModel = function updateModel ( keypath, cascade ) {
	var ref = findModel( this, keypath );
		var model = ref.model;
	var promise = runloop.start( this.ractive, true );
	model.updateFromBindings( cascade );
	runloop.end();
	return promise;
};

// two-way binding related helpers
Context.prototype.isBound = function isBound () {
	var ref = this.getBindingModel( this );
		var model = ref.model;
	return !!model;
};

Context.prototype.getBindingPath = function getBindingPath ( ractive ) {
	var ref = this.getBindingModel( this );
		var model = ref.model;
		var instance = ref.instance;
	if ( model ) { return model.getKeypath( ractive || instance ); }
};

Context.prototype.getBinding = function getBinding () {
	var ref = this.getBindingModel( this );
		var model = ref.model;
	if ( model ) { return model.get( true ); }
};

Context.prototype.getBindingModel = function getBindingModel ( ctx ) {
	var el = ctx.element;
	return { model: el.binding && el.binding.model, instance: el.parentFragment.ractive };
};

Context.prototype.setBinding = function setBinding ( value ) {
	var ref = this.getBindingModel( this );
		var model = ref.model;
	return set( this.ractive, [ [ model, value ] ] );
};

Object.defineProperties( Context.prototype, prototypeAccessors );

Context.forRactive = getRactiveContext;
// circular deps are fun
extern.Context = Context;

// TODO: at some point perhaps this could support relative * keypaths?
function build$1 ( ctx, keypath, value ) {
	var sets = [];

	// set multiple keypaths in one go
	if ( isObject( keypath ) ) {
		for ( var k in keypath ) {
			if ( keypath.hasOwnProperty( k ) ) {
				sets.push( [ findModel( ctx, k ).model, keypath[k] ] );
			}
		}

	}
	// set a single keypath
	else {
		sets.push( [ findModel( ctx, keypath ).model, value ] );
	}

	return sets;
}

function findModel ( ctx, path ) {
	var frag = ctx.fragment;

	if ( typeof path !== 'string' ) {
		return { model: frag.findContext(), instance: path };
	}

	return { model: resolveReference( frag, path ), instance: frag.ractive };
}

function Ractive$fire ( eventName ) {
	var args = [], len = arguments.length - 1;
	while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

	// watch for reproxy
	if ( args[0] instanceof Context ) {
		var proto = args.shift();
		var ctx = Object.create( proto );
		Object.assign( ctx, proto );
		return fireEvent( this, eventName, ctx, args );
	} else {
		return fireEvent( this, eventName, Context.forRactive( this ), args );
	}
}

function Ractive$get ( keypath, opts ) {
	if ( typeof keypath !== 'string' ) { return this.viewmodel.get( true, keypath ); }

	var keys = splitKeypath( keypath );
	var key = keys[0];

	var model;

	if ( !this.viewmodel.has( key ) ) {
		// if this is an inline component, we may need to create
		// an implicit mapping
		if ( this.component && !this.isolated ) {
			model = resolveReference( this.fragment || new FakeFragment( this ), key );
		}
	}

	model = this.viewmodel.joinAll( keys );
	return model.get( true, opts );
}

var query = doc && doc.querySelector;

function getContext$2 ( node ) {
	if ( typeof node === 'string' && query ) {
		node = query.call( document, node );
	}

	var instances;
	if ( node ) {
		if ( node._ractive ) {
			return node._ractive.proxy.getContext();
		} else if ( ( instances = node.__ractive_instances__ ) && instances.length === 1 ) {
			return getRactiveContext( instances[0] );
		}
	}
}

function getNodeInfo$1 ( node ) {
	warnOnceIfDebug( "getNodeInfo has been renamed to getContext, and the getNodeInfo alias will be removed in a future release." );
	return getContext$2 ( node );
}

function getContext$1 ( node, options ) {
	if ( typeof node === 'string' ) {
		node = this.find( node, options );
	}

	return getContext$2( node );
}

function getNodeInfo$$1 ( node, options ) {
	if ( typeof node === 'string' ) {
		node = this.find( node, options );
	}

	return getNodeInfo$1( node );
}

var html   = 'http://www.w3.org/1999/xhtml';
var mathml = 'http://www.w3.org/1998/Math/MathML';
var svg$1    = 'http://www.w3.org/2000/svg';
var xlink  = 'http://www.w3.org/1999/xlink';
var xml    = 'http://www.w3.org/XML/1998/namespace';
var xmlns  = 'http://www.w3.org/2000/xmlns';

var namespaces = { html: html, mathml: mathml, svg: svg$1, xlink: xlink, xml: xml, xmlns: xmlns };

var createElement;
var matches;
var div;
var methodNames;
var unprefixed;
var prefixed;
var i;
var j;
var makeFunction;

// Test for SVG support
if ( !svg ) {
	createElement = function ( type, ns, extend ) {
		if ( ns && ns !== html ) {
			throw 'This browser does not support namespaces other than http://www.w3.org/1999/xhtml. The most likely cause of this error is that you\'re trying to render SVG in an older browser. See http://docs.ractivejs.org/latest/svg-and-older-browsers for more information';
		}

		return extend ?
			doc.createElement( type, extend ) :
			doc.createElement( type );
	};
} else {
	createElement = function ( type, ns, extend ) {
		if ( !ns || ns === html ) {
			return extend ?
				doc.createElement( type, extend ) :
				doc.createElement( type );
		}

		return extend ?
			doc.createElementNS( ns, type, extend ) :
			doc.createElementNS( ns, type );
	};
}

function createDocumentFragment () {
	return doc.createDocumentFragment();
}

function getElement ( input ) {
	var output;

	if ( !input || typeof input === 'boolean' ) { return; }

	if ( !win || !doc || !input ) {
		return null;
	}

	// We already have a DOM node - no work to do. (Duck typing alert!)
	if ( input.nodeType ) {
		return input;
	}

	// Get node from string
	if ( typeof input === 'string' ) {
		// try ID first
		output = doc.getElementById( input );

		// then as selector, if possible
		if ( !output && doc.querySelector ) {
			try {
				output = doc.querySelector( input );
			} catch (e) { /* this space intentionally left blank */ }
		}

		// did it work?
		if ( output && output.nodeType ) {
			return output;
		}
	}

	// If we've been given a collection (jQuery, Zepto etc), extract the first item
	if ( input[0] && input[0].nodeType ) {
		return input[0];
	}

	return null;
}

if ( !isClient ) {
	matches = null;
} else {
	div = createElement( 'div' );
	methodNames = [ 'matches', 'matchesSelector' ];

	makeFunction = function ( methodName ) {
		return function ( node, selector ) {
			return node[ methodName ]( selector );
		};
	};

	i = methodNames.length;

	while ( i-- && !matches ) {
		unprefixed = methodNames[i];

		if ( div[ unprefixed ] ) {
			matches = makeFunction( unprefixed );
		} else {
			j = vendors.length;
			while ( j-- ) {
				prefixed = vendors[i] + unprefixed.substr( 0, 1 ).toUpperCase() + unprefixed.substring( 1 );

				if ( div[ prefixed ] ) {
					matches = makeFunction( prefixed );
					break;
				}
			}
		}
	}

	// IE8...
	if ( !matches ) {
		matches = function ( node, selector ) {
			var parentNode, i;

			parentNode = node.parentNode;

			if ( !parentNode ) {
				// empty dummy <div>
				div.innerHTML = '';

				parentNode = div;
				node = node.cloneNode();

				div.appendChild( node );
			}

			var nodes = parentNode.querySelectorAll( selector );

			i = nodes.length;
			while ( i-- ) {
				if ( nodes[i] === node ) {
					return true;
				}
			}

			return false;
		};
	}
}

function detachNode ( node ) {
	// stupid ie
	if ( node && typeof node.parentNode !== 'unknown' && node.parentNode ) { // eslint-disable-line valid-typeof
		node.parentNode.removeChild( node );
	}

	return node;
}

function safeToStringValue ( value ) {
	return ( value == null || !value.toString ) ? '' : '' + value;
}

function safeAttributeString ( string ) {
	return safeToStringValue( string )
		.replace( /&/g, '&amp;' )
		.replace( /"/g, '&quot;' )
		.replace( /'/g, '&#39;' );
}

var insertHook = new Hook( 'insert' );

function Ractive$insert ( target, anchor ) {
	if ( !this.fragment.rendered ) {
		// TODO create, and link to, documentation explaining this
		throw new Error( 'The API has changed - you must call `ractive.render(target[, anchor])` to render your Ractive instance. Once rendered you can use `ractive.insert()`.' );
	}

	target = getElement( target );
	anchor = getElement( anchor ) || null;

	if ( !target ) {
		throw new Error( 'You must specify a valid target to insert into' );
	}

	target.insertBefore( this.detach(), anchor );
	this.el = target;

	( target.__ractive_instances__ || ( target.__ractive_instances__ = [] ) ).push( this );
	this.isDetached = false;

	fireInsertHook( this );
}

function fireInsertHook( ractive ) {
	insertHook.fire( ractive );

	ractive.findAllComponents('*').forEach( function (child) {
		fireInsertHook( child.instance );
	});
}

function link( there, here, options ) {
	var model;
	var target = ( options && ( options.ractive || options.instance ) ) || this;

	// may need to allow a mapping to resolve implicitly
	var sourcePath = splitKeypath( there );
	if ( !target.viewmodel.has( sourcePath[0] ) && target.component ) {
		model = resolveReference( target.component.parentFragment, sourcePath[0] );
		model = model.joinAll( sourcePath.slice( 1 ) );
	}

	var src = model || target.viewmodel.joinAll( sourcePath );
	var dest = this.viewmodel.joinAll( splitKeypath( here ), { lastLink: false });

	if ( isUpstream( src, dest ) || isUpstream( dest, src ) ) {
		throw new Error( 'A keypath cannot be linked to itself.' );
	}

	var promise = runloop.start();

	dest.link( src, there );

	runloop.end();

	return promise;
}

function isUpstream ( check, start ) {
	var model = start;
	while ( model ) {
		if ( model === check ) { return true; }
		model = model.target || model.parent;
	}
}

var Observer = function Observer ( ractive, model, callback, options ) {
	this.context = options.context || ractive;
	this.callback = callback;
	this.ractive = ractive;
	this.keypath = options.keypath;
	this.options = options;

	if ( model ) { this.resolved( model ); }

	if ( typeof options.old === 'function' ) {
		this.oldContext = Object.create( ractive );
		this.old = options.old;
	} else {
		this.old = old;
	}

	if ( options.init !== false ) {
		this.dirty = true;
		this.dispatch();
	} else {
		this.oldValue = this.old.call( this.oldContext, undefined, this.newValue );
	}

	this.dirty = false;
};

Observer.prototype.cancel = function cancel () {
	this.cancelled = true;
	if ( this.model ) {
		this.model.unregister( this );
	} else {
		this.resolver.unbind();
	}
	removeFromArray( this.ractive._observers, this );
};

Observer.prototype.dispatch = function dispatch () {
	if ( !this.cancelled ) {
		this.callback.call( this.context, this.newValue, this.oldValue, this.keypath );
		this.oldValue = this.old.call( this.oldContext, this.oldValue, this.model ? this.model.get() : this.newValue );
		this.dirty = false;
	}
};

Observer.prototype.handleChange = function handleChange () {
		var this$1 = this;

	if ( !this.dirty ) {
		var newValue = this.model.get();
		if ( isEqual( newValue, this.oldValue ) ) { return; }

		this.newValue = newValue;

		if ( this.options.strict && this.newValue === this.oldValue ) { return; }

		runloop.addObserver( this, this.options.defer );
		this.dirty = true;

		if ( this.options.once ) { runloop.scheduleTask( function () { return this$1.cancel(); } ); }
	}
};

Observer.prototype.rebind = function rebind ( next, previous ) {
		var this$1 = this;

	next = rebindMatch( this.keypath, next, previous );
	// TODO: set up a resolver if next is undefined?
	if ( next === this.model ) { return false; }

	if ( this.model ) { this.model.unregister( this ); }
	if ( next ) { next.addShuffleTask( function () { return this$1.resolved( next ); } ); }
};

Observer.prototype.resolved = function resolved ( model ) {
	this.model = model;

	this.oldValue = undefined;
	this.newValue = model.get();

	model.register( this );
};

function old ( previous, next ) {
	return next;
}

var star$1 = /\*+/g;

var PatternObserver = function PatternObserver ( ractive, baseModel, keys, callback, options ) {
	var this$1 = this;

	this.context = options.context || ractive;
	this.ractive = ractive;
	this.baseModel = baseModel;
	this.keys = keys;
	this.callback = callback;

	var pattern = keys.join( '\\.' ).replace( star$1, '(.+)' );
	var baseKeypath = this.baseKeypath = baseModel.getKeypath( ractive );
	this.pattern = new RegExp( ("^" + (baseKeypath ? baseKeypath + '\\.' : '') + pattern + "$") );
	this.recursive = keys.length === 1 && keys[0] === '**';
	if ( this.recursive ) { this.keys = [ '*' ]; }

	this.oldValues = {};
	this.newValues = {};

	this.defer = options.defer;
	this.once = options.once;
	this.strict = options.strict;

	this.dirty = false;
	this.changed = [];
	this.partial = false;
	this.links = options.links;

	var models = baseModel.findMatches( this.keys );

	models.forEach( function (model) {
		this$1.newValues[ model.getKeypath( this$1.ractive ) ] = model.get();
	});

	if ( options.init !== false ) {
		this.dispatch();
	} else {
		this.oldValues = this.newValues;
	}

	baseModel.registerPatternObserver( this );
};

PatternObserver.prototype.cancel = function cancel () {
	this.baseModel.unregisterPatternObserver( this );
	removeFromArray( this.ractive._observers, this );
};

PatternObserver.prototype.dispatch = function dispatch () {
		var this$1 = this;

	var newValues = this.newValues;
	this.newValues = {};
	Object.keys( newValues ).forEach( function (keypath) {
		var newValue = newValues[ keypath ];
		var oldValue = this$1.oldValues[ keypath ];

		if ( this$1.strict && newValue === oldValue ) { return; }
		if ( isEqual( newValue, oldValue ) ) { return; }

		var args = [ newValue, oldValue, keypath ];
		if ( keypath ) {
			var wildcards = this$1.pattern.exec( keypath );
			if ( wildcards ) {
				args = args.concat( wildcards.slice( 1 ) );
			}
		}

		this$1.callback.apply( this$1.context, args );
	});

	if ( this.partial ) {
		for ( var k in newValues ) {
			this$1.oldValues[k] = newValues[k];
		}
	} else {
		this.oldValues = newValues;
	}

	this.dirty = false;
};

PatternObserver.prototype.notify = function notify ( key ) {
	this.changed.push( key );
};

PatternObserver.prototype.shuffle = function shuffle ( newIndices ) {
		var this$1 = this;

	if ( !Array.isArray( this.baseModel.value ) ) { return; }

	var max = this.baseModel.value.length;

	for ( var i = 0; i < newIndices.length; i++ ) {
		if ( newIndices[ i ] === -1 || newIndices[ i ] === i ) { continue; }
		this$1.changed.push([ i ]);
	}

	for ( var i$1 = newIndices.touchedFrom; i$1 < max; i$1++ ) {
		this$1.changed.push([ i$1 ]);
	}
};

PatternObserver.prototype.handleChange = function handleChange () {
		var this$1 = this;

	if ( !this.dirty || this.changed.length ) {
		if ( !this.dirty ) { this.newValues = {}; }

		if ( !this.changed.length ) {
			this.baseModel.findMatches( this.keys ).forEach( function (model) {
				var keypath = model.getKeypath( this$1.ractive );
				this$1.newValues[ keypath ] = model.get();
			});
			this.partial = false;
		} else {
			var count = 0;

			if ( this.recursive ) {
				this.changed.forEach( function (keys) {
					var model = this$1.baseModel.joinAll( keys );
					if ( model.isLink && !this$1.links ) { return; }
					count++;
					this$1.newValues[ model.getKeypath( this$1.ractive ) ] = model.get();
				});
			} else {
				var ok = this.baseModel.isRoot ?
					this.changed.map( function (keys) { return keys.map( escapeKey ).join( '.' ); } ) :
					this.changed.map( function (keys) { return this$1.baseKeypath + '.' + keys.map( escapeKey ).join( '.' ); } );

				this.baseModel.findMatches( this.keys ).forEach( function (model) {
					var keypath = model.getKeypath( this$1.ractive );
					var check = function (k) {
						return ( k.indexOf( keypath ) === 0 && ( k.length === keypath.length || k[ keypath.length ] === '.' ) ) ||
							( keypath.indexOf( k ) === 0 && ( k.length === keypath.length || keypath[ k.length ] === '.' ) );
					};

					// is this model on a changed keypath?
					if ( ok.filter( check ).length ) {
						count++;
						this$1.newValues[ keypath ] = model.get();
					}
				});
			}

			// no valid change triggered, so bail to avoid breakage
			if ( !count ) { return; }

			this.partial = true;
		}

		runloop.addObserver( this, this.defer );
		this.dirty = true;
		this.changed.length = 0;

		if ( this.once ) { this.cancel(); }
	}
};

function negativeOne () {
	return -1;
}

var ArrayObserver = function ArrayObserver ( ractive, model, callback, options ) {
	this.ractive = ractive;
	this.model = model;
	this.keypath = model.getKeypath();
	this.callback = callback;
	this.options = options;

	this.pending = null;

	model.register( this );

	if ( options.init !== false ) {
		this.sliced = [];
		this.shuffle([]);
		this.dispatch();
	} else {
		this.sliced = this.slice();
	}
};

ArrayObserver.prototype.cancel = function cancel () {
	this.model.unregister( this );
	removeFromArray( this.ractive._observers, this );
};

ArrayObserver.prototype.dispatch = function dispatch () {
	this.callback( this.pending );
	this.pending = null;
	if ( this.options.once ) { this.cancel(); }
};

ArrayObserver.prototype.handleChange = function handleChange () {
	if ( this.pending ) {
		// post-shuffle
		runloop.addObserver( this, this.options.defer );
	} else {
		// entire array changed
		this.shuffle( this.sliced.map( negativeOne ) );
		this.handleChange();
	}
};

ArrayObserver.prototype.shuffle = function shuffle ( newIndices ) {
		var this$1 = this;

	var newValue = this.slice();

	var inserted = [];
	var deleted = [];
	var start;

	var hadIndex = {};

	newIndices.forEach( function ( newIndex, oldIndex ) {
		hadIndex[ newIndex ] = true;

		if ( newIndex !== oldIndex && start === undefined ) {
			start = oldIndex;
		}

		if ( newIndex === -1 ) {
			deleted.push( this$1.sliced[ oldIndex ] );
		}
	});

	if ( start === undefined ) { start = newIndices.length; }

	var len = newValue.length;
	for ( var i = 0; i < len; i += 1 ) {
		if ( !hadIndex[i] ) { inserted.push( newValue[i] ); }
	}

	this.pending = { inserted: inserted, deleted: deleted, start: start };
	this.sliced = newValue;
};

ArrayObserver.prototype.slice = function slice () {
	var value = this.model.get();
	return Array.isArray( value ) ? value.slice() : [];
};

function observe ( keypath, callback, options ) {
	var this$1 = this;

	var observers = [];
	var map;
	var opts;

	if ( isObject( keypath ) ) {
		map = keypath;
		opts = callback || {};
	} else {
		if ( typeof keypath === 'function' ) {
			map = { '': keypath };
			opts = callback || {};
		} else {
			map = {};
			map[ keypath ] = callback;
			opts = options || {};
		}
	}

	var silent = false;
	Object.keys( map ).forEach( function (keypath) {
		var callback = map[ keypath ];
		var caller = function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];

			if ( silent ) { return; }
			return callback.apply( this, args );
		};

		var keypaths = keypath.split( ' ' );
		if ( keypaths.length > 1 ) { keypaths = keypaths.filter( function (k) { return k; } ); }

		keypaths.forEach( function (keypath) {
			opts.keypath = keypath;
			var observer = createObserver( this$1, keypath, caller, opts );
			if ( observer ) { observers.push( observer ); }
		});
	});

	// add observers to the Ractive instance, so they can be
	// cancelled on ractive.teardown()
	this._observers.push.apply( this._observers, observers );

	return {
		cancel: function () { return observers.forEach( function (o) { return o.cancel(); } ); },
		isSilenced: function () { return silent; },
		silence: function () { return silent = true; },
		resume: function () { return silent = false; }
	};
}

function createObserver ( ractive, keypath, callback, options ) {
	var keys = splitKeypath( keypath );
	var wildcardIndex = keys.indexOf( '*' );
	if ( !~wildcardIndex ) { wildcardIndex = keys.indexOf( '**' ); }

	options.fragment = options.fragment || ractive.fragment;

	var model;
	if ( !options.fragment ) {
		model = ractive.viewmodel.joinKey( keys[0] );
	} else {
		// .*.whatever relative wildcard is a special case because splitkeypath doesn't handle the leading .
		if ( ~keys[0].indexOf( '.*' ) ) {
			model = options.fragment.findContext();
			wildcardIndex = 0;
			keys[0] = keys[0].slice( 1 );
		} else {
			model = wildcardIndex === 0 ? options.fragment.findContext() : resolveReference( options.fragment, keys[0] );
		}
	}

	// the model may not exist key
	if ( !model ) { model = ractive.viewmodel.joinKey( keys[0] ); }

	if ( !~wildcardIndex ) {
		model = model.joinAll( keys.slice( 1 ) );
		if ( options.array ) {
			return new ArrayObserver( ractive, model, callback, options );
		} else {
			return new Observer( ractive, model, callback, options );
		}
	} else {
		var double = keys.indexOf( '**' );
		if ( ~double ) {
			if ( double + 1 !== keys.length || ~keys.indexOf( '*' ) ) {
				warnOnceIfDebug( "Recursive observers may only specify a single '**' at the end of the path." );
				return;
			}
		}

		model = model.joinAll( keys.slice( 1, wildcardIndex ) );

		return new PatternObserver( ractive, model, keys.slice( wildcardIndex ), callback, options );
	}
}

var onceOptions = { init: false, once: true };

function observeOnce ( keypath, callback, options ) {
	if ( isObject( keypath ) || typeof keypath === 'function' ) {
		options = Object.assign( callback || {}, onceOptions );
		return this.observe( keypath, options );
	}

	options = Object.assign( options || {}, onceOptions );
	return this.observe( keypath, callback, options );
}

var trim = function (str) { return str.trim(); };

var notEmptyString = function (str) { return str !== ''; };

function Ractive$off ( eventName, callback ) {
	var this$1 = this;

	// if no event is specified, remove _all_ event listeners
	if ( !eventName ) {
		this._subs = {};
	} else {
		// Handle multiple space-separated event names
		var eventNames = eventName.split( ' ' ).map( trim ).filter( notEmptyString );

		eventNames.forEach( function (event) {
			var subs = this$1._subs[ event ];
			// if given a specific callback to remove, remove only it
			if ( subs && callback ) {
				var entry = subs.find( function (s) { return s.callback === callback; } );
				if ( entry ) {
					removeFromArray( subs, entry );
					entry.off = true;

					if ( event.indexOf( '.' ) ) { this$1._nsSubs--; }
				}
			}

			// otherwise, remove all listeners for this event
			else if ( subs ) {
				if ( event.indexOf( '.' ) ) { this$1._nsSubs -= subs.length; }
				subs.length = 0;
			}
		});
	}

	return this;
}

function Ractive$on ( eventName, callback ) {
	var this$1 = this;

	// eventName may already be a map
	var map = typeof eventName === 'object' ? eventName : {};
	// or it may be a string along with a callback
	if ( typeof eventName === 'string' ) { map[ eventName ] = callback; }

	var silent = false;
	var events = [];

	var loop = function ( k ) {
		var callback$1 = map[k];
		var caller = function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];

			if ( !silent ) { return callback$1.apply( this, args ); }
		};
		var entry = {
			callback: callback$1,
			handler: caller
		};

		if ( map.hasOwnProperty( k ) ) {
			var names = k.split( ' ' ).map( trim ).filter( notEmptyString );
			names.forEach( function (n) {
				( this$1._subs[ n ] || ( this$1._subs[ n ] = [] ) ).push( entry );
				if ( n.indexOf( '.' ) ) { this$1._nsSubs++; }
				events.push( [ n, entry ] );
			});
		}
	};

	for ( var k in map ) loop( k );

	return {
		cancel: function () { return events.forEach( function (e) { return this$1.off( e[0], e[1].callback ); } ); },
		isSilenced: function () { return silent; },
		silence: function () { return silent = true; },
		resume: function () { return silent = false; }
	};
}

function Ractive$once ( eventName, handler ) {
	var listener = this.on( eventName, function () {
		handler.apply( this, arguments );
		listener.cancel();
	});

	// so we can still do listener.cancel() manually
	return listener;
}

var pop = makeArrayMethod( 'pop' ).path;

var push = makeArrayMethod( 'push' ).path;

function readLink ( keypath, options ) {
	if ( options === void 0 ) options = {};

	var path = splitKeypath( keypath );

	if ( this.viewmodel.has( path[0] ) ) {
		var model = this.viewmodel.joinAll( path );

		if ( !model.isLink ) { return; }

		while ( ( model = model.target ) && options.canonical !== false ) {
			if ( !model.isLink ) { break; }
		}

		if ( model ) { return { ractive: model.root.ractive, keypath: model.getKeypath() }; }
	}
}

var PREFIX = '/* Ractive.js component styles */';

// Holds current definitions of styles.
var styleDefinitions = [];

// Flag to tell if we need to update the CSS
var isDirty = false;

// These only make sense on the browser. See additional setup below.
var styleElement = null;
var useCssText = null;

function addCSS( styleDefinition ) {
	styleDefinitions.push( styleDefinition );
	isDirty = true;
}

function applyCSS() {

	// Apply only seems to make sense when we're in the DOM. Server-side renders
	// can call toCSS to get the updated CSS.
	if ( !doc || !isDirty ) { return; }

	if ( useCssText ) {
		styleElement.styleSheet.cssText = getCSS( null );
	} else {
		styleElement.innerHTML = getCSS( null );
	}

	isDirty = false;
}

function getCSS( cssIds ) {

	var filteredStyleDefinitions = cssIds ? styleDefinitions.filter( function (style) { return ~cssIds.indexOf( style.id ); } ) : styleDefinitions;

	return filteredStyleDefinitions.reduce( function ( styles, style ) { return (styles + "\n\n/* {" + (style.id) + "} */\n" + (style.styles)); }, PREFIX );

}

// If we're on the browser, additional setup needed.
if ( doc && ( !styleElement || !styleElement.parentNode ) ) {

	styleElement = doc.createElement( 'style' );
	styleElement.type = 'text/css';

	doc.getElementsByTagName( 'head' )[ 0 ].appendChild( styleElement );

	useCssText = !!styleElement.styleSheet;
}

function fillGaps ( target ) {
	var sources = [], len = arguments.length - 1;
	while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];


	for (var i = 0; i < sources.length; i++){
		var source = sources[i];
		for ( var key in source ) {
			// Source can be a prototype-less object.
			if ( key in target || !Object.prototype.hasOwnProperty.call( source, key ) ) { continue; }
			target[ key ] = source[ key ];
		}
	}

	return target;
}

function toPairs ( obj ) {
	if ( obj === void 0 ) obj = {};

	var pairs = [];
	for ( var key in obj ) {
		// Source can be a prototype-less object.
		if ( !Object.prototype.hasOwnProperty.call( obj, key ) ) { continue; }
		pairs.push( [ key, obj[ key ] ] );
	}
	return pairs;
}

var adaptConfigurator = {
	extend: function ( Parent, proto, options ) {
		proto.adapt = combine( proto.adapt, ensureArray( options.adapt ) );
	},

	init: function init () {}
};

var remove = /\/\*(?:[\s\S]*?)\*\//g;
var escape = /url\(\s*(['"])(?:\\[\s\S]|(?!\1).)*\1\s*\)|url\((?:\\[\s\S]|[^)])*\)|(['"])(?:\\[\s\S]|(?!\2).)*\2/gi;
var value = /\0(\d+)/g;

// Removes comments and strings from the given CSS to make it easier to parse.
// Callback receives the cleaned CSS and a function which can be used to put
// the removed strings back in place after parsing is done.
var cleanCss = function ( css, callback, additionalReplaceRules ) {
	if ( additionalReplaceRules === void 0 ) additionalReplaceRules = [];

	var values = [];
	var reconstruct = function (css) { return css.replace( value, function ( match, n ) { return values[ n ]; } ); };
	css = css.replace( escape, function (match) { return ("\u0000" + (values.push( match ) - 1)); }).replace( remove, '' );

	additionalReplaceRules.forEach( function ( pattern ) {
		css = css.replace( pattern, function (match) { return ("\u0000" + (values.push( match ) - 1)); } );
	});

	return callback( css, reconstruct );
};

var selectorsPattern = /(?:^|\}|\{)\s*([^\{\}\0]+)\s*(?=\{)/g;
var keyframesDeclarationPattern = /@keyframes\s+[^\{\}]+\s*\{(?:[^{}]+|\{[^{}]+})*}/gi;
var selectorUnitPattern = /((?:(?:\[[^\]]+\])|(?:[^\s\+\>~:]))+)((?:::?[^\s\+\>\~\(:]+(?:\([^\)]+\))?)*\s*[\s\+\>\~]?)\s*/g;
var excludePattern = /^(?:@|\d+%)/;
var dataRvcGuidPattern = /\[data-ractive-css~="\{[a-z0-9-]+\}"]/g;

function trim$1 ( str ) {
	return str.trim();
}

function extractString ( unit ) {
	return unit.str;
}

function transformSelector ( selector, parent ) {
	var selectorUnits = [];
	var match;

	while ( match = selectorUnitPattern.exec( selector ) ) {
		selectorUnits.push({
			str: match[0],
			base: match[1],
			modifiers: match[2]
		});
	}

	// For each simple selector within the selector, we need to create a version
	// that a) combines with the id, and b) is inside the id
	var base = selectorUnits.map( extractString );

	var transformed = [];
	var i = selectorUnits.length;

	while ( i-- ) {
		var appended = base.slice();

		// Pseudo-selectors should go after the attribute selector
		var unit = selectorUnits[i];
		appended[i] = unit.base + parent + unit.modifiers || '';

		var prepended = base.slice();
		prepended[i] = parent + ' ' + prepended[i];

		transformed.push( appended.join( ' ' ), prepended.join( ' ' ) );
	}

	return transformed.join( ', ' );
}

function transformCss ( css, id ) {
	var dataAttr = "[data-ractive-css~=\"{" + id + "}\"]";

	var transformed;

	if ( dataRvcGuidPattern.test( css ) ) {
		transformed = css.replace( dataRvcGuidPattern, dataAttr );
	} else {
		transformed = cleanCss( css, function ( css, reconstruct ) {
			css = css.replace( selectorsPattern, function ( match, $1 ) {
				// don't transform at-rules and keyframe declarations
				if ( excludePattern.test( $1 ) ) { return match; }

				var selectors = $1.split( ',' ).map( trim$1 );
				var transformed = selectors
					.map( function (selector) { return transformSelector( selector, dataAttr ); } )
					.join( ', ' ) + ' ';

				return match.replace( $1, transformed );
			});

			return reconstruct( css );
		}, [ keyframesDeclarationPattern ]);
	}

	return transformed;
}

function s4() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function uuid() {
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

var hasCurly = /\{/;
var cssConfigurator = {
	name: 'css',

	// Called when creating a new component definition
	extend: function ( Parent, proto, options ) {
		if ( !options.css ) { return; }
		var css = typeof options.css === 'string' && !hasCurly.test( options.css ) ?
			( getElement( options.css ) || options.css ) :
			options.css;

		var id = options.cssId || uuid();

		if ( typeof css === 'object' ) {
			css = 'textContent' in css ? css.textContent : css.innerHTML;
		}

		if ( !css ) { return; }

		var styles = options.noCssTransform ? css : transformCss( css, id );

		proto.cssId = id;

		addCSS( { id: id, styles: styles } );
	},

	// Called when creating a new component instance
	init: function ( Parent, target, options ) {
		if ( !options.css ) { return; }

		warnIfDebug( "\nThe css option is currently not supported on a per-instance basis and will be discarded. Instead, we recommend instantiating from a component definition with a css option.\n\nconst Component = Ractive.extend({\n\t...\n\tcss: '/* your css */',\n\t...\n});\n\nconst componentInstance = new Component({ ... })\n\t\t" );
	}

};

function validate ( data ) {
	// Warn if userOptions.data is a non-POJO
	if ( data && data.constructor !== Object ) {
		if ( typeof data === 'function' ) {
			// TODO do we need to support this in the new Ractive() case?
		} else if ( typeof data !== 'object' ) {
			fatal( ("data option must be an object or a function, `" + data + "` is not valid") );
		} else {
			warnIfDebug( 'If supplied, options.data should be a plain JavaScript object - using a non-POJO as the root object may work, but is discouraged' );
		}
	}
}

var dataConfigurator = {
	name: 'data',

	extend: function ( Parent, proto, options ) {
		var key;
		var value;

		// check for non-primitives, which could cause mutation-related bugs
		if ( options.data && isObject( options.data ) ) {
			for ( key in options.data ) {
				value = options.data[ key ];

				if ( value && typeof value === 'object' ) {
					if ( isObject( value ) || Array.isArray( value ) ) {
						warnIfDebug( "Passing a `data` option with object and array properties to Ractive.extend() is discouraged, as mutating them is likely to cause bugs. Consider using a data function instead:\n\n  // this...\n  data: function () {\n    return {\n      myObject: {}\n    };\n  })\n\n  // instead of this:\n  data: {\n    myObject: {}\n  }" );
					}
				}
			}
		}

		proto.data = combine$1( proto.data, options.data );
	},

	init: function ( Parent, ractive, options ) {
		var result = combine$1( Parent.prototype.data, options.data );

		if ( typeof result === 'function' ) { result = result.call( ractive ); }

		// bind functions to the ractive instance at the top level,
		// unless it's a non-POJO (in which case alarm bells should ring)
		if ( result && result.constructor === Object ) {
			for ( var prop in result ) {
				if ( typeof result[ prop ] === 'function' ) {
					var value = result[ prop ];
					result[ prop ] = bind$1( value, ractive );
					result[ prop ]._r_unbound = value;
				}
			}
		}

		return result || {};
	},

	reset: function reset ( ractive ) {
		var result = this.init( ractive.constructor, ractive, ractive.viewmodel );
		ractive.viewmodel.root.set( result );
		return true;
	}
};

function combine$1 ( parentValue, childValue ) {
	validate( childValue );

	var parentIsFn = typeof parentValue === 'function';
	var childIsFn = typeof childValue === 'function';

	// Very important, otherwise child instance can become
	// the default data object on Ractive or a component.
	// then ractive.set() ends up setting on the prototype!
	if ( !childValue && !parentIsFn ) {
		childValue = {};
	}

	// Fast path, where we just need to copy properties from
	// parent to child
	if ( !parentIsFn && !childIsFn ) {
		return fromProperties( childValue, parentValue );
	}

	return function () {
		var child = childIsFn ? callDataFunction( childValue, this ) : childValue;
		var parent = parentIsFn ? callDataFunction( parentValue, this ) : parentValue;

		return fromProperties( child, parent );
	};
}

function callDataFunction ( fn, context ) {
	var data = fn.call( context );

	if ( !data ) { return; }

	if ( typeof data !== 'object' ) {
		fatal( 'Data function must return an object' );
	}

	if ( data.constructor !== Object ) {
		warnOnceIfDebug( 'Data function returned something other than a plain JavaScript object. This might work, but is strongly discouraged' );
	}

	return data;
}

function fromProperties ( primary, secondary ) {
	if ( primary && secondary ) {
		for ( var key in secondary ) {
			if ( !( key in primary ) ) {
				primary[ key ] = secondary[ key ];
			}
		}

		return primary;
	}

	return primary || secondary;
}

var TEMPLATE_VERSION = 4;

var pattern = /\$\{([^\}]+)\}/g;

function fromExpression ( body, length ) {
	if ( length === void 0 ) length = 0;

	var args = new Array( length );

	while ( length-- ) {
		args[length] = "_" + length;
	}

	// Functions created directly with new Function() look like this:
	//     function anonymous (_0 /**/) { return _0*2 }
	//
	// With this workaround, we get a little more compact:
	//     function (_0){return _0*2}
	return new Function( [], ("return function (" + (args.join(',')) + "){return(" + body + ");};") )();
}

function fromComputationString ( str, bindTo ) {
	var hasThis;

	var functionBody = 'return (' + str.replace( pattern, function ( match, keypath ) {
		hasThis = true;
		return ("__ractive.get(\"" + keypath + "\")");
	}) + ');';

	if ( hasThis ) { functionBody = "var __ractive = this; " + functionBody; }
	var fn = new Function( functionBody );
	return hasThis ? fn.bind( bindTo ) : fn;
}

var functions = Object.create( null );

function getFunction ( str, i ) {
	if ( functions[ str ] ) { return functions[ str ]; }
	return functions[ str ] = createFunction( str, i );
}

function addFunctions( template ) {
	if ( !template ) { return; }

	var exp = template.e;

	if ( !exp ) { return; }

	Object.keys( exp ).forEach( function ( str ) {
		if ( functions[ str ] ) { return; }
		functions[ str ] = exp[ str ];
	});
}

var leadingWhitespace = /^\s+/;

var ParseError = function ( message ) {
	this.name = 'ParseError';
	this.message = message;
	try {
		throw new Error(message);
	} catch (e) {
		this.stack = e.stack;
	}
};

ParseError.prototype = Error.prototype;

var Parser = function ( str, options ) {
	var item;
	var lineStart = 0;

	this.str = str;
	this.options = options || {};
	this.pos = 0;

	this.lines = this.str.split( '\n' );
	this.lineEnds = this.lines.map( function (line) {
		var lineEnd = lineStart + line.length + 1; // +1 for the newline

		lineStart = lineEnd;
		return lineEnd;
	}, 0 );

	// Custom init logic
	if ( this.init ) { this.init( str, options ); }

	var items = [];

	while ( ( this.pos < this.str.length ) && ( item = this.read() ) ) {
		items.push( item );
	}

	this.leftover = this.remaining();
	this.result = this.postProcess ? this.postProcess( items, options ) : items;
};

Parser.prototype = {
	read: function read ( converters ) {
		var this$1 = this;

		var i, item;

		if ( !converters ) { converters = this.converters; }

		var pos = this.pos;

		var len = converters.length;
		for ( i = 0; i < len; i += 1 ) {
			this$1.pos = pos; // reset for each attempt

			if ( item = converters[i]( this$1 ) ) {
				return item;
			}
		}

		return null;
	},

	getContextMessage: function getContextMessage ( pos, message ) {
		var ref = this.getLinePos( pos );
		var lineNum = ref[0];
		var columnNum = ref[1];
		if ( this.options.contextLines === -1 ) {
			return [ lineNum, columnNum, (message + " at line " + lineNum + " character " + columnNum) ];
		}

		var line = this.lines[ lineNum - 1 ];

		var contextUp = '';
		var contextDown = '';
		if ( this.options.contextLines ) {
			var start = lineNum - 1 - this.options.contextLines < 0 ? 0 : lineNum - 1 - this.options.contextLines;
			contextUp = this.lines.slice( start, lineNum - 1 - start ).join( '\n' ).replace( /\t/g, '  ' );
			contextDown = this.lines.slice( lineNum, lineNum + this.options.contextLines ).join( '\n' ).replace( /\t/g, '  ' );
			if ( contextUp ) {
				contextUp += '\n';
			}
			if ( contextDown ) {
				contextDown = '\n' + contextDown;
			}
		}

		var numTabs = 0;
		var annotation = contextUp + line.replace( /\t/g, function ( match, char ) {
			if ( char < columnNum ) {
				numTabs += 1;
			}

			return '  ';
		}) + '\n' + new Array( columnNum + numTabs ).join( ' ' ) + '^----' + contextDown;

		return [ lineNum, columnNum, (message + " at line " + lineNum + " character " + columnNum + ":\n" + annotation) ];
	},

	getLinePos: function getLinePos ( char ) {
		var this$1 = this;

		var lineNum = 0;
		var lineStart = 0;

		while ( char >= this.lineEnds[ lineNum ] ) {
			lineStart = this$1.lineEnds[ lineNum ];
			lineNum += 1;
		}

		var columnNum = char - lineStart;
		return [ lineNum + 1, columnNum + 1, char ]; // line/col should be one-based, not zero-based!
	},

	error: function error ( message ) {
		var ref = this.getContextMessage( this.pos, message );
		var lineNum = ref[0];
		var columnNum = ref[1];
		var msg = ref[2];

		var error = new ParseError( msg );

		error.line = lineNum;
		error.character = columnNum;
		error.shortMessage = message;

		throw error;
	},

	matchString: function matchString ( string ) {
		if ( this.str.substr( this.pos, string.length ) === string ) {
			this.pos += string.length;
			return string;
		}
	},

	matchPattern: function matchPattern ( pattern ) {
		var match;

		if ( match = pattern.exec( this.remaining() ) ) {
			this.pos += match[0].length;
			return match[1] || match[0];
		}
	},

	allowWhitespace: function allowWhitespace () {
		this.matchPattern( leadingWhitespace );
	},

	remaining: function remaining () {
		return this.str.substring( this.pos );
	},

	nextChar: function nextChar () {
		return this.str.charAt( this.pos );
	},

	warn: function warn$$1 ( message ) {
		var msg = this.getContextMessage( this.pos, message )[2];

		warnIfDebug( msg );
	}
};

Parser.extend = function ( proto ) {
	var Parent = this;
	var Child = function ( str, options ) {
		Parser.call( this, str, options );
	};

	Child.prototype = Object.create( Parent.prototype );

	for ( var key in proto ) {
		if ( proto.hasOwnProperty( key ) ) {
			Child.prototype[ key ] = proto[ key ];
		}
	}

	Child.extend = Parser.extend;
	return Child;
};

var delimiterChangePattern = /^[^\s=]+/;
var whitespacePattern = /^\s+/;

function readDelimiterChange ( parser ) {
	if ( !parser.matchString( '=' ) ) {
		return null;
	}

	var start = parser.pos;

	// allow whitespace before new opening delimiter
	parser.allowWhitespace();

	var opening = parser.matchPattern( delimiterChangePattern );
	if ( !opening ) {
		parser.pos = start;
		return null;
	}

	// allow whitespace (in fact, it's necessary...)
	if ( !parser.matchPattern( whitespacePattern ) ) {
		return null;
	}

	var closing = parser.matchPattern( delimiterChangePattern );
	if ( !closing ) {
		parser.pos = start;
		return null;
	}

	// allow whitespace before closing '='
	parser.allowWhitespace();

	if ( !parser.matchString( '=' ) ) {
		parser.pos = start;
		return null;
	}

	return [ opening, closing ];
}

var regexpPattern = /^(\/(?:[^\n\r\u2028\u2029/\\[]|\\.|\[(?:[^\n\r\u2028\u2029\]\\]|\\.)*])+\/(?:([gimuy])(?![a-z]*\2))*(?![a-zA-Z_$0-9]))/;

function readNumberLiteral ( parser ) {
	var result;

	if ( result = parser.matchPattern( regexpPattern ) ) {
		return {
			t: REGEXP_LITERAL,
			v: result
		};
	}

	return null;
}

var pattern$1 = /[-/\\^$*+?.()|[\]{}]/g;

function escapeRegExp ( str ) {
	return str.replace( pattern$1, '\\$&' );
}

var regExpCache = {};

var getLowestIndex = function ( haystack, needles ) {
	return haystack.search( regExpCache[needles.join()] || ( regExpCache[needles.join()] = new RegExp( needles.map( escapeRegExp ).join( '|' ) ) ) );
};

// https://github.com/kangax/html-minifier/issues/63#issuecomment-37763316
var booleanAttributes = /^(allowFullscreen|async|autofocus|autoplay|checked|compact|controls|declare|default|defaultChecked|defaultMuted|defaultSelected|defer|disabled|enabled|formNoValidate|hidden|indeterminate|inert|isMap|itemScope|loop|multiple|muted|noHref|noResize|noShade|noValidate|noWrap|open|pauseOnExit|readOnly|required|reversed|scoped|seamless|selected|sortable|translate|trueSpeed|typeMustMatch|visible)$/i;
var voidElementNames = /^(?:area|base|br|col|command|doctype|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;

var htmlEntities = { quot: 34, amp: 38, apos: 39, lt: 60, gt: 62, nbsp: 160, iexcl: 161, cent: 162, pound: 163, curren: 164, yen: 165, brvbar: 166, sect: 167, uml: 168, copy: 169, ordf: 170, laquo: 171, not: 172, shy: 173, reg: 174, macr: 175, deg: 176, plusmn: 177, sup2: 178, sup3: 179, acute: 180, micro: 181, para: 182, middot: 183, cedil: 184, sup1: 185, ordm: 186, raquo: 187, frac14: 188, frac12: 189, frac34: 190, iquest: 191, Agrave: 192, Aacute: 193, Acirc: 194, Atilde: 195, Auml: 196, Aring: 197, AElig: 198, Ccedil: 199, Egrave: 200, Eacute: 201, Ecirc: 202, Euml: 203, Igrave: 204, Iacute: 205, Icirc: 206, Iuml: 207, ETH: 208, Ntilde: 209, Ograve: 210, Oacute: 211, Ocirc: 212, Otilde: 213, Ouml: 214, times: 215, Oslash: 216, Ugrave: 217, Uacute: 218, Ucirc: 219, Uuml: 220, Yacute: 221, THORN: 222, szlig: 223, agrave: 224, aacute: 225, acirc: 226, atilde: 227, auml: 228, aring: 229, aelig: 230, ccedil: 231, egrave: 232, eacute: 233, ecirc: 234, euml: 235, igrave: 236, iacute: 237, icirc: 238, iuml: 239, eth: 240, ntilde: 241, ograve: 242, oacute: 243, ocirc: 244, otilde: 245, ouml: 246, divide: 247, oslash: 248, ugrave: 249, uacute: 250, ucirc: 251, uuml: 252, yacute: 253, thorn: 254, yuml: 255, OElig: 338, oelig: 339, Scaron: 352, scaron: 353, Yuml: 376, fnof: 402, circ: 710, tilde: 732, Alpha: 913, Beta: 914, Gamma: 915, Delta: 916, Epsilon: 917, Zeta: 918, Eta: 919, Theta: 920, Iota: 921, Kappa: 922, Lambda: 923, Mu: 924, Nu: 925, Xi: 926, Omicron: 927, Pi: 928, Rho: 929, Sigma: 931, Tau: 932, Upsilon: 933, Phi: 934, Chi: 935, Psi: 936, Omega: 937, alpha: 945, beta: 946, gamma: 947, delta: 948, epsilon: 949, zeta: 950, eta: 951, theta: 952, iota: 953, kappa: 954, lambda: 955, mu: 956, nu: 957, xi: 958, omicron: 959, pi: 960, rho: 961, sigmaf: 962, sigma: 963, tau: 964, upsilon: 965, phi: 966, chi: 967, psi: 968, omega: 969, thetasym: 977, upsih: 978, piv: 982, ensp: 8194, emsp: 8195, thinsp: 8201, zwnj: 8204, zwj: 8205, lrm: 8206, rlm: 8207, ndash: 8211, mdash: 8212, lsquo: 8216, rsquo: 8217, sbquo: 8218, ldquo: 8220, rdquo: 8221, bdquo: 8222, dagger: 8224, Dagger: 8225, bull: 8226, hellip: 8230, permil: 8240, prime: 8242, Prime: 8243, lsaquo: 8249, rsaquo: 8250, oline: 8254, frasl: 8260, euro: 8364, image: 8465, weierp: 8472, real: 8476, trade: 8482, alefsym: 8501, larr: 8592, uarr: 8593, rarr: 8594, darr: 8595, harr: 8596, crarr: 8629, lArr: 8656, uArr: 8657, rArr: 8658, dArr: 8659, hArr: 8660, forall: 8704, part: 8706, exist: 8707, empty: 8709, nabla: 8711, isin: 8712, notin: 8713, ni: 8715, prod: 8719, sum: 8721, minus: 8722, lowast: 8727, radic: 8730, prop: 8733, infin: 8734, ang: 8736, and: 8743, or: 8744, cap: 8745, cup: 8746, int: 8747, there4: 8756, sim: 8764, cong: 8773, asymp: 8776, ne: 8800, equiv: 8801, le: 8804, ge: 8805, sub: 8834, sup: 8835, nsub: 8836, sube: 8838, supe: 8839, oplus: 8853, otimes: 8855, perp: 8869, sdot: 8901, lceil: 8968, rceil: 8969, lfloor: 8970, rfloor: 8971, lang: 9001, rang: 9002, loz: 9674, spades: 9824, clubs: 9827, hearts: 9829, diams: 9830	};
var controlCharacters = [ 8364, 129, 8218, 402, 8222, 8230, 8224, 8225, 710, 8240, 352, 8249, 338, 141, 381, 143, 144, 8216, 8217, 8220, 8221, 8226, 8211, 8212, 732, 8482, 353, 8250, 339, 157, 382, 376 ];
var entityPattern = new RegExp( '&(#?(?:x[\\w\\d]+|\\d+|' + Object.keys( htmlEntities ).join( '|' ) + '));?', 'g' );
var codePointSupport = typeof String.fromCodePoint === 'function';
var codeToChar = codePointSupport ? String.fromCodePoint : String.fromCharCode;

function decodeCharacterReferences ( html ) {
	return html.replace( entityPattern, function ( match, entity ) {
		var code;

		// Handle named entities
		if ( entity[0] !== '#' ) {
			code = htmlEntities[ entity ];
		} else if ( entity[1] === 'x' ) {
			code = parseInt( entity.substring( 2 ), 16 );
		} else {
			code = parseInt( entity.substring( 1 ), 10 );
		}

		if ( !code ) {
			return match;
		}

		return codeToChar( validateCode( code ) );
	});
}

var lessThan = /</g;
var greaterThan = />/g;
var amp = /&/g;
var invalid = 65533;

function escapeHtml ( str ) {
	return str
		.replace( amp, '&amp;' )
		.replace( lessThan, '&lt;' )
		.replace( greaterThan, '&gt;' );
}

// some code points are verboten. If we were inserting HTML, the browser would replace the illegal
// code points with alternatives in some cases - since we're bypassing that mechanism, we need
// to replace them ourselves
//
// Source: http://en.wikipedia.org/wiki/Character_encodings_in_HTML#Illegal_characters
function validateCode ( code ) {
	if ( !code ) {
		return invalid;
	}

	// line feed becomes generic whitespace
	if ( code === 10 ) {
		return 32;
	}

	// ASCII range. (Why someone would use HTML entities for ASCII characters I don't know, but...)
	if ( code < 128 ) {
		return code;
	}

	// code points 128-159 are dealt with leniently by browsers, but they're incorrect. We need
	// to correct the mistake or we'll end up with missing € signs and so on
	if ( code <= 159 ) {
		return controlCharacters[ code - 128 ];
	}

	// basic multilingual plane
	if ( code < 55296 ) {
		return code;
	}

	// UTF-16 surrogate halves
	if ( code <= 57343 ) {
		return invalid;
	}

	// rest of the basic multilingual plane
	if ( code <= 65535 ) {
		return code;
	} else if ( !codePointSupport ) {
		return invalid;
	}

	// supplementary multilingual plane 0x10000 - 0x1ffff
	if ( code >= 65536 && code <= 131071 ) {
		return code;
	}

	// supplementary ideographic plane 0x20000 - 0x2ffff
	if ( code >= 131072 && code <= 196607 ) {
		return code;
	}

	return invalid;
}

var expectedExpression = 'Expected a JavaScript expression';
var expectedParen = 'Expected closing paren';

// bulletproof number regex from https://gist.github.com/Rich-Harris/7544330
var numberPattern = /^(?:[+-]?)0*(?:(?:(?:[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/;

function readNumberLiteral$1 ( parser ) {
	var result;

	if ( result = parser.matchPattern( numberPattern ) ) {
		return {
			t: NUMBER_LITERAL,
			v: result
		};
	}

	return null;
}

function readBooleanLiteral ( parser ) {
	var remaining = parser.remaining();

	if ( remaining.substr( 0, 4 ) === 'true' ) {
		parser.pos += 4;
		return {
			t: BOOLEAN_LITERAL,
			v: 'true'
		};
	}

	if ( remaining.substr( 0, 5 ) === 'false' ) {
		parser.pos += 5;
		return {
			t: BOOLEAN_LITERAL,
			v: 'false'
		};
	}

	return null;
}

// Match one or more characters until: ", ', \, or EOL/EOF.
// EOL/EOF is written as (?!.) (meaning there's no non-newline char next).
var stringMiddlePattern = /^(?=.)[^"'\\]+?(?:(?!.)|(?=["'\\]))/;

// Match one escape sequence, including the backslash.
var escapeSequencePattern = /^\\(?:[`'"\\bfnrt]|0(?![0-9])|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|(?=.)[^ux0-9])/;

// Match one ES5 line continuation (backslash + line terminator).
var lineContinuationPattern = /^\\(?:\r\n|[\u000A\u000D\u2028\u2029])/;

// Helper for defining getDoubleQuotedString and getSingleQuotedString.
var makeQuotedStringMatcher = function ( okQuote ) {
	return function ( parser ) {
		var literal = '"';
		var done = false;
		var next;

		while ( !done ) {
			next = ( parser.matchPattern( stringMiddlePattern ) || parser.matchPattern( escapeSequencePattern ) ||
				parser.matchString( okQuote ) );
			if ( next ) {
				if ( next === "\"" ) {
					literal += "\\\"";
				} else if ( next === "\\'" ) {
					literal += "'";
				} else {
					literal += next;
				}
			} else {
				next = parser.matchPattern( lineContinuationPattern );
				if ( next ) {
					// convert \(newline-like) into a \u escape, which is allowed in JSON
					literal += '\\u' + ( '000' + next.charCodeAt(1).toString(16) ).slice( -4 );
				} else {
					done = true;
				}
			}
		}

		literal += '"';

		// use JSON.parse to interpret escapes
		return JSON.parse( literal );
	};
};

var singleMatcher = makeQuotedStringMatcher( "\"" );
var doubleMatcher = makeQuotedStringMatcher( "'" );

var readStringLiteral = function ( parser ) {
	var start = parser.pos;
	var quote = parser.matchString( "'" ) || parser.matchString( "\"" );

	if ( quote ) {
		var string = ( quote === "'" ? singleMatcher : doubleMatcher )( parser );

		if ( !parser.matchString( quote ) ) {
			parser.pos = start;
			return null;
		}

		return {
			t: STRING_LITERAL,
			v: string
		};
	}

	return null;
};

// Match one or more characters until: ", ', or \
var stringMiddlePattern$1 = /^[^`"\\\$]+?(?:(?=[`"\\\$]))/;

var escapes = /[\r\n\t\b\f]/g;
function getString ( literal ) {
	return JSON.parse( ("\"" + (literal.replace( escapes, escapeChar )) + "\"") );
}

function escapeChar ( c ) {
	switch ( c ) {
		case '\n': return '\\n';
		case '\r': return '\\r';
		case '\t': return '\\t';
		case '\b': return '\\b';
		case '\f': return '\\f';
	}
}

function readTemplateStringLiteral ( parser ) {
	if ( !parser.matchString( '`' ) ) { return null; }

	var literal = '';
	var done = false;
	var next;
	var parts = [];

	while ( !done ) {
		next = parser.matchPattern( stringMiddlePattern$1 ) || parser.matchPattern( escapeSequencePattern ) ||
			parser.matchString( '$' ) || parser.matchString( '"' );
		if ( next ) {
			if ( next === "\"" ) {
				literal += "\\\"";
			} else if ( next === '\\`' ) {
				literal += '`';
			} else if ( next === '$' ) {
				if ( parser.matchString( '{' ) ) {
					parts.push({ t: STRING_LITERAL, v: getString( literal ) });
					literal = '';

					parser.allowWhitespace();
					var expr = readExpression( parser );

					if ( !expr ) { parser.error( 'Expected valid expression' ); }

					parts.push({ t: BRACKETED, x: expr });

					parser.allowWhitespace();
					if ( !parser.matchString( '}' ) ) { parser.error( "Expected closing '}' after interpolated expression" ); }
				} else {
					literal += '$';
				}
			} else {
				literal += next;
			}
		} else {
			next = parser.matchPattern( lineContinuationPattern );
			if ( next ) {
				// convert \(newline-like) into a \u escape, which is allowed in JSON
				literal += '\\u' + ( '000' + next.charCodeAt(1).toString(16) ).slice( -4 );
			} else {
				done = true;
			}
		}
	}

	if ( literal.length ) { parts.push({ t: STRING_LITERAL, v: getString( literal ) }); }

	if ( !parser.matchString( '`' ) ) { parser.error( "Expected closing '`'" ); }

	if ( parts.length === 1 ) {
		return parts[0];
	} else {
		var result = parts.pop();
		var part;

		while ( part = parts.pop() ) {
			result = {
				t: INFIX_OPERATOR,
				s: '+',
				o: [ part, result ]
			};
		}

		return {
			t: BRACKETED,
			x: result
		};
	}
}

var name = /^[a-zA-Z_$][a-zA-Z_$0-9]*/;
var spreadPattern = /^\s*\.{3}/;
var legalReference = /^(?:[a-zA-Z$_0-9]|\\\.)+(?:(?:\.(?:[a-zA-Z$_0-9]|\\\.)+)|(?:\[[0-9]+\]))*/;
var relaxedName = /^[a-zA-Z_$][-\/a-zA-Z_$0-9]*(?:\.(?:[a-zA-Z_$][-\/a-zA-Z_$0-9]*))*/;

var identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;

// http://mathiasbynens.be/notes/javascript-properties
// can be any name, string literal, or number literal
function readKey ( parser ) {
	var token;

	if ( token = readStringLiteral( parser ) ) {
		return identifier.test( token.v ) ? token.v : '"' + token.v.replace( /"/g, '\\"' ) + '"';
	}

	if ( token = readNumberLiteral$1( parser ) ) {
		return token.v;
	}

	if ( token = parser.matchPattern( name ) ) {
		return token;
	}

	return null;
}

function readKeyValuePair ( parser ) {
	var spread;
	var start = parser.pos;

	// allow whitespace between '{' and key
	parser.allowWhitespace();

	var refKey = parser.nextChar() !== '\'' && parser.nextChar() !== '"';
	if ( refKey ) { spread = parser.matchPattern( spreadPattern ); }

	var key = spread ? readExpression( parser ) : readKey( parser );
	if ( key === null ) {
		parser.pos = start;
		return null;
	}

	// allow whitespace between key and ':'
	parser.allowWhitespace();

	// es2015 shorthand property
	if ( refKey && ( parser.nextChar() === ',' || parser.nextChar() === '}' ) ) {
		if ( !spread && !name.test( key ) ) {
			parser.error( ("Expected a valid reference, but found '" + key + "' instead.") );
		}

		var pair = {
			t: KEY_VALUE_PAIR,
			k: key,
			v: {
				t: REFERENCE,
				n: key
			}
		};

		if ( spread ) {
			pair.p = true;
		}

		return pair;
	}


	// next character must be ':'
	if ( !parser.matchString( ':' ) ) {
		parser.pos = start;
		return null;
	}

	// allow whitespace between ':' and value
	parser.allowWhitespace();

	// next expression must be a, well... expression
	var value = readExpression( parser );
	if ( value === null ) {
		parser.pos = start;
		return null;
	}

	return {
		t: KEY_VALUE_PAIR,
		k: key,
		v: value
	};
}

function readKeyValuePairs ( parser ) {
	var start = parser.pos;

	var pair = readKeyValuePair( parser );
	if ( pair === null ) {
		return null;
	}

	var pairs = [ pair ];

	if ( parser.matchString( ',' ) ) {
		var keyValuePairs = readKeyValuePairs( parser );

		if ( !keyValuePairs ) {
			parser.pos = start;
			return null;
		}

		return pairs.concat( keyValuePairs );
	}

	return pairs;
}

var readObjectLiteral = function ( parser ) {
	var start = parser.pos;

	// allow whitespace
	parser.allowWhitespace();

	if ( !parser.matchString( '{' ) ) {
		parser.pos = start;
		return null;
	}

	var keyValuePairs = readKeyValuePairs( parser );

	// allow whitespace between final value and '}'
	parser.allowWhitespace();

	if ( !parser.matchString( '}' ) ) {
		parser.pos = start;
		return null;
	}

	return {
		t: OBJECT_LITERAL,
		m: keyValuePairs
	};
};

var readArrayLiteral = function ( parser ) {
	var start = parser.pos;

	// allow whitespace before '['
	parser.allowWhitespace();

	if ( !parser.matchString( '[' ) ) {
		parser.pos = start;
		return null;
	}

	var expressionList = readExpressionList( parser, true );

	if ( !parser.matchString( ']' ) ) {
		parser.pos = start;
		return null;
	}

	return {
		t: ARRAY_LITERAL,
		m: expressionList
	};
};

function readLiteral ( parser ) {
	return readNumberLiteral$1( parser )         ||
	       readBooleanLiteral( parser )        ||
	       readStringLiteral( parser )         ||
	       readTemplateStringLiteral( parser ) ||
	       readObjectLiteral( parser )         ||
	       readArrayLiteral( parser )          ||
	       readNumberLiteral( parser );
}

// if a reference is a browser global, we don't deference it later, so it needs special treatment
var globals = /^(?:Array|console|Date|RegExp|decodeURIComponent|decodeURI|encodeURIComponent|encodeURI|isFinite|isNaN|parseFloat|parseInt|JSON|Math|NaN|undefined|null|Object|Number|String|Boolean)\b/;

// keywords are not valid references, with the exception of `this`
var keywords = /^(?:break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|void|while|with)$/;

var prefixPattern = /^(?:\@\.|\@|~\/|(?:\^\^\/(?:\^\^\/)*(?:\.\.\/)*)|(?:\.\.\/)+|\.\/(?:\.\.\/)*|\.)/;
var specials = /^(key|index|keypath|rootpath|this|global|shared|context|event|node|local)/;

function readReference ( parser ) {
	var prefix, name$$1, global, reference, lastDotIndex;

	var startPos = parser.pos;

	prefix = parser.matchPattern( prefixPattern ) || '';
	name$$1 = ( !prefix && parser.relaxedNames && parser.matchPattern( relaxedName ) ) ||
			parser.matchPattern( legalReference );
	var actual = prefix.length + ( ( name$$1 && name$$1.length ) || 0 );

	if ( prefix === '@.' ) {
		prefix = '@';
		if ( name$$1 ) { name$$1 = 'this.' + name$$1; }
		else { name$$1 = 'this'; }
	}

	if ( !name$$1 && prefix ) {
		name$$1 = prefix;
		prefix = '';
	}

	if ( !name$$1 ) {
		return null;
	}

	if ( prefix === '@' ) {
		if ( !specials.test( name$$1 ) ) {
			parser.error( ("Unrecognized special reference @" + name$$1) );
		} else if ( ( ~name$$1.indexOf( 'event' ) || ~name$$1.indexOf( 'node' ) ) && !parser.inEvent ) {
			parser.error( "@event and @node are only valid references within an event directive" );
		} else if ( ~name$$1.indexOf( 'context' ) ) {
			parser.pos = parser.pos - ( name$$1.length - 7 );
			return {
				t: BRACKETED,
				x: {
					t: REFERENCE,
					n: '@context'
				}
			};
		}
	}

	// bug out if it's a keyword (exception for ancestor/restricted refs - see https://github.com/ractivejs/ractive/issues/1497)
	if ( !prefix && !parser.relaxedNames && keywords.test( name$$1 ) ) {
		parser.pos = startPos;
		return null;
	}

	// if this is a browser global, stop here
	if ( !prefix && globals.test( name$$1 ) ) {
		global = globals.exec( name$$1 )[0];
		parser.pos = startPos + global.length;

		return {
			t: GLOBAL,
			v: global
		};
	}

	reference = ( prefix || '' ) + normalise( name$$1 );

	if ( parser.matchString( '(' ) ) {
		// if this is a method invocation (as opposed to a function) we need
		// to strip the method name from the reference combo, else the context
		// will be wrong
		// but only if the reference was actually a member and not a refinement
		lastDotIndex = reference.lastIndexOf( '.' );
		if ( lastDotIndex !== -1 && name$$1[ name$$1.length - 1 ] !== ']' ) {
			var refLength = reference.length;
			reference = reference.substr( 0, lastDotIndex );
			parser.pos = startPos + ( actual - ( refLength - lastDotIndex ) );
		} else {
			parser.pos -= 1;
		}
	}

	return {
		t: REFERENCE,
		n: reference.replace( /^this\./, './' ).replace( /^this$/, '.' )
	};
}

function readBracketedExpression ( parser ) {
	if ( !parser.matchString( '(' ) ) { return null; }

	parser.allowWhitespace();

	var expr = readExpression( parser );

	if ( !expr ) { parser.error( expectedExpression ); }

	parser.allowWhitespace();

	if ( !parser.matchString( ')' ) ) { parser.error( expectedParen ); }

	return {
		t: BRACKETED,
		x: expr
	};
}

var readPrimary = function ( parser ) {
	return readLiteral( parser )
		|| readReference( parser )
		|| readBracketedExpression( parser );
};

function readRefinement ( parser ) {
	// some things call for strict refinement (partial names), meaning no space between reference and refinement
	if ( !parser.strictRefinement ) {
		parser.allowWhitespace();
	}

	// "." name
	if ( parser.matchString( '.' ) ) {
		parser.allowWhitespace();

		var name$$1 = parser.matchPattern( name );
		if ( name$$1 ) {
			return {
				t: REFINEMENT,
				n: name$$1
			};
		}

		parser.error( 'Expected a property name' );
	}

	// "[" expression "]"
	if ( parser.matchString( '[' ) ) {
		parser.allowWhitespace();

		var expr = readExpression( parser );
		if ( !expr ) { parser.error( expectedExpression ); }

		parser.allowWhitespace();

		if ( !parser.matchString( ']' ) ) { parser.error( "Expected ']'" ); }

		return {
			t: REFINEMENT,
			x: expr
		};
	}

	return null;
}

var readMemberOrInvocation = function ( parser ) {
	var expression = readPrimary( parser );

	if ( !expression ) { return null; }

	while ( expression ) {
		var refinement = readRefinement( parser );
		if ( refinement ) {
			expression = {
				t: MEMBER,
				x: expression,
				r: refinement
			};
		}

		else if ( parser.matchString( '(' ) ) {
			parser.allowWhitespace();
			var expressionList = readExpressionList( parser, true );

			parser.allowWhitespace();

			if ( !parser.matchString( ')' ) ) {
				parser.error( expectedParen );
			}

			expression = {
				t: INVOCATION,
				x: expression
			};

			if ( expressionList ) { expression.o = expressionList; }
		}

		else {
			break;
		}
	}

	return expression;
};

var readTypeOf;

var makePrefixSequenceMatcher = function ( symbol, fallthrough ) {
	return function ( parser ) {
		var expression;

		if ( expression = fallthrough( parser ) ) {
			return expression;
		}

		if ( !parser.matchString( symbol ) ) {
			return null;
		}

		parser.allowWhitespace();

		expression = readExpression( parser );
		if ( !expression ) {
			parser.error( expectedExpression );
		}

		return {
			s: symbol,
			o: expression,
			t: PREFIX_OPERATOR
		};
	};
};

// create all prefix sequence matchers, return readTypeOf
(function() {
	var i, len, matcher, fallthrough;

	var prefixOperators = '! ~ + - typeof'.split( ' ' );

	fallthrough = readMemberOrInvocation;
	for ( i = 0, len = prefixOperators.length; i < len; i += 1 ) {
		matcher = makePrefixSequenceMatcher( prefixOperators[i], fallthrough );
		fallthrough = matcher;
	}

	// typeof operator is higher precedence than multiplication, so provides the
	// fallthrough for the multiplication sequence matcher we're about to create
	// (we're skipping void and delete)
	readTypeOf = fallthrough;
}());

var readTypeof = readTypeOf;

var readLogicalOr;

var makeInfixSequenceMatcher = function ( symbol, fallthrough ) {
	return function ( parser ) {
		// > and / have to be quoted
		if ( parser.inUnquotedAttribute && ( symbol === '>' || symbol === '/' ) ) { return fallthrough( parser ); }

		var start, left, right;

		left = fallthrough( parser );
		if ( !left ) {
			return null;
		}

		// Loop to handle left-recursion in a case like `a * b * c` and produce
		// left association, i.e. `(a * b) * c`.  The matcher can't call itself
		// to parse `left` because that would be infinite regress.
		while ( true ) {
			start = parser.pos;

			parser.allowWhitespace();

			if ( !parser.matchString( symbol ) ) {
				parser.pos = start;
				return left;
			}

			// special case - in operator must not be followed by [a-zA-Z_$0-9]
			if ( symbol === 'in' && /[a-zA-Z_$0-9]/.test( parser.remaining().charAt( 0 ) ) ) {
				parser.pos = start;
				return left;
			}

			parser.allowWhitespace();

			// right operand must also consist of only higher-precedence operators
			right = fallthrough( parser );
			if ( !right ) {
				parser.pos = start;
				return left;
			}

			left = {
				t: INFIX_OPERATOR,
				s: symbol,
				o: [ left, right ]
			};

			// Loop back around.  If we don't see another occurrence of the symbol,
			// we'll return left.
		}
	};
};

// create all infix sequence matchers, and return readLogicalOr
(function() {
	var i, len, matcher, fallthrough;

	// All the infix operators on order of precedence (source: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Operator_Precedence)
	// Each sequence matcher will initially fall through to its higher precedence
	// neighbour, and only attempt to match if one of the higher precedence operators
	// (or, ultimately, a literal, reference, or bracketed expression) already matched
	var infixOperators = '* / % + - << >> >>> < <= > >= in instanceof == != === !== & ^ | && ||'.split( ' ' );

	// A typeof operator is higher precedence than multiplication
	fallthrough = readTypeof;
	for ( i = 0, len = infixOperators.length; i < len; i += 1 ) {
		matcher = makeInfixSequenceMatcher( infixOperators[i], fallthrough );
		fallthrough = matcher;
	}

	// Logical OR is the fallthrough for the conditional matcher
	readLogicalOr = fallthrough;
}());

var readLogicalOr$1 = readLogicalOr;

// The conditional operator is the lowest precedence operator, so we start here
function getConditional ( parser ) {
	var expression = readLogicalOr$1( parser );
	if ( !expression ) {
		return null;
	}

	var start = parser.pos;

	parser.allowWhitespace();

	if ( !parser.matchString( '?' ) ) {
		parser.pos = start;
		return expression;
	}

	parser.allowWhitespace();

	var ifTrue = readExpression( parser );
	if ( !ifTrue ) {
		parser.error( expectedExpression );
	}

	parser.allowWhitespace();

	if ( !parser.matchString( ':' ) ) {
		parser.error( 'Expected ":"' );
	}

	parser.allowWhitespace();

	var ifFalse = readExpression( parser );
	if ( !ifFalse ) {
		parser.error( expectedExpression );
	}

	return {
		t: CONDITIONAL,
		o: [ expression, ifTrue, ifFalse ]
	};
}

function readExpression ( parser ) {
	// The conditional operator is the lowest precedence operator (except yield,
	// assignment operators, and commas, none of which are supported), so we
	// start there. If it doesn't match, it 'falls through' to progressively
	// higher precedence operators, until it eventually matches (or fails to
	// match) a 'primary' - a literal or a reference. This way, the abstract syntax
	// tree has everything in its proper place, i.e. 2 + 3 * 4 === 14, not 20.
	return getConditional( parser );
}

function readExpressionList ( parser, spread ) {
	var isSpread;
	var expressions = [];

	var pos = parser.pos;

	do {
		parser.allowWhitespace();

		if ( spread ) {
			isSpread = parser.matchPattern( spreadPattern );
		}

		var expr = readExpression( parser );

		if ( expr === null && expressions.length ) {
			parser.error( expectedExpression );
		} else if ( expr === null ) {
			parser.pos = pos;
			return null;
		}

		if ( isSpread ) {
			expr.p = true;
		}

		expressions.push( expr );

		parser.allowWhitespace();
	} while ( parser.matchString( ',' ) );

	return expressions;
}

function readExpressionOrReference ( parser, expectedFollowers ) {
	var start = parser.pos;
	var expression = readExpression( parser );

	if ( !expression ) {
		// valid reference but invalid expression e.g. `{{new}}`?
		var ref = parser.matchPattern( /^(\w+)/ );
		if ( ref ) {
			return {
				t: REFERENCE,
				n: ref
			};
		}

		return null;
	}

	for ( var i = 0; i < expectedFollowers.length; i += 1 ) {
		if ( parser.remaining().substr( 0, expectedFollowers[i].length ) === expectedFollowers[i] ) {
			return expression;
		}
	}

	parser.pos = start;
	return readReference( parser );
}

function flattenExpression ( expression ) {
	var refs;
	var count = 0;

	extractRefs( expression, refs = [] );
	var stringified = stringify( expression );

	return {
		r: refs,
		s: getVars(stringified)
	};

	function getVars(expr) {
		var vars = [];
		for ( var i = count - 1; i >= 0; i-- ) {
			vars.push( ("x$" + i) );
		}
		return vars.length ? ("(function(){var " + (vars.join(',')) + ";return(" + expr + ");})()") : expr;
	}

	function stringify ( node ) {
		if ( typeof node === 'string' ) {
			return node;
		}

		switch ( node.t ) {
			case BOOLEAN_LITERAL:
			case GLOBAL:
			case NUMBER_LITERAL:
			case REGEXP_LITERAL:
				return node.v;

			case STRING_LITERAL:
				return JSON.stringify( String( node.v ) );

			case ARRAY_LITERAL:
				if ( node.m && hasSpread( node.m )) {
					return ("[].concat(" + (makeSpread( node.m, '[', ']', stringify )) + ")");
				} else {
					return '[' + ( node.m ? node.m.map( stringify ).join( ',' ) : '' ) + ']';
				}

			case OBJECT_LITERAL:
				if ( node.m && hasSpread( node.m ) ) {
					return ("Object.assign({}," + (makeSpread( node.m, '{', '}', stringifyPair)) + ")");
				} else {
					return '{' + ( node.m ? node.m.map( function (n) { return ((n.k) + ":" + (stringify( n.v ))); } ).join( ',' ) : '' ) + '}';
				}

			case PREFIX_OPERATOR:
				return ( node.s === 'typeof' ? 'typeof ' : node.s ) + stringify( node.o );

			case INFIX_OPERATOR:
				return stringify( node.o[0] ) + ( node.s.substr( 0, 2 ) === 'in' ? ' ' + node.s + ' ' : node.s ) + stringify( node.o[1] );

			case INVOCATION:
				if ( node.o && hasSpread( node.o ) ) {
					var id = count++;
					return ("(x$" + id + "=" + (stringify(node.x)) + ").apply(x$" + id + "," + (stringify({ t: ARRAY_LITERAL, m: node.o })) + ")");
				} else {
					return stringify( node.x ) + '(' + ( node.o ? node.o.map( stringify ).join( ',' ) : '' ) + ')';
				}

			case BRACKETED:
				return '(' + stringify( node.x ) + ')';

			case MEMBER:
				return stringify( node.x ) + stringify( node.r );

			case REFINEMENT:
				return ( node.n ? '.' + node.n : '[' + stringify( node.x ) + ']' );

			case CONDITIONAL:
				return stringify( node.o[0] ) + '?' + stringify( node.o[1] ) + ':' + stringify( node.o[2] );

			case REFERENCE:
				return '_' + refs.indexOf( node.n );

			default:
				throw new Error( 'Expected legal JavaScript' );
		}
	}

	function stringifyPair ( node ) { return node.p ? stringify( node.k ) : ((node.k) + ":" + (stringify( node.v ))); }

	function makeSpread ( list, open, close, fn ) {
		var out = list.reduce( function ( a, c ) {
			if ( c.p ) {
				a.str += "" + (a.open ? close + ',' : a.str.length ? ',' : '') + (fn( c ));
			} else {
				a.str += "" + (!a.str.length ? open : !a.open ? ',' + open : ',') + (fn( c ));
			}
			a.open = !c.p;
			return a;
		}, { open: false, str: '' } );
		if ( out.open ) { out.str += close; }
		return out.str;
	}
}

function hasSpread ( list ) {
	for ( var i = 0; i < list.length; i++ ) {
		if ( list[i].p ) { return true; }
	}

	return false;
}

// TODO maybe refactor this?
function extractRefs ( node, refs ) {
	if ( node.t === REFERENCE && typeof node.n === 'string' ) {
		if ( !~refs.indexOf( node.n ) ) {
			refs.unshift( node.n );
		}
	}

	var list = node.o || node.m;
	if ( list ) {
		if ( isObject( list ) ) {
			extractRefs( list, refs );
		} else {
			var i = list.length;
			while ( i-- ) {
				extractRefs( list[i], refs );
			}
		}
	}

	if ( node.k && node.t === KEY_VALUE_PAIR && typeof node.k !== 'string' ) {
		extractRefs( node.k, refs );
	}

	if ( node.x ) {
		extractRefs( node.x, refs );
	}

	if ( node.r ) {
		extractRefs( node.r, refs );
	}

	if ( node.v ) {
		extractRefs( node.v, refs );
	}
}

function refineExpression ( expression, mustache ) {
	var referenceExpression;

	if ( expression ) {
		while ( expression.t === BRACKETED && expression.x ) {
			expression = expression.x;
		}

		if ( expression.t === REFERENCE ) {
			var n = expression.n;
			if ( !~n.indexOf( '@context' ) ) {
				mustache.r = expression.n;
			} else {
				mustache.x = flattenExpression( expression );
			}
		} else {
			if ( referenceExpression = getReferenceExpression( expression ) ) {
				mustache.rx = referenceExpression;
			} else {
				mustache.x = flattenExpression( expression );
			}
		}

		return mustache;
	}
}

// TODO refactor this! it's bewildering
function getReferenceExpression ( expression ) {
	var members = [];
	var refinement;

	while ( expression.t === MEMBER && expression.r.t === REFINEMENT ) {
		refinement = expression.r;

		if ( refinement.x ) {
			if ( refinement.x.t === REFERENCE ) {
				members.unshift( refinement.x );
			} else {
				members.unshift( flattenExpression( refinement.x ) );
			}
		} else {
			members.unshift( refinement.n );
		}

		expression = expression.x;
	}

	if ( expression.t !== REFERENCE ) {
		return null;
	}

	return {
		r: expression.n,
		m: members
	};
}

var attributeNamePattern = /^[^\s"'>\/=]+/;
var onPattern = /^on/;
var eventPattern = /^on-([a-zA-Z\*\.$_]((?:[a-zA-Z\*\.$_0-9\-]|\\-)+))$/;
var reservedEventNames = /^(?:change|reset|teardown|update|construct|config|init|render|complete|unrender|detach|insert|destruct|attachchild|detachchild)$/;
var decoratorPattern = /^as-([a-z-A-Z][-a-zA-Z_0-9]*)$/;
var transitionPattern = /^([a-zA-Z](?:(?!-in-out)[-a-zA-Z_0-9])*)-(in|out|in-out)$/;
var boundPattern = /^((bind|class)-(([-a-zA-Z0-9_])+))$/;
var directives = {
	lazy: { t: BINDING_FLAG, v: 'l' },
	twoway: { t: BINDING_FLAG, v: 't' },
	'no-delegation': { t: DELEGATE_FLAG }
};
var unquotedAttributeValueTextPattern = /^[^\s"'=<>\/`]+/;
var proxyEvent = /^[^\s"'=<>@\[\]()]*/;
var whitespace = /^\s+/;

var slashes = /\\/g;
function splitEvent ( str ) {
	var result = [];
	var s = 0;

	for ( var i = 0; i < str.length; i++ ) {
		if ( str[i] === '-' && str[ i - 1 ] !== '\\' ) {
			result.push( str.substring( s, i ).replace( slashes, '' ) );
			s = i + 1;
		}
	}

	result.push( str.substring( s ).replace( slashes, '' ) );

	return result;
}

function readAttribute ( parser ) {
	var name, i, nearest, idx;

	parser.allowWhitespace();

	name = parser.matchPattern( attributeNamePattern );
	if ( !name ) {
		return null;
	}

	// check for accidental delimiter consumption e.g. <tag bool{{>attrs}} />
	nearest = name.length;
	for ( i = 0; i < parser.tags.length; i++ ) {
		if ( ~( idx = name.indexOf( parser.tags[ i ].open ) ) ) {
			if ( idx < nearest ) { nearest = idx; }
		}
	}
	if ( nearest < name.length ) {
		parser.pos -= name.length - nearest;
		name = name.substr( 0, nearest );
		if ( !name ) { return null; }
	}

	return { n: name };
}

function readAttributeValue ( parser ) {
	var start = parser.pos;

	// next character must be `=`, `/`, `>` or whitespace
	if ( !/[=\/>\s]/.test( parser.nextChar() ) ) {
		parser.error( 'Expected `=`, `/`, `>` or whitespace' );
	}

	parser.allowWhitespace();

	if ( !parser.matchString( '=' ) ) {
		parser.pos = start;
		return null;
	}

	parser.allowWhitespace();

	var valueStart = parser.pos;
	var startDepth = parser.sectionDepth;

	var value = readQuotedAttributeValue( parser, "'" ) ||
			readQuotedAttributeValue( parser, "\"" ) ||
			readUnquotedAttributeValue( parser );

	if ( value === null ) {
		parser.error( 'Expected valid attribute value' );
	}

	if ( parser.sectionDepth !== startDepth ) {
		parser.pos = valueStart;
		parser.error( 'An attribute value must contain as many opening section tags as closing section tags' );
	}

	if ( !value.length ) {
		return '';
	}

	if ( value.length === 1 && typeof value[0] === 'string' ) {
		return decodeCharacterReferences( value[0] );
	}

	return value;
}

function readUnquotedAttributeValueToken ( parser ) {
	var text, index;

	var start = parser.pos;

	text = parser.matchPattern( unquotedAttributeValueTextPattern );

	if ( !text ) {
		return null;
	}

	var haystack = text;
	var needles = parser.tags.map( function (t) { return t.open; } ); // TODO refactor... we do this in readText.js as well

	if ( ( index = getLowestIndex( haystack, needles ) ) !== -1 ) {
		text = text.substr( 0, index );
		parser.pos = start + text.length;
	}

	return text;
}

function readUnquotedAttributeValue ( parser ) {
	parser.inAttribute = true;

	var tokens = [];

	var token = readMustache( parser ) || readUnquotedAttributeValueToken( parser );
	while ( token ) {
		tokens.push( token );
		token = readMustache( parser ) || readUnquotedAttributeValueToken( parser );
	}

	if ( !tokens.length ) {
		return null;
	}

	parser.inAttribute = false;
	return tokens;
}

function readQuotedAttributeValue ( parser, quoteMark ) {
	var start = parser.pos;

	if ( !parser.matchString( quoteMark ) ) {
		return null;
	}

	parser.inAttribute = quoteMark;

	var tokens = [];

	var token = readMustache( parser ) || readQuotedStringToken( parser, quoteMark );
	while ( token !== null ) {
		tokens.push( token );
		token = readMustache( parser ) || readQuotedStringToken( parser, quoteMark );
	}

	if ( !parser.matchString( quoteMark ) ) {
		parser.pos = start;
		return null;
	}

	parser.inAttribute = false;

	return tokens;
}

function readQuotedStringToken ( parser, quoteMark ) {
	var haystack = parser.remaining();

	var needles = parser.tags.map( function (t) { return t.open; } ); // TODO refactor... we do this in readText.js as well
	needles.push( quoteMark );

	var index = getLowestIndex( haystack, needles );

	if ( index === -1 ) {
		parser.error( 'Quoted attribute value must have a closing quote' );
	}

	if ( !index ) {
		return null;
	}

	parser.pos += index;
	return haystack.substr( 0, index );
}

function readAttributeOrDirective ( parser ) {
	var match, directive;

	var attribute = readAttribute( parser, false );

	if ( !attribute ) { return null; }

		// lazy, twoway
	if ( directive = directives[ attribute.n ] ) {
		attribute.t = directive.t;
		if ( directive.v ) { attribute.v = directive.v; }
		delete attribute.n; // no name necessary
		parser.allowWhitespace();
		if ( parser.nextChar() === '=' ) { attribute.f = readAttributeValue( parser ); }
	}

		// decorators
	else if ( match = decoratorPattern.exec( attribute.n ) ) {
		attribute.n = match[1];
		attribute.t = DECORATOR;
		readArguments( parser, attribute );
	}

		// transitions
	else if ( match = transitionPattern.exec( attribute.n ) ) {
		attribute.n = match[1];
		attribute.t = TRANSITION;
		readArguments( parser, attribute );
		attribute.v = match[2] === 'in-out' ? 't0' : match[2] === 'in' ? 't1' : 't2';
	}

		// on-click etc
	else if ( match = eventPattern.exec( attribute.n ) ) {
		attribute.n = splitEvent( match[1] );
		attribute.t = EVENT;

		parser.inEvent = true;

			// check for a proxy event
		if ( !readProxyEvent( parser, attribute ) ) {
				// otherwise, it's an expression
			readArguments( parser, attribute, true );
		} else if ( reservedEventNames.test( attribute.f ) ) {
			parser.pos -= attribute.f.length;
			parser.error( 'Cannot use reserved event names (change, reset, teardown, update, construct, config, init, render, unrender, complete, detach, insert, destruct, attachchild, detachchild)' );
		}

		parser.inEvent = false;
	}

		// bound directives
	else if ( match = boundPattern.exec( attribute.n ) ){
		var bind = match[2] === 'bind';
		attribute.n = bind ? match[3] : match[1];
		attribute.t = ATTRIBUTE;
		readArguments( parser, attribute, false, true );

		if ( !attribute.f && bind ) {
			attribute.f = [{ t: INTERPOLATOR, r: match[3] }];
		}
	}

	else {
		parser.allowWhitespace();
		var value = parser.nextChar() === '=' ? readAttributeValue( parser ) : null;
		attribute.f = value != null ? value : attribute.f;

		if ( parser.sanitizeEventAttributes && onPattern.test( attribute.n ) ) {
			return { exclude: true };
		} else {
			attribute.f = attribute.f || ( attribute.f === '' ? '' : 0 );
			attribute.t = ATTRIBUTE;
		}
	}

	return attribute;
}

function readProxyEvent ( parser, attribute ) {
	var start = parser.pos;
	if ( !parser.matchString( '=' ) ) { parser.error( "Missing required directive arguments" ); }

	var quote = parser.matchString( "'" ) || parser.matchString( "\"" );
	parser.allowWhitespace();
	var proxy = parser.matchPattern( proxyEvent );

	if ( proxy !== undefined ) {
		if ( quote ) {
			parser.allowWhitespace();
			if ( !parser.matchString( quote ) ) { parser.pos = start; }
			else { return ( attribute.f = proxy ) || true; }
		} else if ( !parser.matchPattern( whitespace ) ) {
			parser.pos = start;
		} else {
			return ( attribute.f = proxy ) || true;
		}
	} else {
		parser.pos = start;
	}
}

function readArguments ( parser, attribute, required, single ) {
	if ( required === void 0 ) required = false;
	if ( single === void 0 ) single = false;

	parser.allowWhitespace();
	if ( !parser.matchString( '=' ) ) {
		if ( required ) { parser.error( "Missing required directive arguments" ); }
		return;
	}
	parser.allowWhitespace();

	var quote = parser.matchString( '"' ) || parser.matchString( "'" );
	var spread = parser.spreadArgs;
	parser.spreadArgs = true;
	parser.inUnquotedAttribute = !quote;
	var expr = single ? readExpressionOrReference( parser, [ quote || ' ', '/', '>' ] ) : { m: readExpressionList( parser ), t: ARRAY_LITERAL };
	parser.inUnquotedAttribute = false;
	parser.spreadArgs = spread;

	if ( quote ) {
		parser.allowWhitespace();
		if ( parser.matchString( quote ) !== quote ) { parser.error( ("Expected matching quote '" + quote + "'") ); }
	}

	if ( single ) {
		var interpolator = { t: INTERPOLATOR };
		refineExpression( expr, interpolator );
		attribute.f = [interpolator];
	} else {
		attribute.f = flattenExpression( expr );
	}
}

var delimiterChangeToken = { t: DELIMCHANGE, exclude: true };

function readMustache ( parser ) {
	var mustache, i;

	// If we're inside a <script> or <style> tag, and we're not
	// interpolating, bug out
	if ( parser.interpolate[ parser.inside ] === false ) {
		return null;
	}

	for ( i = 0; i < parser.tags.length; i += 1 ) {
		if ( mustache = readMustacheOfType( parser, parser.tags[i] ) ) {
			return mustache;
		}
	}

	if ( parser.inTag && !parser.inAttribute ) {
		mustache = readAttributeOrDirective( parser );
		if ( mustache ) {
			parser.allowWhitespace();
			return mustache;
		}
	}
}

function readMustacheOfType ( parser, tag ) {
	var mustache, reader, i;

	var start = parser.pos;

	if ( parser.matchString( '\\' + tag.open ) ) {
		if ( start === 0 || parser.str[ start - 1 ] !== '\\' ) {
			return tag.open;
		}
	} else if ( !parser.matchString( tag.open ) ) {
		return null;
	}

	// delimiter change?
	if ( mustache = readDelimiterChange( parser ) ) {
		// find closing delimiter or abort...
		if ( !parser.matchString( tag.close ) ) {
			return null;
		}

		// ...then make the switch
		tag.open = mustache[0];
		tag.close = mustache[1];
		parser.sortMustacheTags();

		return delimiterChangeToken;
	}

	parser.allowWhitespace();

	// illegal section closer
	if ( parser.matchString( '/' ) ) {
		parser.pos -= 1;
		var rewind = parser.pos;
		if ( !readNumberLiteral( parser ) ) {
			parser.pos = rewind - ( tag.close.length );
			if ( parser.inAttribute ) {
				parser.pos = start;
				return null;
			} else {
				parser.error( 'Attempted to close a section that wasn\'t open' );
			}
		} else {
			parser.pos = rewind;
		}
	}

	for ( i = 0; i < tag.readers.length; i += 1 ) {
		reader = tag.readers[i];

		if ( mustache = reader( parser, tag ) ) {
			if ( tag.isStatic ) {
				mustache.s = 1;
			}

			if ( parser.includeLinePositions ) {
				mustache.p = parser.getLinePos( start );
			}

			return mustache;
		}
	}

	parser.pos = start;
	return null;
}

function readTriple ( parser, tag ) {
	var expression = readExpression( parser );

	if ( !expression ) {
		return null;
	}

	if ( !parser.matchString( tag.close ) ) {
		parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
	}

	var triple = { t: TRIPLE };
	refineExpression( expression, triple ); // TODO handle this differently - it's mysterious

	return triple;
}

function readUnescaped ( parser, tag ) {
	if ( !parser.matchString( '&' ) ) {
		return null;
	}

	parser.allowWhitespace();

	var expression = readExpression( parser );

	if ( !expression ) {
		return null;
	}

	if ( !parser.matchString( tag.close ) ) {
		parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
	}

	var triple = { t: TRIPLE };
	refineExpression( expression, triple ); // TODO handle this differently - it's mysterious

	return triple;
}

var legalAlias = /^(?:[a-zA-Z$_0-9]|\\\.)+(?:(?:(?:[a-zA-Z$_0-9]|\\\.)+)|(?:\[[0-9]+\]))*/;
var asRE = /^as/i;

function readAliases( parser ) {
	var aliases = [];
	var alias;
	var start = parser.pos;

	parser.allowWhitespace();

	alias = readAlias( parser );

	if ( alias ) {
		alias.x = refineExpression( alias.x, {} );
		aliases.push( alias );

		parser.allowWhitespace();

		while ( parser.matchString(',') ) {
			alias = readAlias( parser );

			if ( !alias ) {
				parser.error( 'Expected another alias.' );
			}

			alias.x = refineExpression( alias.x, {} );
			aliases.push( alias );

			parser.allowWhitespace();
		}

		return aliases;
	}

	parser.pos = start;
	return null;
}

function readAlias( parser ) {
	var start = parser.pos;

	parser.allowWhitespace();

	var expr = readExpression( parser, [] );

	if ( !expr ) {
		parser.pos = start;
		return null;
	}

	parser.allowWhitespace();

	if ( !parser.matchPattern( asRE ) ) {
		parser.pos = start;
		return null;
	}

	parser.allowWhitespace();

	var alias = parser.matchPattern( legalAlias );

	if ( !alias ) {
		parser.error( 'Expected a legal alias name.' );
	}

	return { n: alias, x: expr };
}

function readPartial ( parser, tag ) {
	var type = parser.matchString( '>' ) || parser.matchString( 'yield' );
	var partial = { t: type === '>' ? PARTIAL : YIELDER };
	var aliases;

	if ( !type ) { return null; }

	parser.allowWhitespace();

	if ( type === '>' || !( aliases = parser.matchString( 'with' ) ) ) {
		// Partial names can include hyphens, so we can't use readExpression
		// blindly. Instead, we use the `relaxedNames` flag to indicate that
		// `foo-bar` should be read as a single name, rather than 'subtract
		// bar from foo'
		parser.relaxedNames = parser.strictRefinement = true;
		var expression = readExpression( parser );
		parser.relaxedNames = parser.strictRefinement = false;

		if ( !expression && type === '>' ) { return null; }

		if ( expression ) {
			refineExpression( expression, partial ); // TODO...
			parser.allowWhitespace();
			if ( type !== '>' ) { aliases = parser.matchString( 'with' ); }
		}
	}

	parser.allowWhitespace();

	// check for alias context e.g. `{{>foo bar as bat, bip as bop}}`
	if ( aliases || type === '>' ) {
		aliases = readAliases( parser );
		if ( aliases && aliases.length ) {
			partial.z = aliases;
		}

		// otherwise check for literal context e.g. `{{>foo bar}}` then
		// turn it into `{{#with bar}}{{>foo}}{{/with}}`
		else if ( type === '>' ) {
			var context = readExpression( parser );
			if ( context) {
				partial.c = {};
				refineExpression( context, partial.c );
			}
		}

		else {
			// {{yield with}} requires some aliases
			parser.error( "Expected one or more aliases" );
		}
	}

	parser.allowWhitespace();

	if ( !parser.matchString( tag.close ) ) {
		parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
	}

	return partial;
}

function readComment ( parser, tag ) {
	if ( !parser.matchString( '!' ) ) {
		return null;
	}

	var index = parser.remaining().indexOf( tag.close );

	if ( index !== -1 ) {
		parser.pos += index + tag.close.length;
		return { t: COMMENT };
	}
}

function readInterpolator ( parser, tag ) {
	var expression, err;

	var start = parser.pos;

	// TODO would be good for perf if we could do away with the try-catch
	try {
		expression = readExpressionOrReference( parser, [ tag.close ] );
	} catch ( e ) {
		err = e;
	}

	if ( !expression ) {
		if ( parser.str.charAt( start ) === '!' ) {
			// special case - comment
			parser.pos = start;
			return null;
		}

		if ( err ) {
			throw err;
		}
	}

	if ( !parser.matchString( tag.close ) ) {
		parser.error( ("Expected closing delimiter '" + (tag.close) + "' after reference") );

		if ( !expression ) {
			// special case - comment
			if ( parser.nextChar() === '!' ) {
				return null;
			}

			parser.error( "Expected expression or legal reference" );
		}
	}

	var interpolator = { t: INTERPOLATOR };
	refineExpression( expression, interpolator ); // TODO handle this differently - it's mysterious

	return interpolator;
}

function readClosing ( parser, tag ) {
	var start = parser.pos;

	if ( !parser.matchString( tag.open ) ) {
		return null;
	}

	parser.allowWhitespace();

	if ( !parser.matchString( '/' ) ) {
		parser.pos = start;
		return null;
	}

	parser.allowWhitespace();

	var remaining = parser.remaining();
	var index = remaining.indexOf( tag.close );

	if ( index !== -1 ) {
		var closing = {
			t: CLOSING,
			r: remaining.substr( 0, index ).split( ' ' )[0]
		};

		parser.pos += index;

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
		}

		return closing;
	}

	parser.pos = start;
	return null;
}

var elsePattern = /^\s*else\s*/;

function readElse ( parser, tag ) {
	var start = parser.pos;

	if ( !parser.matchString( tag.open ) ) {
		return null;
	}

	if ( !parser.matchPattern( elsePattern ) ) {
		parser.pos = start;
		return null;
	}

	if ( !parser.matchString( tag.close ) ) {
		parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
	}

	return {
		t: ELSE
	};
}

var elsePattern$1 = /^\s*elseif\s+/;

function readElseIf ( parser, tag ) {
	var start = parser.pos;

	if ( !parser.matchString( tag.open ) ) {
		return null;
	}

	if ( !parser.matchPattern( elsePattern$1 ) ) {
		parser.pos = start;
		return null;
	}

	var expression = readExpression( parser );

	if ( !parser.matchString( tag.close ) ) {
		parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
	}

	return {
		t: ELSEIF,
		x: expression
	};
}

var handlebarsBlockCodes = {
	each:    SECTION_EACH,
	if:      SECTION_IF,
	with:    SECTION_IF_WITH,
	unless:  SECTION_UNLESS
};

var indexRefPattern = /^\s*:\s*([a-zA-Z_$][a-zA-Z_$0-9]*)/;
var keyIndexRefPattern = /^\s*,\s*([a-zA-Z_$][a-zA-Z_$0-9]*)/;
var handlebarsBlockPattern = new RegExp( '^(' + Object.keys( handlebarsBlockCodes ).join( '|' ) + ')\\b' );

function readSection ( parser, tag ) {
	var expression, section, child, children, hasElse, block, unlessBlock, closed, i, expectedClose;
	var aliasOnly = false;

	var start = parser.pos;

	if ( parser.matchString( '^' ) ) {
		// watch out for parent context refs - {{^^/^^/foo}}
		if ( parser.matchString( '^/' ) ){
			parser.pos = start;
			return null;
		}
		section = { t: SECTION, f: [], n: SECTION_UNLESS };
	} else if ( parser.matchString( '#' ) ) {
		section = { t: SECTION, f: [] };

		if ( parser.matchString( 'partial' ) ) {
			parser.pos = start - parser.standardDelimiters[0].length;
			parser.error( 'Partial definitions can only be at the top level of the template, or immediately inside components' );
		}

		if ( block = parser.matchPattern( handlebarsBlockPattern ) ) {
			expectedClose = block;
			section.n = handlebarsBlockCodes[ block ];
		}
	} else {
		return null;
	}

	parser.allowWhitespace();

	if ( block === 'with' ) {
		var aliases = readAliases( parser );
		if ( aliases ) {
			aliasOnly = true;
			section.z = aliases;
			section.t = ALIAS;
		}
	} else if ( block === 'each' ) {
		var alias = readAlias( parser );
		if ( alias ) {
			section.z = [ { n: alias.n, x: { r: '.' } } ];
			expression = alias.x;
		}
	}

	if ( !aliasOnly ) {
		if ( !expression ) { expression = readExpression( parser ); }

		if ( !expression ) {
			parser.error( 'Expected expression' );
		}

		// optional index and key references
		if ( i = parser.matchPattern( indexRefPattern ) ) {
			var extra;

			if ( extra = parser.matchPattern( keyIndexRefPattern ) ) {
				section.i = i + ',' + extra;
			} else {
				section.i = i;
			}
		}

		if ( !block && expression.n ) {
			expectedClose = expression.n;
		}
	}

	parser.allowWhitespace();

	if ( !parser.matchString( tag.close ) ) {
		parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
	}

	parser.sectionDepth += 1;
	children = section.f;

	var pos;
	do {
		pos = parser.pos;
		if ( child = readClosing( parser, tag ) ) {
			if ( expectedClose && child.r !== expectedClose ) {
				if ( !block ) {
					if ( child.r ) { parser.warn( ("Expected " + (tag.open) + "/" + expectedClose + (tag.close) + " but found " + (tag.open) + "/" + (child.r) + (tag.close)) ); }
				} else {
					parser.pos = pos;
					parser.error( ("Expected " + (tag.open) + "/" + expectedClose + (tag.close)) );
				}
			}

			parser.sectionDepth -= 1;
			closed = true;
		}

		else if ( !aliasOnly && ( child = readElseIf( parser, tag ) ) ) {
			if ( section.n === SECTION_UNLESS ) {
				parser.error( '{{else}} not allowed in {{#unless}}' );
			}

			if ( hasElse ) {
				parser.error( 'illegal {{elseif...}} after {{else}}' );
			}

			if ( !unlessBlock ) {
				unlessBlock = [];
			}

			var mustache = {
				t: SECTION,
				n: SECTION_IF,
				f: children = []
			};
			refineExpression( child.x, mustache );

			unlessBlock.push( mustache );
		}

		else if ( !aliasOnly && ( child = readElse( parser, tag ) ) ) {
			if ( section.n === SECTION_UNLESS ) {
				parser.error( '{{else}} not allowed in {{#unless}}' );
			}

			if ( hasElse ) {
				parser.error( 'there can only be one {{else}} block, at the end of a section' );
			}

			hasElse = true;

			// use an unless block if there's no elseif
			if ( !unlessBlock ) {
				unlessBlock = [];
			}

			unlessBlock.push({
				t: SECTION,
				n: SECTION_UNLESS,
				f: children = []
			});
		}

		else {
			child = parser.read( READERS );

			if ( !child ) {
				break;
			}

			children.push( child );
		}
	} while ( !closed );

	if ( unlessBlock ) {
		section.l = unlessBlock;
	}

	if ( !aliasOnly ) {
		refineExpression( expression, section );
	}

	// TODO if a section is empty it should be discarded. Don't do
	// that here though - we need to clean everything up first, as
	// it may contain removeable whitespace. As a temporary measure,
	// to pass the existing tests, remove empty `f` arrays
	if ( !section.f.length ) {
		delete section.f;
	}

	return section;
}

var OPEN_COMMENT = '<!--';
var CLOSE_COMMENT = '-->';

function readHtmlComment ( parser ) {
	var start = parser.pos;

	if ( parser.textOnlyMode || !parser.matchString( OPEN_COMMENT ) ) {
		return null;
	}

	var remaining = parser.remaining();
	var endIndex = remaining.indexOf( CLOSE_COMMENT );

	if ( endIndex === -1 ) {
		parser.error( 'Illegal HTML - expected closing comment sequence (\'-->\')' );
	}

	var content = remaining.substr( 0, endIndex );
	parser.pos += endIndex + 3;

	var comment = {
		t: COMMENT,
		c: content
	};

	if ( parser.includeLinePositions ) {
		comment.p = parser.getLinePos( start );
	}

	return comment;
}

var leadingLinebreak = /^[ \t\f\r\n]*\r?\n/;
var trailingLinebreak = /\r?\n[ \t\f\r\n]*$/;

var stripStandalones = function ( items ) {
	var i, current, backOne, backTwo, lastSectionItem;

	for ( i=1; i<items.length; i+=1 ) {
		current = items[i];
		backOne = items[i-1];
		backTwo = items[i-2];

		// if we're at the end of a [text][comment][text] sequence...
		if ( isString( current ) && isComment( backOne ) && isString( backTwo ) ) {

			// ... and the comment is a standalone (i.e. line breaks either side)...
			if ( trailingLinebreak.test( backTwo ) && leadingLinebreak.test( current ) ) {

				// ... then we want to remove the whitespace after the first line break
				items[i-2] = backTwo.replace( trailingLinebreak, '\n' );

				// and the leading line break of the second text token
				items[i] = current.replace( leadingLinebreak, '' );
			}
		}

		// if the current item is a section, and it is preceded by a linebreak, and
		// its first item is a linebreak...
		if ( isSection( current ) && isString( backOne ) ) {
			if ( trailingLinebreak.test( backOne ) && isString( current.f[0] ) && leadingLinebreak.test( current.f[0] ) ) {
				items[i-1] = backOne.replace( trailingLinebreak, '\n' );
				current.f[0] = current.f[0].replace( leadingLinebreak, '' );
			}
		}

		// if the last item was a section, and it is followed by a linebreak, and
		// its last item is a linebreak...
		if ( isString( current ) && isSection( backOne ) ) {
			lastSectionItem = lastItem( backOne.f );

			if ( isString( lastSectionItem ) && trailingLinebreak.test( lastSectionItem ) && leadingLinebreak.test( current ) ) {
				backOne.f[ backOne.f.length - 1 ] = lastSectionItem.replace( trailingLinebreak, '\n' );
				items[i] = current.replace( leadingLinebreak, '' );
			}
		}
	}

	return items;
};

function isString ( item ) {
	return typeof item === 'string';
}

function isComment ( item ) {
	return item.t === COMMENT || item.t === DELIMCHANGE;
}

function isSection ( item ) {
	return ( item.t === SECTION || item.t === INVERTED ) && item.f;
}

var trimWhitespace = function ( items, leadingPattern, trailingPattern ) {
	var item;

	if ( leadingPattern ) {
		item = items[0];
		if ( typeof item === 'string' ) {
			item = item.replace( leadingPattern, '' );

			if ( !item ) {
				items.shift();
			} else {
				items[0] = item;
			}
		}
	}

	if ( trailingPattern ) {
		item = lastItem( items );
		if ( typeof item === 'string' ) {
			item = item.replace( trailingPattern, '' );

			if ( !item ) {
				items.pop();
			} else {
				items[ items.length - 1 ] = item;
			}
		}
	}
};

var contiguousWhitespace = /[ \t\f\r\n]+/g;
var preserveWhitespaceElements = /^(?:pre|script|style|textarea)$/i;
var leadingWhitespace$1 = /^[ \t\f\r\n]+/;
var trailingWhitespace = /[ \t\f\r\n]+$/;
var leadingNewLine = /^(?:\r\n|\r|\n)/;
var trailingNewLine = /(?:\r\n|\r|\n)$/;

function cleanup ( items, stripComments, preserveWhitespace, removeLeadingWhitespace, removeTrailingWhitespace ) {
	if ( typeof items === 'string' ) { return; }

	var i,
		item,
		previousItem,
		nextItem,
		preserveWhitespaceInsideFragment,
		removeLeadingWhitespaceInsideFragment,
		removeTrailingWhitespaceInsideFragment;

	// First pass - remove standalones and comments etc
	stripStandalones( items );

	i = items.length;
	while ( i-- ) {
		item = items[i];

		// Remove delimiter changes, unsafe elements etc
		if ( item.exclude ) {
			items.splice( i, 1 );
		}

		// Remove comments, unless we want to keep them
		else if ( stripComments && item.t === COMMENT ) {
			items.splice( i, 1 );
		}
	}

	// If necessary, remove leading and trailing whitespace
	trimWhitespace( items, removeLeadingWhitespace ? leadingWhitespace$1 : null, removeTrailingWhitespace ? trailingWhitespace : null );

	i = items.length;
	while ( i-- ) {
		item = items[i];

		// Recurse
		if ( item.f ) {
			var isPreserveWhitespaceElement = item.t === ELEMENT && preserveWhitespaceElements.test( item.e );
			preserveWhitespaceInsideFragment = preserveWhitespace || isPreserveWhitespaceElement;

			if ( !preserveWhitespace && isPreserveWhitespaceElement ) {
				trimWhitespace( item.f, leadingNewLine, trailingNewLine );
			}

			if ( !preserveWhitespaceInsideFragment ) {
				previousItem = items[ i - 1 ];
				nextItem = items[ i + 1 ];

				// if the previous item was a text item with trailing whitespace,
				// remove leading whitespace inside the fragment
				if ( !previousItem || ( typeof previousItem === 'string' && trailingWhitespace.test( previousItem ) ) ) {
					removeLeadingWhitespaceInsideFragment = true;
				}

				// and vice versa
				if ( !nextItem || ( typeof nextItem === 'string' && leadingWhitespace$1.test( nextItem ) ) ) {
					removeTrailingWhitespaceInsideFragment = true;
				}
			}

			cleanup( item.f, stripComments, preserveWhitespaceInsideFragment, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment );
		}

		// Split if-else blocks into two (an if, and an unless)
		if ( item.l ) {
			cleanup( item.l, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment );

			item.l.forEach( function (s) { return s.l = 1; } );
			item.l.unshift( i + 1, 0 );
			items.splice.apply( items, item.l );
			delete item.l; // TODO would be nice if there was a way around this
		}

		// Clean up conditional attributes
		if ( item.m ) {
			cleanup( item.m, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment );
			if ( item.m.length < 1 ) { delete item.m; }
		}
	}

	// final pass - fuse text nodes together
	i = items.length;
	while ( i-- ) {
		if ( typeof items[i] === 'string' ) {
			if ( typeof items[i+1] === 'string' ) {
				items[i] = items[i] + items[i+1];
				items.splice( i + 1, 1 );
			}

			if ( !preserveWhitespace ) {
				items[i] = items[i].replace( contiguousWhitespace, ' ' );
			}

			if ( items[i] === '' ) {
				items.splice( i, 1 );
			}
		}
	}
}

var closingTagPattern = /^([a-zA-Z]{1,}:?[a-zA-Z0-9\-]*)\s*\>/;

function readClosingTag ( parser ) {
	var tag;

	var start = parser.pos;

	// are we looking at a closing tag?
	if ( !parser.matchString( '</' ) ) {
		return null;
	}

	if ( tag = parser.matchPattern( closingTagPattern ) ) {
		if ( parser.inside && tag !== parser.inside ) {
			parser.pos = start;
			return null;
		}

		return {
			t: CLOSING_TAG,
			e: tag
		};
	}

	// We have an illegal closing tag, report it
	parser.pos -= 2;
	parser.error( 'Illegal closing tag' );
}

var tagNamePattern = /^[a-zA-Z]{1,}:?[a-zA-Z0-9\-]*/;
var anchorPattern = /^[a-zA-Z_$][-a-zA-Z0-9_$]*/;
var validTagNameFollower = /^[\s\n\/>]/;
var exclude = { exclude: true };

// based on http://developers.whatwg.org/syntax.html#syntax-tag-omission
var disallowedContents = {
	li: [ 'li' ],
	dt: [ 'dt', 'dd' ],
	dd: [ 'dt', 'dd' ],
	p: 'address article aside blockquote div dl fieldset footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol p pre section table ul'.split( ' ' ),
	rt: [ 'rt', 'rp' ],
	rp: [ 'rt', 'rp' ],
	optgroup: [ 'optgroup' ],
	option: [ 'option', 'optgroup' ],
	thead: [ 'tbody', 'tfoot' ],
	tbody: [ 'tbody', 'tfoot' ],
	tfoot: [ 'tbody' ],
	tr: [ 'tr', 'tbody' ],
	td: [ 'td', 'th', 'tr' ],
	th: [ 'td', 'th', 'tr' ]
};

function readElement$1 ( parser ) {
	var attribute, selfClosing, children, partials, hasPartials, child, closed, pos, remaining, closingTag, anchor;

	var start = parser.pos;

	if ( parser.inside || parser.inAttribute || parser.textOnlyMode ) {
		return null;
	}

	if ( !parser.matchString( '<' ) ) {
		return null;
	}

	// if this is a closing tag, abort straight away
	if ( parser.nextChar() === '/' ) {
		return null;
	}

	var element = {};
	if ( parser.includeLinePositions ) {
		element.p = parser.getLinePos( start );
	}

	// check for doctype decl
	if ( parser.matchString( '!' ) ) {
		element.t = DOCTYPE;
		if ( !parser.matchPattern( /^doctype/i ) ) {
			parser.error( 'Expected DOCTYPE declaration' );
		}

		element.a = parser.matchPattern( /^(.+?)>/ );
		return element;
	}
	// check for anchor
	else if ( anchor = parser.matchString( '#' ) ) {
		parser.allowWhitespace();
		element.t = ANCHOR;
		element.n = parser.matchPattern( anchorPattern );
	}
	// otherwise, it's an element/component
	else {
		element.t = ELEMENT;

		// element name
		element.e = parser.matchPattern( tagNamePattern );
		if ( !element.e ) {
			return null;
		}
	}

	// next character must be whitespace, closing solidus or '>'
	if ( !validTagNameFollower.test( parser.nextChar() ) ) {
		parser.error( 'Illegal tag name' );
	}

	parser.allowWhitespace();

	parser.inTag = true;

	// directives and attributes
	while ( attribute = readMustache( parser ) ) {
		if ( attribute !== false ) {
			if ( !element.m ) { element.m = []; }
			element.m.push( attribute );
		}

		parser.allowWhitespace();
	}

	parser.inTag = false;

	// allow whitespace before closing solidus
	parser.allowWhitespace();

	// self-closing solidus?
	if ( parser.matchString( '/' ) ) {
		selfClosing = true;
	}

	// closing angle bracket
	if ( !parser.matchString( '>' ) ) {
		return null;
	}

	var lowerCaseName = ( element.e || element.n ).toLowerCase();
	var preserveWhitespace = parser.preserveWhitespace;

	if ( !selfClosing && ( anchor || !voidElementNames.test( element.e ) ) ) {
		if ( !anchor ) {
			parser.elementStack.push( lowerCaseName );

			// Special case - if we open a script element, further tags should
			// be ignored unless they're a closing script element
			if ( lowerCaseName in parser.interpolate ) {
				parser.inside = lowerCaseName;
			}
		}

		children = [];
		partials = Object.create( null );

		do {
			pos = parser.pos;
			remaining = parser.remaining();

			if ( !remaining ) {
				parser.error( ("Missing end " + (parser.elementStack.length > 1 ? 'tags' : 'tag') + " (" + (parser.elementStack.reverse().map( function (x) { return ("</" + x + ">"); } ).join( '' )) + ")") );
			}

			// if for example we're in an <li> element, and we see another
			// <li> tag, close the first so they become siblings
			if ( !anchor && !canContain( lowerCaseName, remaining ) ) {
				closed = true;
			}

			// closing tag
			else if ( !anchor && ( closingTag = readClosingTag( parser ) ) ) {
				closed = true;

				var closingTagName = closingTag.e.toLowerCase();

				// if this *isn't* the closing tag for the current element...
				if ( closingTagName !== lowerCaseName ) {
					// rewind parser
					parser.pos = pos;

					// if it doesn't close a parent tag, error
					if ( !~parser.elementStack.indexOf( closingTagName ) ) {
						var errorMessage = 'Unexpected closing tag';

						// add additional help for void elements, since component names
						// might clash with them
						if ( voidElementNames.test( closingTagName ) ) {
							errorMessage += " (<" + closingTagName + "> is a void element - it cannot contain children)";
						}

						parser.error( errorMessage );
					}
				}
			}

			else if ( anchor && readAnchorClose( parser, element.n ) ) {
				closed = true;
			}

			// implicit close by closing section tag. TODO clean this up
			else if ( child = readClosing( parser, { open: parser.standardDelimiters[0], close: parser.standardDelimiters[1] } ) ) {
				closed = true;
				parser.pos = pos;
			}

			else {
				if ( child = parser.read( PARTIAL_READERS ) ) {
					if ( partials[ child.n ] ) {
						parser.pos = pos;
						parser.error( 'Duplicate partial definition' );
					}

					cleanup( child.f, parser.stripComments, preserveWhitespace, !preserveWhitespace, !preserveWhitespace );

					partials[ child.n ] = child.f;
					hasPartials = true;
				}

				else {
					if ( child = parser.read( READERS ) ) {
						children.push( child );
					} else {
						closed = true;
					}
				}
			}
		} while ( !closed );

		if ( children.length ) {
			element.f = children;
		}

		if ( hasPartials ) {
			element.p = partials;
		}

		parser.elementStack.pop();
	}

	parser.inside = null;

	if ( parser.sanitizeElements && parser.sanitizeElements.indexOf( lowerCaseName ) !== -1 ) {
		return exclude;
	}

	return element;
}

function canContain ( name, remaining ) {
	var match = /^<([a-zA-Z][a-zA-Z0-9]*)/.exec( remaining );
	var disallowed = disallowedContents[ name ];

	if ( !match || !disallowed ) {
		return true;
	}

	return !~disallowed.indexOf( match[1].toLowerCase() );
}

function readAnchorClose ( parser, name ) {
	var pos = parser.pos;
	if ( !parser.matchString( '</' ) ) {
		return null;
	}

	parser.matchString( '#' );
	parser.allowWhitespace();

	if ( !parser.matchString( name ) ) {
		parser.pos = pos;
		return null;
	}

	parser.allowWhitespace();

	if ( !parser.matchString( '>' ) ) {
		parser.pos = pos;
		return null;
	}

	return true;
}

function readText ( parser ) {
	var index, disallowed, barrier;

	var remaining = parser.remaining();

	if ( parser.textOnlyMode ) {
		disallowed = parser.tags.map( function (t) { return t.open; } );
		disallowed = disallowed.concat( parser.tags.map( function (t) { return '\\' + t.open; } ) );

		index = getLowestIndex( remaining, disallowed );
	} else {
		barrier = parser.inside ? '</' + parser.inside : '<';

		if ( parser.inside && !parser.interpolate[ parser.inside ] ) {
			index = remaining.indexOf( barrier );
		} else {
			disallowed = parser.tags.map( function (t) { return t.open; } );
			disallowed = disallowed.concat( parser.tags.map( function (t) { return '\\' + t.open; } ) );

			// http://developers.whatwg.org/syntax.html#syntax-attributes
			if ( parser.inAttribute === true ) {
				// we're inside an unquoted attribute value
				disallowed.push( "\"", "'", "=", "<", ">", '`' );
			} else if ( parser.inAttribute ) {
				// quoted attribute value
				disallowed.push( parser.inAttribute );
			} else {
				disallowed.push( barrier );
			}

			index = getLowestIndex( remaining, disallowed );
		}
	}

	if ( !index ) {
		return null;
	}

	if ( index === -1 ) {
		index = remaining.length;
	}

	parser.pos += index;

	if ( ( parser.inside && parser.inside !== 'textarea' ) || parser.textOnlyMode ) {
		return remaining.substr( 0, index );
	} else {
		return decodeCharacterReferences( remaining.substr( 0, index ) );
	}
}

var partialDefinitionSectionPattern = /^\s*#\s*partial\s+/;

function readPartialDefinitionSection ( parser ) {
	var child, closed;

	var start = parser.pos;

	var delimiters = parser.standardDelimiters;

	if ( !parser.matchString( delimiters[0] ) ) {
		return null;
	}

	if ( !parser.matchPattern( partialDefinitionSectionPattern ) ) {
		parser.pos = start;
		return null;
	}

	var name = parser.matchPattern( /^[a-zA-Z_$][a-zA-Z_$0-9\-\/]*/ );

	if ( !name ) {
		parser.error( 'expected legal partial name' );
	}

	parser.allowWhitespace();
	if ( !parser.matchString( delimiters[1] ) ) {
		parser.error( ("Expected closing delimiter '" + (delimiters[1]) + "'") );
	}

	var content = [];

	var open = delimiters[0];
	var close = delimiters[1];

	do {
		if ( child = readClosing( parser, { open: open, close: close }) ) {
			if ( child.r !== 'partial' ) {
				parser.error( ("Expected " + open + "/partial" + close) );
			}

			closed = true;
		}

		else {
			child = parser.read( READERS );

			if ( !child ) {
				parser.error( ("Expected " + open + "/partial" + close) );
			}

			content.push( child );
		}
	} while ( !closed );

	return {
		t: INLINE_PARTIAL,
		n: name,
		f: content
	};
}

function readTemplate ( parser ) {
	var fragment = [];
	var partials = Object.create( null );
	var hasPartials = false;

	var preserveWhitespace = parser.preserveWhitespace;

	while ( parser.pos < parser.str.length ) {
		var pos = parser.pos;
		var item = (void 0), partial = (void 0);

		if ( partial = parser.read( PARTIAL_READERS ) ) {
			if ( partials[ partial.n ] ) {
				parser.pos = pos;
				parser.error( 'Duplicated partial definition' );
			}

			cleanup( partial.f, parser.stripComments, preserveWhitespace, !preserveWhitespace, !preserveWhitespace );

			partials[ partial.n ] = partial.f;
			hasPartials = true;
		} else if ( item = parser.read( READERS ) ) {
			fragment.push( item );
		} else  {
			parser.error( 'Unexpected template content' );
		}
	}

	var result = {
		v: TEMPLATE_VERSION,
		t: fragment
	};

	if ( hasPartials ) {
		result.p = partials;
	}

	return result;
}

function insertExpressions ( obj, expr ) {

	Object.keys( obj ).forEach( function (key) {
		if  ( isExpression( key, obj ) ) { return addTo( obj, expr ); }

		var ref = obj[ key ];
		if ( hasChildren( ref ) ) { insertExpressions( ref, expr ); }
	});
}

function isExpression( key, obj ) {
	return key === 's' && Array.isArray( obj.r );
}

function addTo( obj, expr ) {
	var s = obj.s;
	var r = obj.r;
	if ( !expr[ s ] ) { expr[ s ] = fromExpression( s, r.length ); }
}

function hasChildren( ref ) {
	return Array.isArray( ref ) || isObject( ref );
}

var shared = {};

// See https://github.com/ractivejs/template-spec for information
// about the Ractive template specification

var STANDARD_READERS = [ readPartial, readUnescaped, readSection, readInterpolator, readComment ];
var TRIPLE_READERS = [ readTriple ];
var STATIC_READERS = [ readUnescaped, readSection, readInterpolator ]; // TODO does it make sense to have a static section?

var READERS = [ readMustache, readHtmlComment, readElement$1, readText ];
var PARTIAL_READERS = [ readPartialDefinitionSection ];

var defaultInterpolate = [ 'script', 'style', 'template' ];

var StandardParser = Parser.extend({
	init: function init ( str, options ) {
		var this$1 = this;

		var tripleDelimiters = options.tripleDelimiters || shared.defaults.tripleDelimiters;
		var staticDelimiters = options.staticDelimiters || shared.defaults.staticDelimiters;
		var staticTripleDelimiters = options.staticTripleDelimiters || shared.defaults.staticTripleDelimiters;

		this.standardDelimiters = options.delimiters || shared.defaults.delimiters;

		this.tags = [
			{ isStatic: false, isTriple: false, open: this.standardDelimiters[0], close: this.standardDelimiters[1], readers: STANDARD_READERS },
			{ isStatic: false, isTriple: true,  open: tripleDelimiters[0],        close: tripleDelimiters[1],        readers: TRIPLE_READERS },
			{ isStatic: true,  isTriple: false, open: staticDelimiters[0],        close: staticDelimiters[1],        readers: STATIC_READERS },
			{ isStatic: true,  isTriple: true,  open: staticTripleDelimiters[0],  close: staticTripleDelimiters[1],  readers: TRIPLE_READERS }
		];

		this.contextLines = options.contextLines || shared.defaults.contextLines;

		this.sortMustacheTags();

		this.sectionDepth = 0;
		this.elementStack = [];

		this.interpolate = Object.create( options.interpolate || shared.defaults.interpolate || {} );
		this.interpolate.textarea = true;
		defaultInterpolate.forEach( function (t) { return this$1.interpolate[ t ] = !options.interpolate || options.interpolate[ t ] !== false; } );

		if ( options.sanitize === true ) {
			options.sanitize = {
				// blacklist from https://code.google.com/p/google-caja/source/browse/trunk/src/com/google/caja/lang/html/html4-elements-whitelist.json
				elements: 'applet base basefont body frame frameset head html isindex link meta noframes noscript object param script style title'.split( ' ' ),
				eventAttributes: true
			};
		}

		this.stripComments = options.stripComments !== false;
		this.preserveWhitespace = options.preserveWhitespace;
		this.sanitizeElements = options.sanitize && options.sanitize.elements;
		this.sanitizeEventAttributes = options.sanitize && options.sanitize.eventAttributes;
		this.includeLinePositions = options.includeLinePositions;
		this.textOnlyMode = options.textOnlyMode;
		this.csp = options.csp;

		this.transforms = options.transforms || options.parserTransforms;
		if ( this.transforms ) {
			this.transforms = this.transforms.concat( shared.defaults.parserTransforms );
		} else {
			this.transforms = shared.defaults.parserTransforms;
		}
	},

	postProcess: function postProcess ( result ) {
		// special case - empty string
		if ( !result.length ) {
			return { t: [], v: TEMPLATE_VERSION };
		}

		if ( this.sectionDepth > 0 ) {
			this.error( 'A section was left open' );
		}

		cleanup( result[0].t, this.stripComments, this.preserveWhitespace, !this.preserveWhitespace, !this.preserveWhitespace );

		var transforms = this.transforms;
		if ( transforms.length ) {
			var tlen = transforms.length;
			var walk = function ( fragment ) {
				var len = fragment.length;

				for ( var i = 0; i < len; i++ ) {
					var node = fragment[i];

					if ( node.t === ELEMENT ) {
						for ( var j = 0; j < tlen; j++ ) {
							var res = transforms[j].call( shared.Ractive, node );
							if ( !res ) {
								continue;
							} else if ( res.remove ) {
								fragment.splice( i--, 1 );
								len--;
								break;
							} else if ( res.replace ) {
								if ( Array.isArray( res.replace ) ) {
									fragment.splice.apply( fragment, [ i--, 1 ].concat( res.replace ) );
									len += res.replace.length - 1;
								} else {
									fragment[i--] = node = res.replace;
								}

								break;
							}
						}

						// watch for partials
						if ( node.p ) {
							for ( var k in node.p ) { walk( node.p[k] ); }
						}
					}

					if ( node.f ) { walk( node.f ); }
				}
			};

			// process the root fragment
			walk( result[0].t );

			// watch for root partials
			if ( result[0].p ) {
				for ( var k in result[0].p ) { walk( result[0].p[k] ); }
			}
		}

		if ( this.csp !== false ) {
			var expr = {};
			insertExpressions( result[0].t, expr );
			if ( Object.keys( expr ).length ) { result[0].e = expr; }
		}

		return result[0];
	},

	converters: [
		readTemplate
	],

	sortMustacheTags: function sortMustacheTags () {
		// Sort in order of descending opening delimiter length (longer first),
		// to protect against opening delimiters being substrings of each other
		this.tags.sort( function ( a, b ) {
			return b.open.length - a.open.length;
		});
	}
});

function parse ( template, options ) {
	return new StandardParser( template, options || {} ).result;
}

var parseOptions = [
	'delimiters',
	'tripleDelimiters',
	'staticDelimiters',
	'staticTripleDelimiters',
	'csp',
	'interpolate',
	'preserveWhitespace',
	'sanitize',
	'stripComments',
	'contextLines'
];

var TEMPLATE_INSTRUCTIONS = "Either preparse or use a ractive runtime source that includes the parser. ";

var COMPUTATION_INSTRUCTIONS = "Either include a version of Ractive that can parse or convert your computation strings to functions.";


function throwNoParse ( method, error, instructions ) {
	if ( !method ) {
		fatal( ("Missing Ractive.parse - cannot parse " + error + ". " + instructions) );
	}
}

function createFunction ( body, length ) {
	throwNoParse( fromExpression, 'new expression function', TEMPLATE_INSTRUCTIONS );
	return fromExpression( body, length );
}

function createFunctionFromString ( str, bindTo ) {
	throwNoParse( fromComputationString, 'compution string "${str}"', COMPUTATION_INSTRUCTIONS );
	return fromComputationString( str, bindTo );
}

var parser = {

	fromId: function fromId ( id, options ) {
		if ( !doc ) {
			if ( options && options.noThrow ) { return; }
			throw new Error( ("Cannot retrieve template #" + id + " as Ractive is not running in a browser.") );
		}

		if ( id ) { id = id.replace( /^#/, '' ); }

		var template;

		if ( !( template = doc.getElementById( id ) )) {
			if ( options && options.noThrow ) { return; }
			throw new Error( ("Could not find template element with id #" + id) );
		}

		if ( template.tagName.toUpperCase() !== 'SCRIPT' ) {
			if ( options && options.noThrow ) { return; }
			throw new Error( ("Template element with id #" + id + ", must be a <script> element") );
		}

		return ( 'textContent' in template ? template.textContent : template.innerHTML );

	},

	isParsed: function isParsed ( template) {
		return !( typeof template === 'string' );
	},

	getParseOptions: function getParseOptions ( ractive ) {
		// Could be Ractive or a Component
		if ( ractive.defaults ) { ractive = ractive.defaults; }

		return parseOptions.reduce( function ( val, key ) {
			val[ key ] = ractive[ key ];
			return val;
		}, {});
	},

	parse: function parse$1 ( template, options ) {
		throwNoParse( parse, 'template', TEMPLATE_INSTRUCTIONS );
		var parsed = parse( template, options );
		addFunctions( parsed );
		return parsed;
	},

	parseFor: function parseFor( template, ractive ) {
		return this.parse( template, this.getParseOptions( ractive ) );
	}
};

var templateConfigurator = {
	name: 'template',

	extend: function extend ( Parent, proto, options ) {
		// only assign if exists
		if ( 'template' in options ) {
			var template = options.template;

			if ( typeof template === 'function' ) {
				proto.template = template;
			} else {
				proto.template = parseTemplate( template, proto );
			}
		}
	},

	init: function init ( Parent, ractive, options ) {
		// TODO because of prototypal inheritance, we might just be able to use
		// ractive.template, and not bother passing through the Parent object.
		// At present that breaks the test mocks' expectations
		var template = 'template' in options ? options.template : Parent.prototype.template;
		template = template || { v: TEMPLATE_VERSION, t: [] };

		if ( typeof template === 'function' ) {
			var fn = template;
			template = getDynamicTemplate( ractive, fn );

			ractive._config.template = {
				fn: fn,
				result: template
			};
		}

		template = parseTemplate( template, ractive );

		// TODO the naming of this is confusing - ractive.template refers to [...],
		// but Component.prototype.template refers to {v:1,t:[],p:[]}...
		// it's unnecessary, because the developer never needs to access
		// ractive.template
		ractive.template = template.t;

		if ( template.p ) {
			extendPartials( ractive.partials, template.p );
		}
	},

	reset: function reset ( ractive ) {
		var result = resetValue( ractive );

		if ( result ) {
			var parsed = parseTemplate( result, ractive );

			ractive.template = parsed.t;
			extendPartials( ractive.partials, parsed.p, true );

			return true;
		}
	}
};

function resetValue ( ractive ) {
	var initial = ractive._config.template;

	// If this isn't a dynamic template, there's nothing to do
	if ( !initial || !initial.fn ) {
		return;
	}

	var result = getDynamicTemplate( ractive, initial.fn );

	// TODO deep equality check to prevent unnecessary re-rendering
	// in the case of already-parsed templates
	if ( result !== initial.result ) {
		initial.result = result;
		return result;
	}
}

function getDynamicTemplate ( ractive, fn ) {
	return fn.call( ractive, {
		fromId: parser.fromId,
		isParsed: parser.isParsed,
		parse: function parse ( template, options ) {
			if ( options === void 0 ) options = parser.getParseOptions( ractive );

			return parser.parse( template, options );
		}
	});
}

function parseTemplate ( template, ractive ) {
	if ( typeof template === 'string' ) {
		// parse will validate and add expression functions
		template = parseAsString( template, ractive );
	}
	else {
		// need to validate and add exp for already parsed template
		validate$1( template );
		addFunctions( template );
	}

	return template;
}

function parseAsString ( template, ractive ) {
	// ID of an element containing the template?
	if ( template[0] === '#' ) {
		template = parser.fromId( template );
	}

	return parser.parseFor( template, ractive );
}

function validate$1( template ) {

	// Check that the template even exists
	if ( template == undefined ) {
		throw new Error( ("The template cannot be " + template + ".") );
	}

	// Check the parsed template has a version at all
	else if ( typeof template.v !== 'number' ) {
		throw new Error( 'The template parser was passed a non-string template, but the template doesn\'t have a version.  Make sure you\'re passing in the template you think you are.' );
	}

	// Check we're using the correct version
	else if ( template.v !== TEMPLATE_VERSION ) {
		throw new Error( ("Mismatched template version (expected " + TEMPLATE_VERSION + ", got " + (template.v) + ") Please ensure you are using the latest version of Ractive.js in your build process as well as in your app") );
	}
}

function extendPartials ( existingPartials, newPartials, overwrite ) {
	if ( !newPartials ) { return; }

	// TODO there's an ambiguity here - we need to overwrite in the `reset()`
	// case, but not initially...

	for ( var key in newPartials ) {
		if ( overwrite || !existingPartials.hasOwnProperty( key ) ) {
			existingPartials[ key ] = newPartials[ key ];
		}
	}
}

var registryNames = [
	'adaptors',
	'components',
	'computed',
	'decorators',
	'easing',
	'events',
	'interpolators',
	'partials',
	'transitions'
];

var registriesOnDefaults = [
	'computed'
];

var Registry = function Registry ( name, useDefaults ) {
	this.name = name;
	this.useDefaults = useDefaults;
};

Registry.prototype.extend = function extend ( Parent, proto, options ) {
	var parent = this.useDefaults ? Parent.defaults : Parent;
	var target = this.useDefaults ? proto : proto.constructor;
	this.configure( parent, target, options );
};

Registry.prototype.init = function init () {
	// noop
};

Registry.prototype.configure = function configure ( Parent, target, options ) {
	var name = this.name;
	var option = options[ name ];

	var registry = Object.create( Parent[name] );

	for ( var key in option ) {
		registry[ key ] = option[ key ];
	}

	target[ name ] = registry;
};

Registry.prototype.reset = function reset ( ractive ) {
	var registry = ractive[ this.name ];
	var changed = false;

	Object.keys( registry ).forEach( function (key) {
		var item = registry[ key ];

		if ( item._fn ) {
			if ( item._fn.isOwner ) {
				registry[key] = item._fn;
			} else {
				delete registry[key];
			}
			changed = true;
		}
	});

	return changed;
};

var registries = registryNames.map( function (name) {
	var putInDefaults = registriesOnDefaults.indexOf(name) > -1;
	return new Registry( name, putInDefaults );
});

function wrap ( parent, name, method ) {
	if ( !/_super/.test( method ) ) { return method; }

	function wrapper () {
		var superMethod = getSuperMethod( wrapper._parent, name );
		var hasSuper = '_super' in this;
		var oldSuper = this._super;

		this._super = superMethod;

		var result = method.apply( this, arguments );

		if ( hasSuper ) {
			this._super = oldSuper;
		} else {
			delete this._super;
		}

		return result;
	}

	wrapper._parent = parent;
	wrapper._method = method;

	return wrapper;
}

function getSuperMethod ( parent, name ) {
	if ( name in parent ) {
		var value = parent[ name ];

		return typeof value === 'function' ?
			value :
			function () { return value; };
	}

	return noop;
}

function getMessage( deprecated, correct, isError ) {
	return "options." + deprecated + " has been deprecated in favour of options." + correct + "."
		+ ( isError ? (" You cannot specify both options, please use options." + correct + ".") : '' );
}

function deprecateOption ( options, deprecatedOption, correct ) {
	if ( deprecatedOption in options ) {
		if( !( correct in options ) ) {
			warnIfDebug( getMessage( deprecatedOption, correct ) );
			options[ correct ] = options[ deprecatedOption ];
		} else {
			throw new Error( getMessage( deprecatedOption, correct, true ) );
		}
	}
}

function deprecate ( options ) {
	deprecateOption( options, 'beforeInit', 'onconstruct' );
	deprecateOption( options, 'init', 'onrender' );
	deprecateOption( options, 'complete', 'oncomplete' );
	deprecateOption( options, 'eventDefinitions', 'events' );

	// Using extend with Component instead of options,
	// like Human.extend( Spider ) means adaptors as a registry
	// gets copied to options. So we have to check if actually an array
	if ( Array.isArray( options.adaptors ) ) {
		deprecateOption( options, 'adaptors', 'adapt' );
	}
}

var custom = {
	adapt: adaptConfigurator,
	css: cssConfigurator,
	data: dataConfigurator,
	template: templateConfigurator
};

var defaultKeys = Object.keys( defaults );

var isStandardKey = makeObj( defaultKeys.filter( function (key) { return !custom[ key ]; } ) );

// blacklisted keys that we don't double extend
var isBlacklisted = makeObj( defaultKeys.concat( registries.map( function (r) { return r.name; } ), [ 'on', 'observe', 'attributes' ] ) );

var order = [].concat(
	defaultKeys.filter( function (key) { return !registries[ key ] && !custom[ key ]; } ),
	registries,
	//custom.data,
	custom.template,
	custom.css
);

var config = {
	extend: function ( Parent, proto$$1, options ) { return configure( 'extend', Parent, proto$$1, options ); },
	init: function ( Parent, ractive, options ) { return configure( 'init', Parent, ractive, options ); },
	reset: function (ractive) { return order.filter( function (c) { return c.reset && c.reset( ractive ); } ).map( function (c) { return c.name; } ); }
};

function configure ( method, Parent, target, options ) {
	deprecate( options );

	for ( var key in options ) {
		if ( isStandardKey.hasOwnProperty( key ) ) {
			var value = options[ key ];

			// warn the developer if they passed a function and ignore its value

			// NOTE: we allow some functions on "el" because we duck type element lists
			// and some libraries or ef'ed-up virtual browsers (phantomJS) return a
			// function object as the result of querySelector methods
			if ( key !== 'el' && typeof value === 'function' ) {
				warnIfDebug( (key + " is a Ractive option that does not expect a function and will be ignored"),
					method === 'init' ? target : null );
			}
			else {
				target[ key ] = value;
			}
		}
	}

	// disallow combination of `append` and `enhance`
	if ( options.append && options.enhance ) {
		throw new Error( 'Cannot use append and enhance at the same time' );
	}

	registries.forEach( function (registry) {
		registry[ method ]( Parent, target, options );
	});

	adaptConfigurator[ method ]( Parent, target, options );
	templateConfigurator[ method ]( Parent, target, options );
	cssConfigurator[ method ]( Parent, target, options );

	extendOtherMethods( Parent.prototype, target, options );
}

var _super = /\b_super\b/;
function extendOtherMethods ( parent, target, options ) {
	for ( var key in options ) {
		if ( !isBlacklisted[ key ] && options.hasOwnProperty( key ) ) {
			var member = options[ key ];

			// if this is a method that overwrites a method, wrap it:
			if ( typeof member === 'function' ) {
				if ( key in proto && !_super.test( member.toString() ) ) {
					warnIfDebug( ("Overriding Ractive prototype function '" + key + "' without calling the '" + _super + "' method can be very dangerous.") );
				}
				member = wrap( parent, key, member );
			}

			target[ key ] = member;
		}
	}
}

function makeObj ( array ) {
	var obj = {};
	array.forEach( function (x) { return obj[x] = true; } );
	return obj;
}

var Item = function Item ( options ) {
	this.parentFragment = options.parentFragment;
	this.ractive = options.parentFragment.ractive;

	this.template = options.template;
	this.index = options.index;
	this.type = options.template.t;

	this.dirty = false;
};

Item.prototype.bubble = function bubble () {
	if ( !this.dirty ) {
		this.dirty = true;
		this.parentFragment.bubble();
	}
};

Item.prototype.destroyed = function destroyed () {
	if ( this.fragment ) { this.fragment.destroyed(); }
};

Item.prototype.find = function find () {
	return null;
};

Item.prototype.findComponent = function findComponent () {
	return null;
};

Item.prototype.findNextNode = function findNextNode () {
	return this.parentFragment.findNextNode( this );
};

Item.prototype.shuffled = function shuffled () {
	if ( this.fragment ) { this.fragment.shuffled(); }
};

Item.prototype.valueOf = function valueOf () {
	return this.toString();
};

Item.prototype.findAll = noop;
Item.prototype.findAllComponents = noop;

var ContainerItem = (function (Item) {
	function ContainerItem ( options ) {
		Item.call( this, options );
	}

	if ( Item ) ContainerItem.__proto__ = Item;
	ContainerItem.prototype = Object.create( Item && Item.prototype );
	ContainerItem.prototype.constructor = ContainerItem;

	ContainerItem.prototype.detach = function detach () {
		return this.fragment ? this.fragment.detach() : createDocumentFragment();
	};

	ContainerItem.prototype.find = function find ( selector ) {
		if ( this.fragment ) {
			return this.fragment.find( selector );
		}
	};

	ContainerItem.prototype.findAll = function findAll ( selector, options ) {
		if ( this.fragment ) {
			this.fragment.findAll( selector, options );
		}
	};

	ContainerItem.prototype.findComponent = function findComponent ( name ) {
		if ( this.fragment ) {
			return this.fragment.findComponent( name );
		}
	};

	ContainerItem.prototype.findAllComponents = function findAllComponents ( name, options ) {
		if ( this.fragment ) {
			this.fragment.findAllComponents( name, options );
		}
	};

	ContainerItem.prototype.firstNode = function firstNode ( skipParent ) {
		return this.fragment && this.fragment.firstNode( skipParent );
	};

	ContainerItem.prototype.toString = function toString ( escape ) {
		return this.fragment ? this.fragment.toString( escape ) : '';
	};

	return ContainerItem;
}(Item));

var ComputationChild = (function (Model$$1) {
	function ComputationChild ( parent, key ) {
		Model$$1.call( this, parent, key );

		this.isReadonly = !this.root.ractive.syncComputedChildren;
		this.dirty = true;
	}

	if ( Model$$1 ) ComputationChild.__proto__ = Model$$1;
	ComputationChild.prototype = Object.create( Model$$1 && Model$$1.prototype );
	ComputationChild.prototype.constructor = ComputationChild;

	var prototypeAccessors = { setRoot: {} };

	prototypeAccessors.setRoot.get = function () { return this.parent.setRoot; };

	ComputationChild.prototype.applyValue = function applyValue ( value ) {
		Model$$1.prototype.applyValue.call( this, value );

		if ( !this.isReadonly ) {
			var source = this.parent;
			// computed models don't have a shuffle method
			while ( source && source.shuffle ) {
				source = source.parent;
			}

			if ( source ) {
				source.dependencies.forEach( mark );
			}
		}

		if ( this.setRoot ) {
			this.setRoot.set( this.setRoot.value );
		}
	};

	ComputationChild.prototype.get = function get ( shouldCapture ) {
		if ( shouldCapture ) { capture( this ); }

		if ( this.dirty ) {
			this.dirty = false;
			var parentValue = this.parent.get();
			this.value = parentValue ? parentValue[ this.key ] : undefined;
		}

		return this.value;
	};

	ComputationChild.prototype.handleChange = function handleChange$1 () {
		this.dirty = true;

		if ( this.boundValue ) { this.boundValue = null; }

		this.links.forEach( marked );
		this.deps.forEach( handleChange );
		this.children.forEach( handleChange );
	};

	ComputationChild.prototype.joinKey = function joinKey ( key ) {
		if ( key === undefined || key === '' ) { return this; }

		if ( !this.childByKey.hasOwnProperty( key ) ) {
			var child = new ComputationChild( this, key );
			this.children.push( child );
			this.childByKey[ key ] = child;
		}

		return this.childByKey[ key ];
	};

	Object.defineProperties( ComputationChild.prototype, prototypeAccessors );

	return ComputationChild;
}(Model));

/* global console */
/* eslint no-console:"off" */

var Computation = (function (Model$$1) {
	function Computation ( viewmodel, signature, key ) {
		Model$$1.call( this, null, null );

		this.root = this.parent = viewmodel;
		this.signature = signature;

		this.key = key; // not actually used, but helps with debugging
		this.isExpression = key && key[0] === '@';

		this.isReadonly = !this.signature.setter;

		this.context = viewmodel.computationContext;

		this.dependencies = [];

		this.children = [];
		this.childByKey = {};

		this.deps = [];

		this.dirty = true;

		// TODO: is there a less hackish way to do this?
		this.shuffle = undefined;
	}

	if ( Model$$1 ) Computation.__proto__ = Model$$1;
	Computation.prototype = Object.create( Model$$1 && Model$$1.prototype );
	Computation.prototype.constructor = Computation;

	var prototypeAccessors = { setRoot: {} };

	prototypeAccessors.setRoot.get = function () {
		if ( this.signature.setter ) { return this; }
	};

	Computation.prototype.get = function get ( shouldCapture ) {
		if ( shouldCapture ) { capture( this ); }

		if ( this.dirty ) {
			this.dirty = false;
			var old = this.value;
			this.value = this.getValue();
			if ( !isEqual( old, this.value ) ) { this.notifyUpstream(); }
			if ( this.wrapper ) { this.newWrapperValue = this.value; }
			this.adapt();
		}

		// if capturing, this value needs to be unwrapped because it's for external use
		return maybeBind( this, shouldCapture && this.wrapper ? this.wrapperValue : this.value );
	};

	Computation.prototype.getValue = function getValue () {
		startCapturing();
		var result;

		try {
			result = this.signature.getter.call( this.context );
		} catch ( err ) {
			warnIfDebug( ("Failed to compute " + (this.getKeypath()) + ": " + (err.message || err)) );

			// TODO this is all well and good in Chrome, but...
			// ...also, should encapsulate this stuff better, and only
			// show it if Ractive.DEBUG
			if ( hasConsole ) {
				if ( console.groupCollapsed ) { console.groupCollapsed( '%cshow details', 'color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;' ); }
				var sig = this.signature;
				console.error( ((err.name) + ": " + (err.message) + "\n\n" + (sig.getterString) + (sig.getterUseStack ? '\n\n' + err.stack : '')) );
				if ( console.groupCollapsed ) { console.groupEnd(); }
			}
		}

		var dependencies = stopCapturing();
		this.setDependencies( dependencies );

		return result;
	};

	Computation.prototype.mark = function mark () {
		this.handleChange();
	};

	Computation.prototype.rebind = function rebind ( next, previous ) {
		// computations will grab all of their deps again automagically
		if ( next !== previous ) { this.handleChange(); }
	};

	Computation.prototype.set = function set ( value ) {
		if ( this.isReadonly ) {
			throw new Error( ("Cannot set read-only computed value '" + (this.key) + "'") );
		}

		this.signature.setter( value );
		this.mark();
	};

	Computation.prototype.setDependencies = function setDependencies ( dependencies ) {
		var this$1 = this;

		// unregister any soft dependencies we no longer have
		var i = this.dependencies.length;
		while ( i-- ) {
			var model = this$1.dependencies[i];
			if ( !~dependencies.indexOf( model ) ) { model.unregister( this$1 ); }
		}

		// and add any new ones
		i = dependencies.length;
		while ( i-- ) {
			var model$1 = dependencies[i];
			if ( !~this$1.dependencies.indexOf( model$1 ) ) { model$1.register( this$1 ); }
		}

		this.dependencies = dependencies;
	};

	Computation.prototype.teardown = function teardown () {
		var this$1 = this;

		var i = this.dependencies.length;
		while ( i-- ) {
			if ( this$1.dependencies[i] ) { this$1.dependencies[i].unregister( this$1 ); }
		}
		if ( this.root.computations[this.key] === this ) { delete this.root.computations[this.key]; }
		Model$$1.prototype.teardown.call(this);
	};

	Object.defineProperties( Computation.prototype, prototypeAccessors );

	return Computation;
}(Model));

var prototype$1 = Computation.prototype;
var child = ComputationChild.prototype;
prototype$1.handleChange = child.handleChange;
prototype$1.joinKey = child.joinKey;

var ExpressionProxy = (function (Model$$1) {
	function ExpressionProxy ( fragment, template ) {
		var this$1 = this;

		Model$$1.call( this, fragment.ractive.viewmodel, null );

		this.fragment = fragment;
		this.template = template;

		this.isReadonly = true;
		this.dirty = true;

		this.fn = getFunction( template.s, template.r.length );

		this.models = this.template.r.map( function (ref) {
			return resolveReference( this$1.fragment, ref );
		});
		this.dependencies = [];

		this.shuffle = undefined;

		this.bubble();
	}

	if ( Model$$1 ) ExpressionProxy.__proto__ = Model$$1;
	ExpressionProxy.prototype = Object.create( Model$$1 && Model$$1.prototype );
	ExpressionProxy.prototype.constructor = ExpressionProxy;

	ExpressionProxy.prototype.bubble = function bubble ( actuallyChanged ) {
		if ( actuallyChanged === void 0 ) actuallyChanged = true;

		// refresh the keypath
		this.keypath = undefined;

		if ( actuallyChanged ) {
			this.handleChange();
		}
	};

	ExpressionProxy.prototype.getKeypath = function getKeypath () {
		var this$1 = this;

		if ( !this.template ) { return '@undefined'; }
		if ( !this.keypath ) {
			this.keypath = '@' + this.template.s.replace( /_(\d+)/g, function ( match, i ) {
				if ( i >= this$1.models.length ) { return match; }

				var model = this$1.models[i];
				return model ? model.getKeypath() : '@undefined';
			});
		}

		return this.keypath;
	};

	ExpressionProxy.prototype.getValue = function getValue () {
		var this$1 = this;

		startCapturing();
		var result;

		try {
			var params = this.models.map( function (m) { return m ? m.get( true ) : undefined; } );
			result = this.fn.apply( this.fragment.ractive, params );
		} catch ( err ) {
			warnIfDebug( ("Failed to compute " + (this.getKeypath()) + ": " + (err.message || err)) );
		}

		var dependencies = stopCapturing();
		// remove missing deps
		this.dependencies.filter( function (d) { return !~dependencies.indexOf( d ); } ).forEach( function (d) {
			d.unregister( this$1 );
			removeFromArray( this$1.dependencies, d );
		});
		// register new deps
		dependencies.filter( function (d) { return !~this$1.dependencies.indexOf( d ); } ).forEach( function (d) {
			d.register( this$1 );
			this$1.dependencies.push( d );
		});

		return result;
	};

	ExpressionProxy.prototype.rebind = function rebind ( next, previous, safe ) {
		var idx = this.models.indexOf( previous );

		if ( ~idx ) {
			next = rebindMatch( this.template.r[idx], next, previous );
			if ( next !== previous ) {
				previous.unregister( this );
				this.models.splice( idx, 1, next );
				if ( next ) { next.addShuffleRegister( this, 'mark' ); }
			}
		}
		this.bubble( !safe );
	};

	ExpressionProxy.prototype.retrieve = function retrieve () {
		return this.get();
	};

	ExpressionProxy.prototype.teardown = function teardown () {
		var this$1 = this;

		this.unbind();
		this.fragment = undefined;
		if ( this.dependencies ) { this.dependencies.forEach( function (d) { return d.unregister( this$1 ); } ); }
		Model$$1.prototype.teardown.call(this);
	};

	ExpressionProxy.prototype.unreference = function unreference () {
		Model$$1.prototype.unreference.call(this);
		if ( !this.deps.length && !this.refs ) { this.teardown(); }
	};

	ExpressionProxy.prototype.unregister = function unregister ( dep ) {
		Model$$1.prototype.unregister.call( this, dep );
		if ( !this.deps.length && !this.refs ) { this.teardown(); }
	};

	return ExpressionProxy;
}(Model));

var prototype = ExpressionProxy.prototype;
var computation = Computation.prototype;
prototype.get = computation.get;
prototype.handleChange = computation.handleChange;
prototype.joinKey = computation.joinKey;
prototype.mark = computation.mark;
prototype.unbind = noop;

var ReferenceExpressionChild = (function (Model$$1) {
	function ReferenceExpressionChild ( parent, key ) {
		Model$$1.call ( this, parent, key );
	}

	if ( Model$$1 ) ReferenceExpressionChild.__proto__ = Model$$1;
	ReferenceExpressionChild.prototype = Object.create( Model$$1 && Model$$1.prototype );
	ReferenceExpressionChild.prototype.constructor = ReferenceExpressionChild;

	ReferenceExpressionChild.prototype.applyValue = function applyValue ( value ) {
		if ( isEqual( value, this.value ) ) { return; }

		var parent = this.parent;
		var keys = [ this.key ];
		while ( parent ) {
			if ( parent.base ) {
				var target = parent.model.joinAll( keys );
				target.applyValue( value );
				break;
			}

			keys.unshift( parent.key );

			parent = parent.parent;
		}
	};

	ReferenceExpressionChild.prototype.get = function get ( shouldCapture, opts ) {
		this.value = this.retrieve();
		return Model$$1.prototype.get.call( this, shouldCapture, opts );
	};

	ReferenceExpressionChild.prototype.joinKey = function joinKey ( key ) {
		if ( key === undefined || key === '' ) { return this; }

		if ( !this.childByKey.hasOwnProperty( key ) ) {
			var child = new ReferenceExpressionChild( this, key );
			this.children.push( child );
			this.childByKey[ key ] = child;
		}

		return this.childByKey[ key ];
	};

	ReferenceExpressionChild.prototype.retrieve = function retrieve () {
		var parent = this.parent.get();
		return parent && parent[ this.key ];
	};

	return ReferenceExpressionChild;
}(Model));

var ReferenceExpressionProxy = (function (Model$$1) {
	function ReferenceExpressionProxy ( fragment, template ) {
		var this$1 = this;

		Model$$1.call( this, null, null );
		this.dirty = true;
		this.root = fragment.ractive.viewmodel;
		this.template = template;

		this.base = resolve( fragment, template );

		var intermediary = this.intermediary = {
			handleChange: function () { return this$1.handleChange(); },
			rebind: function ( next, previous ) {
				if ( previous === this$1.base ) {
					next = rebindMatch( template, next, previous );
					if ( next !== this$1.base ) {
						this$1.base.unregister( intermediary );
						this$1.base = next;
					}
				} else {
					var idx = this$1.members.indexOf( previous );
					if ( ~idx ) {
						// only direct references will rebind... expressions handle themselves
						next = rebindMatch( template.m[idx].n, next, previous );
						if ( next !== this$1.members[idx] ) {
							this$1.members.splice( idx, 1, next );
						}
					}
				}

				if ( next !== previous ) { previous.unregister( intermediary ); }
				if ( next ) { next.addShuffleTask( function () { return next.register( intermediary ); } ); }

				this$1.bubble();
			}
		};

		this.members = template.m.map( function ( template ) {
			if ( typeof template === 'string' ) {
				return { get: function () { return template; } };
			}

			var model;

			if ( template.t === REFERENCE ) {
				model = resolveReference( fragment, template.n );
				model.register( intermediary );

				return model;
			}

			model = new ExpressionProxy( fragment, template );
			model.register( intermediary );
			return model;
		});

		this.bubble();
	}

	if ( Model$$1 ) ReferenceExpressionProxy.__proto__ = Model$$1;
	ReferenceExpressionProxy.prototype = Object.create( Model$$1 && Model$$1.prototype );
	ReferenceExpressionProxy.prototype.constructor = ReferenceExpressionProxy;

	ReferenceExpressionProxy.prototype.bubble = function bubble () {
		if ( !this.base ) { return; }
		if ( !this.dirty ) { this.handleChange(); }
	};

	ReferenceExpressionProxy.prototype.get = function get ( shouldCapture ) {
		if ( this.dirty ) {
			this.bubble();

			var keys = this.members.map( function (m) { return escapeKey( String( m.get() ) ); } );
			var model = this.base.joinAll( keys );

			if ( model !== this.model ) {
				if ( this.model ) {
					this.model.unregister( this );
					this.model.unregisterTwowayBinding( this );
				}

				this.model = model;
				this.parent = model.parent;
				this.model.register( this );
				this.model.registerTwowayBinding( this );

				if ( this.keypathModel ) { this.keypathModel.handleChange(); }
			}

			this.value = this.model.get( shouldCapture );
			this.dirty = false;
			this.mark();
			return this.value;
		} else {
			return this.model ? this.model.get( shouldCapture ) : undefined;
		}
	};

	// indirect two-way bindings
	ReferenceExpressionProxy.prototype.getValue = function getValue () {
		var this$1 = this;

		this.value = this.model ? this.model.get() : undefined;

		var i = this.bindings.length;
		while ( i-- ) {
			var value = this$1.bindings[i].getValue();
			if ( value !== this$1.value ) { return value; }
		}

		// check one-way bindings
		var oneway = findBoundValue( this.deps );
		if ( oneway ) { return oneway.value; }

		return this.value;
	};

	ReferenceExpressionProxy.prototype.getKeypath = function getKeypath () {
		return this.model ? this.model.getKeypath() : '@undefined';
	};

	ReferenceExpressionProxy.prototype.handleChange = function handleChange$$1 () {
		this.dirty = true;
		this.mark();
	};

	ReferenceExpressionProxy.prototype.joinKey = function joinKey ( key ) {
		if ( key === undefined || key === '' ) { return this; }

		if ( !this.childByKey.hasOwnProperty( key ) ) {
			var child = new ReferenceExpressionChild( this, key );
			this.children.push( child );
			this.childByKey[ key ] = child;
		}

		return this.childByKey[ key ];
	};

	ReferenceExpressionProxy.prototype.mark = function mark$1 () {
		if ( this.dirty ) {
			this.deps.forEach( handleChange );
		}

		this.links.forEach( marked );
		this.children.forEach( mark );
	};

	ReferenceExpressionProxy.prototype.retrieve = function retrieve () {
		return this.value;
	};

	ReferenceExpressionProxy.prototype.set = function set ( value ) {
		this.model.set( value );
	};

	ReferenceExpressionProxy.prototype.teardown = function teardown$$1 () {
		var this$1 = this;

		if ( this.model ) {
			this.model.unregister( this );
			this.model.unregisterTwowayBinding( this );
		}
		if ( this.members ) {
			this.members.forEach( function (m) { return m && m.unregister && m.unregister( this$1 ); } );
		}
	};

	ReferenceExpressionProxy.prototype.unreference = function unreference () {
		Model$$1.prototype.unreference.call(this);
		if ( !this.deps.length && !this.refs ) { this.teardown(); }
	};

	ReferenceExpressionProxy.prototype.unregister = function unregister ( dep ) {
		Model$$1.prototype.unregister.call( this, dep );
		if ( !this.deps.length && !this.refs ) { this.teardown(); }
	};

	return ReferenceExpressionProxy;
}(Model));

ReferenceExpressionProxy.prototype.rebind = noop;

function resolve ( fragment, template ) {
	if ( template.r ) {
		return resolveReference( fragment, template.r );
	}

	else if ( template.x ) {
		return new ExpressionProxy( fragment, template.x );
	}

	else if ( template.rx ) {
		return new ReferenceExpressionProxy( fragment, template.rx );
	}
}

function resolveAliases( aliases, fragment ) {
	var resolved = {};

	for ( var i = 0; i < aliases.length; i++ ) {
		resolved[ aliases[i].n ] = resolve( fragment, aliases[i].x );
	}

	for ( var k in resolved ) {
		resolved[k].reference();
	}

	return resolved;
}

var Alias = (function (ContainerItem$$1) {
	function Alias ( options ) {
		ContainerItem$$1.call( this, options );

		this.fragment = null;
	}

	if ( ContainerItem$$1 ) Alias.__proto__ = ContainerItem$$1;
	Alias.prototype = Object.create( ContainerItem$$1 && ContainerItem$$1.prototype );
	Alias.prototype.constructor = Alias;

	Alias.prototype.bind = function bind () {
		this.fragment = new Fragment({
			owner: this,
			template: this.template.f
		});

		this.fragment.aliases = resolveAliases( this.template.z, this.parentFragment );
		this.fragment.bind();
	};

	Alias.prototype.render = function render ( target ) {
		this.rendered = true;
		if ( this.fragment ) { this.fragment.render( target ); }
	};

	Alias.prototype.unbind = function unbind () {
		var this$1 = this;

		for ( var k in this$1.fragment.aliases ) {
			this$1.fragment.aliases[k].unreference();
		}

		this.fragment.aliases = {};
		if ( this.fragment ) { this.fragment.unbind(); }
	};

	Alias.prototype.unrender = function unrender ( shouldDestroy ) {
		if ( this.rendered && this.fragment ) { this.fragment.unrender( shouldDestroy ); }
		this.rendered = false;
	};

	Alias.prototype.update = function update () {
		if ( this.dirty ) {
			this.dirty = false;
			this.fragment.update();
		}
	};

	return Alias;
}(ContainerItem));

var space = /\s+/;

function readStyle ( css ) {
	if ( typeof css !== 'string' ) { return {}; }

	return cleanCss( css, function ( css, reconstruct ) {
		return css.split( ';' )
			.filter( function (rule) { return !!rule.trim(); } )
			.map( reconstruct )
			.reduce(function ( rules, rule ) {
				var i = rule.indexOf(':');
				var name = rule.substr( 0, i ).trim();
				rules[ name ] = rule.substr( i + 1 ).trim();
				return rules;
			}, {});
	});
}

function readClass ( str ) {
	var list = str.split( space );

  // remove any empty entries
	var i = list.length;
	while ( i-- ) {
		if ( !list[i] ) { list.splice( i, 1 ); }
	}

	return list;
}

var hyphenateCamel = function ( camelCaseStr ) {
	return camelCaseStr.replace( /([A-Z])/g, function ( match, $1 ) {
		return '-' + $1.toLowerCase();
	});
};

var textTypes = [ undefined, 'text', 'search', 'url', 'email', 'hidden', 'password', 'search', 'reset', 'submit' ];

function getUpdateDelegate ( attribute ) {
	var element = attribute.element;
	var name = attribute.name;

	if ( name === 'value' ) {
		if ( attribute.interpolator ) { attribute.interpolator.bound = true; }

		// special case - selects
		if ( element.name === 'select' && name === 'value' ) {
			return element.getAttribute( 'multiple' ) ? updateMultipleSelectValue : updateSelectValue;
		}

		if ( element.name === 'textarea' ) { return updateStringValue; }

		// special case - contenteditable
		if ( element.getAttribute( 'contenteditable' ) != null ) { return updateContentEditableValue; }

		// special case - <input>
		if ( element.name === 'input' ) {
			var type = element.getAttribute( 'type' );

			// type='file' value='{{fileList}}'>
			if ( type === 'file' ) { return noop; } // read-only

			// type='radio' name='{{twoway}}'
			if ( type === 'radio' && element.binding && element.binding.attribute.name === 'name' ) { return updateRadioValue; }

			if ( ~textTypes.indexOf( type ) ) { return updateStringValue; }
		}

		return updateValue;
	}

	var node = element.node;

	// special case - <input type='radio' name='{{twoway}}' value='foo'>
	if ( attribute.isTwoway && name === 'name' ) {
		if ( node.type === 'radio' ) { return updateRadioName; }
		if ( node.type === 'checkbox' ) { return updateCheckboxName; }
	}

	if ( name === 'style' ) { return updateStyleAttribute; }

	if ( name.indexOf( 'style-' ) === 0 ) { return updateInlineStyle; }

	// special case - class names. IE fucks things up, again
	if ( name === 'class' && ( !node.namespaceURI || node.namespaceURI === html ) ) { return updateClassName; }

	if ( name.indexOf( 'class-' ) === 0 ) { return updateInlineClass; }

	if ( attribute.isBoolean ) {
		var type$1 = element.getAttribute( 'type' );
		if ( attribute.interpolator && name === 'checked' && ( type$1 === 'checkbox' || type$1 === 'radio' ) ) { attribute.interpolator.bound = true; }
		return updateBoolean;
	}

	if ( attribute.namespace && attribute.namespace !== attribute.node.namespaceURI ) { return updateNamespacedAttribute; }

	return updateAttribute;
}

function updateMultipleSelectValue ( reset ) {
	var value = this.getValue();

	if ( !Array.isArray( value ) ) { value = [ value ]; }

	var options = this.node.options;
	var i = options.length;

	if ( reset ) {
		while ( i-- ) { options[i].selected = false; }
	} else {
		while ( i-- ) {
			var option = options[i];
			var optionValue = option._ractive ?
				option._ractive.value :
				option.value; // options inserted via a triple don't have _ractive

			option.selected = arrayContains( value, optionValue );
		}
	}
}

function updateSelectValue ( reset ) {
	var value = this.getValue();

	if ( !this.locked ) { // TODO is locked still a thing?
		this.node._ractive.value = value;

		var options = this.node.options;
		var i = options.length;
		var wasSelected = false;

		if ( reset ) {
			while ( i-- ) { options[i].selected = false; }
		} else {
			while ( i-- ) {
				var option = options[i];
				var optionValue = option._ractive ?
					option._ractive.value :
					option.value; // options inserted via a triple don't have _ractive
				if ( option.disabled && option.selected ) { wasSelected = true; }

				if ( optionValue == value ) { // double equals as we may be comparing numbers with strings
					option.selected = true;
					return;
				}
			}
		}

		if ( !wasSelected ) { this.node.selectedIndex = -1; }
	}
}


function updateContentEditableValue ( reset ) {
	var value = this.getValue();

	if ( !this.locked ) {
		if ( reset ) { this.node.innerHTML = ''; }
		else { this.node.innerHTML = value === undefined ? '' : value; }
	}
}

function updateRadioValue ( reset ) {
	var node = this.node;
	var wasChecked = node.checked;

	var value = this.getValue();

	if ( reset ) { return node.checked = false; }

	//node.value = this.element.getAttribute( 'value' );
	node.value = this.node._ractive.value = value;
	node.checked = this.element.compare( value, this.element.getAttribute( 'name' ) );

	// This is a special case - if the input was checked, and the value
	// changed so that it's no longer checked, the twoway binding is
	// most likely out of date. To fix it we have to jump through some
	// hoops... this is a little kludgy but it works
	if ( wasChecked && !node.checked && this.element.binding && this.element.binding.rendered ) {
		this.element.binding.group.model.set( this.element.binding.group.getValue() );
	}
}

function updateValue ( reset ) {
	if ( !this.locked ) {
		if ( reset ) {
			this.node.removeAttribute( 'value' );
			this.node.value = this.node._ractive.value = null;
		} else {
			var value = this.getValue();

			this.node.value = this.node._ractive.value = value;
			this.node.setAttribute( 'value', safeToStringValue( value ) );
		}
	}
}

function updateStringValue ( reset ) {
	if ( !this.locked ) {
		if ( reset ) {
			this.node._ractive.value = '';
			this.node.removeAttribute( 'value' );
		} else {
			var value = this.getValue();

			this.node._ractive.value = value;

			this.node.value = safeToStringValue( value );
			this.node.setAttribute( 'value', safeToStringValue( value ) );
		}
	}
}

function updateRadioName ( reset ) {
	if ( reset ) { this.node.checked = false; }
	else { this.node.checked = this.element.compare( this.getValue(), this.element.binding.getValue() ); }
}

function updateCheckboxName ( reset ) {
	var ref = this;
	var element = ref.element;
	var node = ref.node;
	var binding = element.binding;

	var value = this.getValue();
	var valueAttribute = element.getAttribute( 'value' );

	if ( reset ) {
		// TODO: WAT?
	}

	if ( !Array.isArray( value ) ) {
		binding.isChecked = node.checked = element.compare( value, valueAttribute );
	} else {
		var i = value.length;
		while ( i-- ) {
			if ( element.compare ( valueAttribute, value[i] ) ) {
				binding.isChecked = node.checked = true;
				return;
			}
		}
		binding.isChecked = node.checked = false;
	}
}

function updateStyleAttribute ( reset ) {
	var props = reset ? {} : readStyle( this.getValue() || '' );
	var style = this.node.style;
	var keys = Object.keys( props );
	var prev = this.previous || [];

	var i = 0;
	while ( i < keys.length ) {
		if ( keys[i] in style ) {
			var safe = props[ keys[i] ].replace( '!important', '' );
			style.setProperty( keys[i], safe, safe.length !== props[ keys[i] ].length ? 'important' : '' );
		}
		i++;
	}

	// remove now-missing attrs
	i = prev.length;
	while ( i-- ) {
		if ( !~keys.indexOf( prev[i] ) && prev[i] in style ) { style.setProperty( prev[i], '', '' ); }
	}

	this.previous = keys;
}

function updateInlineStyle ( reset ) {
	if ( !this.style ) {
		this.style = hyphenateCamel( this.name.substr( 6 ) );
	}

	var value = reset ? '' : safeToStringValue( this.getValue() );
	var safe = value.replace( '!important', '' );
	this.node.style.setProperty( this.style, safe, safe.length !== value.length ? 'important' : '' );
}

function updateClassName ( reset ) {
	var value = reset ? [] : readClass( safeToStringValue( this.getValue() ) );

	// watch out for werdo svg elements
	var cls = this.node.className;
	cls = cls.baseVal !== undefined ? cls.baseVal : cls;

	var attr = readClass( cls );
	var prev = this.previous || attr.slice( 0 );

	var className = value.concat( attr.filter( function (c) { return !~prev.indexOf( c ); } ) ).join( ' ' );

	if ( className !== cls ) {
		if ( typeof this.node.className !== 'string' ) {
			this.node.className.baseVal = className;
		} else {
			this.node.className = className;
		}
	}

	this.previous = value;
}

function updateInlineClass ( reset ) {
	var name = this.name.substr( 6 );

	// watch out for werdo svg elements
	var cls = this.node.className;
	cls = cls.baseVal !== undefined ? cls.baseVal : cls;

	var attr = readClass( cls );
	var value = reset ? false : this.getValue();

	if ( !this.inlineClass ) { this.inlineClass = name; }

	if ( value && !~attr.indexOf( name ) ) { attr.push( name ); }
	else if ( !value && ~attr.indexOf( name ) ) { attr.splice( attr.indexOf( name ), 1 ); }

	if ( typeof this.node.className !== 'string' ) {
		this.node.className.baseVal = attr.join( ' ' );
	} else {
		this.node.className = attr.join( ' ' );
	}
}

function updateBoolean ( reset ) {
	// with two-way binding, only update if the change wasn't initiated by the user
	// otherwise the cursor will often be sent to the wrong place
	if ( !this.locked ) {
		if ( reset ) {
			if ( this.useProperty ) { this.node[ this.propertyName ] = false; }
			this.node.removeAttribute( this.propertyName );
		} else {
			if ( this.useProperty ) {
				this.node[ this.propertyName ] = this.getValue();
			} else {
				if ( this.getValue() ) {
					this.node.setAttribute( this.propertyName, '' );
				} else {
					this.node.removeAttribute( this.propertyName );
				}
			}
		}
	}
}

function updateAttribute ( reset ) {
	if ( reset ) { this.node.removeAttribute( this.name ); }
	else { this.node.setAttribute( this.name, safeToStringValue( this.getString() ) ); }
}

function updateNamespacedAttribute ( reset ) {
	if ( reset ) { this.node.removeAttributeNS( this.namespace, this.name.slice( this.name.indexOf( ':' ) + 1 ) ); }
	else { this.node.setAttributeNS( this.namespace, this.name.slice( this.name.indexOf( ':' ) + 1 ), safeToStringValue( this.getString() ) ); }
}

var propertyNames = {
	'accept-charset': 'acceptCharset',
	accesskey: 'accessKey',
	bgcolor: 'bgColor',
	class: 'className',
	codebase: 'codeBase',
	colspan: 'colSpan',
	contenteditable: 'contentEditable',
	datetime: 'dateTime',
	dirname: 'dirName',
	for: 'htmlFor',
	'http-equiv': 'httpEquiv',
	ismap: 'isMap',
	maxlength: 'maxLength',
	novalidate: 'noValidate',
	pubdate: 'pubDate',
	readonly: 'readOnly',
	rowspan: 'rowSpan',
	tabindex: 'tabIndex',
	usemap: 'useMap'
};

var div$1 = doc ? createElement( 'div' ) : null;

var attributes = false;
function inAttributes() { return attributes; }
function doInAttributes( fn ) {
	attributes = true;
	fn();
	attributes = false;
}

var ConditionalAttribute = (function (Item$$1) {
	function ConditionalAttribute ( options ) {
		Item$$1.call( this, options );

		this.attributes = [];

		this.owner = options.owner;

		this.fragment = new Fragment({
			ractive: this.ractive,
			owner: this,
			template: this.template
		});
		// this fragment can't participate in node-y things
		this.fragment.findNextNode = noop;

		this.dirty = false;
	}

	if ( Item$$1 ) ConditionalAttribute.__proto__ = Item$$1;
	ConditionalAttribute.prototype = Object.create( Item$$1 && Item$$1.prototype );
	ConditionalAttribute.prototype.constructor = ConditionalAttribute;

	ConditionalAttribute.prototype.bind = function bind () {
		this.fragment.bind();
	};

	ConditionalAttribute.prototype.bubble = function bubble () {
		if ( !this.dirty ) {
			this.dirty = true;
			this.owner.bubble();
		}
	};

	ConditionalAttribute.prototype.render = function render () {
		this.node = this.owner.node;
		if ( this.node ) {
			this.isSvg = this.node.namespaceURI === svg$1;
		}

		attributes = true;
		if ( !this.rendered ) { this.fragment.render(); }

		this.rendered = true;
		this.dirty = true; // TODO this seems hacky, but necessary for tests to pass in browser AND node.js
		this.update();
		attributes = false;
	};

	ConditionalAttribute.prototype.toString = function toString () {
		return this.fragment.toString();
	};

	ConditionalAttribute.prototype.unbind = function unbind () {
		this.fragment.unbind();
	};

	ConditionalAttribute.prototype.unrender = function unrender () {
		this.rendered = false;
		this.fragment.unrender();
	};

	ConditionalAttribute.prototype.update = function update () {
		var this$1 = this;

		var str;
		var attrs;

		if ( this.dirty ) {
			this.dirty = false;

			var current = attributes;
			attributes = true;
			this.fragment.update();
			attributes = current || false;

			if ( this.rendered && this.node ) {
				str = this.fragment.toString();
				attrs = parseAttributes( str, this.isSvg );

				// any attributes that previously existed but no longer do
				// must be removed
				this.attributes.filter( function (a) { return notIn( attrs, a ); } ).forEach( function (a) {
					this$1.node.removeAttribute( a.name );
				});

				attrs.forEach( function (a) {
					this$1.node.setAttribute( a.name, a.value );
				});

				this.attributes = attrs;
			}
		}
	};

	return ConditionalAttribute;
}(Item));

function parseAttributes ( str, isSvg ) {
	var tagName = isSvg ? 'svg' : 'div';
	return str
		? (div$1.innerHTML = "<" + tagName + " " + str + "></" + tagName + ">") &&
			toArray(div$1.childNodes[0].attributes)
		: [];
}

function notIn ( haystack, needle ) {
	var i = haystack.length;

	while ( i-- ) {
		if ( haystack[i].name === needle.name ) {
			return false;
		}
	}

	return true;
}

function lookupNamespace ( node, prefix ) {
	var qualified = "xmlns:" + prefix;

	while ( node ) {
		if ( node.hasAttribute && node.hasAttribute( qualified ) ) { return node.getAttribute( qualified ); }
		node = node.parentNode;
	}

	return namespaces[ prefix ];
}

var attribute = false;
function inAttribute () { return attribute; }

var Attribute = (function (Item$$1) {
	function Attribute ( options ) {
		Item$$1.call( this, options );

		this.name = options.template.n;
		this.namespace = null;

		this.owner = options.owner || options.parentFragment.owner || options.element || findElement( options.parentFragment );
		this.element = options.element || (this.owner.attributeByName ? this.owner : findElement( options.parentFragment ) );
		this.parentFragment = options.parentFragment; // shared
		this.ractive = this.parentFragment.ractive;

		this.rendered = false;
		this.updateDelegate = null;
		this.fragment = null;

		this.element.attributeByName[ this.name ] = this;

		if ( !Array.isArray( options.template.f ) ) {
			this.value = options.template.f;
			if ( this.value === 0 ) {
				this.value = '';
			} else if ( this.value === undefined ) {
				this.value = true;
			}
		} else {
			this.fragment = new Fragment({
				owner: this,
				template: options.template.f
			});
		}

		this.interpolator = this.fragment &&
			this.fragment.items.length === 1 &&
			this.fragment.items[0].type === INTERPOLATOR &&
			this.fragment.items[0];

		if ( this.interpolator ) { this.interpolator.owner = this; }
	}

	if ( Item$$1 ) Attribute.__proto__ = Item$$1;
	Attribute.prototype = Object.create( Item$$1 && Item$$1.prototype );
	Attribute.prototype.constructor = Attribute;

	Attribute.prototype.bind = function bind () {
		if ( this.fragment ) {
			this.fragment.bind();
		}
	};

	Attribute.prototype.bubble = function bubble () {
		if ( !this.dirty ) {
			this.parentFragment.bubble();
			this.element.bubble();
			this.dirty = true;
		}
	};

	Attribute.prototype.getString = function getString () {
		attribute = true;
		var value = this.fragment ?
			this.fragment.toString() :
			this.value != null ? '' + this.value : '';
		attribute = false;
		return value;
	};

	// TODO could getValue ever be called for a static attribute,
	// or can we assume that this.fragment exists?
	Attribute.prototype.getValue = function getValue () {
		attribute = true;
		var value = this.fragment ? this.fragment.valueOf() : booleanAttributes.test( this.name ) ? true : this.value;
		attribute = false;
		return value;
	};

	Attribute.prototype.render = function render () {
		var node = this.element.node;
		this.node = node;

		// should we use direct property access, or setAttribute?
		if ( !node.namespaceURI || node.namespaceURI === namespaces.html ) {
			this.propertyName = propertyNames[ this.name ] || this.name;

			if ( node[ this.propertyName ] !== undefined ) {
				this.useProperty = true;
			}

			// is attribute a boolean attribute or 'value'? If so we're better off doing e.g.
			// node.selected = true rather than node.setAttribute( 'selected', '' )
			if ( booleanAttributes.test( this.name ) || this.isTwoway ) {
				this.isBoolean = true;
			}

			if ( this.propertyName === 'value' ) {
				node._ractive.value = this.value;
			}
		}

		if ( node.namespaceURI ) {
			var index = this.name.indexOf( ':' );
			if ( index !== -1 ) {
				this.namespace = lookupNamespace( node, this.name.slice( 0, index ) );
			} else {
				this.namespace = node.namespaceURI;
			}
		}

		this.rendered = true;
		this.updateDelegate = getUpdateDelegate( this );
		this.updateDelegate();
	};

	Attribute.prototype.toString = function toString () {
		if ( inAttributes() ) { return ''; }
		attribute = true;

		var value = this.getValue();

		// Special case - select and textarea values (should not be stringified)
		if ( this.name === 'value' && ( this.element.getAttribute( 'contenteditable' ) !== undefined || ( this.element.name === 'select' || this.element.name === 'textarea' ) ) ) {
			return;
		}

		// Special case – bound radio `name` attributes
		if ( this.name === 'name' && this.element.name === 'input' && this.interpolator && this.element.getAttribute( 'type' ) === 'radio' ) {
			return ("name=\"{{" + (this.interpolator.model.getKeypath()) + "}}\"");
		}

		// Special case - style and class attributes and directives
		if ( this.owner === this.element && ( this.name === 'style' || this.name === 'class' || this.style || this.inlineClass ) ) {
			return;
		}

		if ( !this.rendered && this.owner === this.element && ( !this.name.indexOf( 'style-' ) || !this.name.indexOf( 'class-' ) ) ) {
			if ( !this.name.indexOf( 'style-' ) ) {
				this.style = hyphenateCamel( this.name.substr( 6 ) );
			} else {
				this.inlineClass = this.name.substr( 6 );
			}

			return;
		}

		if ( booleanAttributes.test( this.name ) ) { return value ? this.name : ''; }
		if ( value == null ) { return ''; }

		var str = safeAttributeString( this.getString() );
		attribute = false;

		return str ?
			((this.name) + "=\"" + str + "\"") :
			this.name;
	};

	Attribute.prototype.unbind = function unbind () {
		if ( this.fragment ) { this.fragment.unbind(); }
	};

	Attribute.prototype.unrender = function unrender () {
		this.updateDelegate( true );

		this.rendered = false;
	};

	Attribute.prototype.update = function update () {
		if ( this.dirty ) {
			this.dirty = false;
			if ( this.fragment ) { this.fragment.update(); }
			if ( this.rendered ) { this.updateDelegate(); }
			if ( this.isTwoway && !this.locked ) {
				this.interpolator.twowayBinding.lastVal( true, this.interpolator.model.get() );
			}
		}
	};

	return Attribute;
}(Item));

var BindingFlag = (function (Item$$1) {
	function BindingFlag ( options ) {
		Item$$1.call( this, options );

		this.owner = options.owner || options.parentFragment.owner || findElement( options.parentFragment );
		this.element = this.owner.attributeByName ? this.owner : findElement( options.parentFragment );
		this.flag = options.template.v === 'l' ? 'lazy' : 'twoway';

		if ( this.element.type === ELEMENT ) {
			if ( Array.isArray( options.template.f ) ) {
				this.fragment = new Fragment({
					owner: this,
					template: options.template.f
				});
			}

			this.interpolator = this.fragment &&
								this.fragment.items.length === 1 &&
								this.fragment.items[0].type === INTERPOLATOR &&
								this.fragment.items[0];
		}
	}

	if ( Item$$1 ) BindingFlag.__proto__ = Item$$1;
	BindingFlag.prototype = Object.create( Item$$1 && Item$$1.prototype );
	BindingFlag.prototype.constructor = BindingFlag;

	BindingFlag.prototype.bind = function bind () {
		if ( this.fragment ) { this.fragment.bind(); }
		set$1( this, this.getValue(), true );
	};

	BindingFlag.prototype.bubble = function bubble () {
		if ( !this.dirty ) {
			this.element.bubble();
			this.dirty = true;
		}
	};

	BindingFlag.prototype.getValue = function getValue () {
		if ( this.fragment ) { return this.fragment.valueOf(); }
		else if ( 'value' in this ) { return this.value; }
		else if ( 'f' in this.template ) { return this.template.f; }
		else { return true; }
	};

	BindingFlag.prototype.render = function render () {
		set$1( this, this.getValue(), true );
	};

	BindingFlag.prototype.toString = function toString () { return ''; };

	BindingFlag.prototype.unbind = function unbind () {
		if ( this.fragment ) { this.fragment.unbind(); }

		delete this.element[ this.flag ];
	};

	BindingFlag.prototype.unrender = function unrender () {
		if ( this.element.rendered ) { this.element.recreateTwowayBinding(); }
	};

	BindingFlag.prototype.update = function update () {
		if ( this.dirty ) {
			if ( this.fragment ) { this.fragment.update(); }
			set$1( this, this.getValue(), true );
		}
	};

	return BindingFlag;
}(Item));

function set$1 ( flag, value, update ) {
	if ( value === 0 ) {
		flag.value = true;
	} else if ( value === 'true' ) {
		flag.value = true;
	} else if ( value === 'false' || value === '0' ) {
		flag.value = false;
	} else {
		flag.value = value;
	}

	var current = flag.element[ flag.flag ];
	flag.element[ flag.flag ] = flag.value;
	if ( update && !flag.element.attributes.binding && current !== flag.value ) {
		flag.element.recreateTwowayBinding();
	}

	return flag.value;
}

var RactiveModel = (function (Model$$1) {
	function RactiveModel ( ractive ) {
		Model$$1.call( this, null, '' );
		this.value = ractive;
		this.isRoot = true;
		this.root = this;
		this.adaptors = [];
		this.ractive = ractive;
	}

	if ( Model$$1 ) RactiveModel.__proto__ = Model$$1;
	RactiveModel.prototype = Object.create( Model$$1 && Model$$1.prototype );
	RactiveModel.prototype.constructor = RactiveModel;

	RactiveModel.prototype.joinKey = function joinKey ( key ) {
		var model = Model$$1.prototype.joinKey.call( this, key );

		if ( ( key === 'root' || key === 'parent' ) && !model.isLink ) { return initLink( model, key ); }
		else if ( key === 'data' ) { return this.ractive.viewmodel; }

		return model;
	};

	RactiveModel.prototype.getKeypath = function getKeypath () {
		return '@this';
	};

	RactiveModel.prototype.retrieve = function retrieve () {
		return this.ractive;
	};

	return RactiveModel;
}(Model));

function initLink ( model, key ) {
	model.applyValue = function ( value ) {
		this.parent.value[ key ] = value;
		if ( value && value.viewmodel ) {
			this.link( value.viewmodel.getRactiveModel(), key );
			this._link.markedAll();
		} else {
			this.link( Object.create( Missing ), key );
			this._link.markedAll();
		}
	};

	model.applyValue( model.parent.ractive[ key ], key );
	model._link.set = function (v) { return model.applyValue( v ); };
	model._link.applyValue = function (v) { return model.applyValue( v ); };
	return model._link;
}

var hasProp$1 = Object.prototype.hasOwnProperty;

var RootModel = (function (Model$$1) {
	function RootModel ( options ) {
		Model$$1.call( this, null, null );

		this.isRoot = true;
		this.root = this;
		this.ractive = options.ractive; // TODO sever this link

		this.value = options.data;
		this.adaptors = options.adapt;
		this.adapt();

		this.computationContext = options.ractive;
		this.computations = {};
	}

	if ( Model$$1 ) RootModel.__proto__ = Model$$1;
	RootModel.prototype = Object.create( Model$$1 && Model$$1.prototype );
	RootModel.prototype.constructor = RootModel;

	RootModel.prototype.attached = function attached ( fragment ) {
		attachImplicits( this, fragment );
	};

	RootModel.prototype.compute = function compute ( key, signature ) {
		var computation = new Computation( this, signature, key );
		this.computations[ escapeKey( key ) ] = computation;

		return computation;
	};

	RootModel.prototype.createLink = function createLink ( keypath, target, targetPath, options ) {
		var keys = splitKeypath( keypath );

		var model = this;
		while ( keys.length ) {
			var key = keys.shift();
			model = model.childByKey[ key ] || model.joinKey( key );
		}

		return model.link( target, targetPath, options );
	};

	RootModel.prototype.detached = function detached () {
		detachImplicits( this );
	};

	RootModel.prototype.get = function get ( shouldCapture, options ) {
		var this$1 = this;

		if ( shouldCapture ) { capture( this ); }

		if ( !options || options.virtual !== false ) {
			var result = this.getVirtual();
			var keys = Object.keys( this.computations );
			var i = keys.length;
			while ( i-- ) {
				result[ keys[i] ] = this$1.computations[ keys[i] ].get();
			}

			return result;
		} else {
			return this.value;
		}
	};

	RootModel.prototype.getKeypath = function getKeypath () {
		return '';
	};

	RootModel.prototype.getRactiveModel = function getRactiveModel () {
		return this.ractiveModel || ( this.ractiveModel = new RactiveModel( this.ractive ) );
	};

	RootModel.prototype.getValueChildren = function getValueChildren () {
		var this$1 = this;

		var children = Model$$1.prototype.getValueChildren.call( this, this.value );

		this.children.forEach( function (child) {
			if ( child._link ) {
				var idx = children.indexOf( child );
				if ( ~idx ) { children.splice( idx, 1, child._link ); }
				else { children.push( child._link ); }
			}
		});

		for ( var k in this$1.computations ) {
			children.push( this$1.computations[k] );
		}

		return children;
	};

	RootModel.prototype.has = function has ( key ) {
		var value = this.value;
		var unescapedKey = unescapeKey( key );

		if ( unescapedKey === '@this' || unescapedKey === '@global' || unescapedKey === '@shared' ) { return true; }
		if ( unescapedKey[0] === '~' && unescapedKey[1] === '/' ) { unescapedKey = unescapedKey.slice( 2 ); }
		if ( hasProp$1.call( value, unescapedKey ) ) { return true; }

		// mappings/links and computations
		if ( key in this.computations || this.childByKey[unescapedKey] && this.childByKey[unescapedKey]._link ) { return true; }

		// We climb up the constructor chain to find if one of them contains the unescapedKey
		var constructor = value.constructor;
		while ( constructor !== Function && constructor !== Array && constructor !== Object ) {
			if ( hasProp$1.call( constructor.prototype, unescapedKey ) ) { return true; }
			constructor = constructor.constructor;
		}

		return false;
	};

	RootModel.prototype.joinKey = function joinKey ( key, opts ) {
		if ( key[0] === '@' ) {
			if ( key === '@this' || key === '@' ) { return this.getRactiveModel(); }
			if ( key === '@global' ) { return GlobalModel; }
			if ( key === '@shared' ) { return SharedModel$1; }
			return;
		}

		if ( key[0] === '~' && key[1] === '/' ) { key = key.slice( 2 ); }

		return this.computations.hasOwnProperty( key ) ? this.computations[ key ] :
		       Model$$1.prototype.joinKey.call( this, key, opts );
	};

	RootModel.prototype.set = function set ( value ) {
		// TODO wrapping root node is a baaaad idea. We should prevent this
		var wrapper = this.wrapper;
		if ( wrapper ) {
			var shouldTeardown = !wrapper.reset || wrapper.reset( value ) === false;

			if ( shouldTeardown ) {
				wrapper.teardown();
				this.wrapper = null;
				this.value = value;
				this.adapt();
			}
		} else {
			this.value = value;
			this.adapt();
		}

		this.deps.forEach( handleChange );
		this.children.forEach( mark );
	};

	RootModel.prototype.retrieve = function retrieve () {
		return this.wrapper ? this.wrapper.get() : this.value;
	};

	RootModel.prototype.teardown = function teardown$$1 () {
		var this$1 = this;

		Model$$1.prototype.teardown.call(this);
		for ( var k in this$1.computations ) {
			this$1.computations[ k ].teardown();
		}
	};

	return RootModel;
}(Model));

RootModel.prototype.update = noop;

function attachImplicits ( model, fragment ) {
	if ( model._link && model._link.implicit && model._link.isDetached() ) {
		model.attach( fragment );
	}

	// look for virtual children to relink and cascade
	for ( var k in model.childByKey ) {
		if ( k in model.value ) {
			attachImplicits( model.childByKey[k], fragment );
		} else if ( !model.childByKey[k]._link || model.childByKey[k]._link.isDetached() ) {
			var mdl = resolveReference( fragment, k );
			if ( mdl ) {
				model.childByKey[k].link( mdl, k, { implicit: true } );
			}
		}
	}
}

function detachImplicits ( model ) {
	if ( model._link && model._link.implicit ) {
		model.unlink();
	}

	for ( var k in model.childByKey ) {
		detachImplicits( model.childByKey[k] );
	}
}

function getComputationSignature ( ractive, key, signature ) {
	var getter;
	var setter;

	// useful for debugging
	var getterString;
	var getterUseStack;
	var setterString;

	if ( typeof signature === 'function' ) {
		getter = bind$1( signature, ractive );
		getterString = signature.toString();
		getterUseStack = true;
	}

	if ( typeof signature === 'string' ) {
		getter = createFunctionFromString( signature, ractive );
		getterString = signature;
	}

	if ( typeof signature === 'object' ) {
		if ( typeof signature.get === 'string' ) {
			getter = createFunctionFromString( signature.get, ractive );
			getterString = signature.get;
		} else if ( typeof signature.get === 'function' ) {
			getter = bind$1( signature.get, ractive );
			getterString = signature.get.toString();
			getterUseStack = true;
		} else {
			fatal( '`%s` computation must have a `get()` method', key );
		}

		if ( typeof signature.set === 'function' ) {
			setter = bind$1( signature.set, ractive );
			setterString = signature.set.toString();
		}
	}

	return {
		getter: getter,
		setter: setter,
		getterString: getterString,
		setterString: setterString,
		getterUseStack: getterUseStack
	};
}

var constructHook = new Hook( 'construct' );

var registryNames$1 = [
	'adaptors',
	'components',
	'decorators',
	'easing',
	'events',
	'interpolators',
	'partials',
	'transitions'
];

var uid = 0;

function construct ( ractive, options ) {
	if ( Ractive.DEBUG ) { welcome(); }

	initialiseProperties( ractive );
	handleAttributes( ractive );

	// if there's not a delegation setting, inherit from parent if it's not default
	if ( !options.hasOwnProperty( 'delegate' ) && ractive.parent && ractive.parent.delegate !== ractive.delegate ) {
		ractive.delegate = false;
	}

	// TODO don't allow `onconstruct` with `new Ractive()`, there's no need for it
	constructHook.fire( ractive, options );

	// Add registries
	var i = registryNames$1.length;
	while ( i-- ) {
		var name = registryNames$1[ i ];
		ractive[ name ] = Object.assign( Object.create( ractive.constructor[ name ] || null ), options[ name ] );
	}

	if ( ractive._attributePartial ) {
		ractive.partials['extra-attributes'] = ractive._attributePartial;
		delete ractive._attributePartial;
	}

	// Create a viewmodel
	var viewmodel = new RootModel({
		adapt: getAdaptors( ractive, ractive.adapt, options ),
		data: dataConfigurator.init( ractive.constructor, ractive, options ),
		ractive: ractive
	});

	ractive.viewmodel = viewmodel;

	// Add computed properties
	var computed = Object.assign( Object.create( ractive.constructor.prototype.computed ), options.computed );

	for ( var key in computed ) {
		if ( key === '__proto__' ) { continue; }
		var signature = getComputationSignature( ractive, key, computed[ key ] );
		viewmodel.compute( key, signature );
	}
}

function getAdaptors ( ractive, protoAdapt, options ) {
	protoAdapt = protoAdapt.map( lookup );
	var adapt = ensureArray( options.adapt ).map( lookup );

	var srcs = [ protoAdapt, adapt ];
	if ( ractive.parent && !ractive.isolated ) {
		srcs.push( ractive.parent.viewmodel.adaptors );
	}

	return combine.apply( null, srcs );

	function lookup ( adaptor ) {
		if ( typeof adaptor === 'string' ) {
			adaptor = findInViewHierarchy( 'adaptors', ractive, adaptor );

			if ( !adaptor ) {
				fatal( missingPlugin( adaptor, 'adaptor' ) );
			}
		}

		return adaptor;
	}
}

function initialiseProperties ( ractive ) {
	// Generate a unique identifier, for places where you'd use a weak map if it
	// existed
	ractive._guid = 'r-' + uid++;

	// events
	ractive._subs = Object.create( null );
	ractive._nsSubs = 0;

	// storage for item configuration from instantiation to reset,
	// like dynamic functions or original values
	ractive._config = {};

	// events
	ractive.event = null;
	ractive._eventQueue = [];

	// observers
	ractive._observers = [];

	// external children
	ractive._children = [];
	ractive._children.byName = {};
	ractive.children = ractive._children;

	if ( !ractive.component ) {
		ractive.root = ractive;
		ractive.parent = ractive.container = null; // TODO container still applicable?
	}
}

function handleAttributes ( ractive ) {
	var component = ractive.component;
	var attributes = ractive.constructor.attributes;

	if ( attributes && component ) {
		var tpl = component.template;
		var attrs = tpl.m ? tpl.m.slice() : [];

		// grab all of the passed attribute names
		var props = attrs.filter( function (a) { return a.t === ATTRIBUTE; } ).map( function (a) { return a.n; } );

		// warn about missing requireds
		attributes.required.forEach( function (p) {
			if ( !~props.indexOf( p ) ) {
				warnIfDebug( ("Component '" + (component.name) + "' requires attribute '" + p + "' to be provided") );
			}
		});

		// set up a partial containing non-property attributes
		var all = attributes.optional.concat( attributes.required );
		var partial = [];
		var i = attrs.length;
		while ( i-- ) {
			var a = attrs[i];
			if ( a.t === ATTRIBUTE && !~all.indexOf( a.n ) ) {
				if ( attributes.mapAll ) {
					// map the attribute if requested and make the extra attribute in the partial refer to the mapping
					partial.unshift({ t: ATTRIBUTE, n: a.n, f: [{ t: INTERPOLATOR, r: ("~/" + (a.n)) }] });
				} else {
					// transfer the attribute to the extra attributes partal
					partial.unshift( attrs.splice( i, 1 )[0] );
				}
			}
		}

		if ( partial.length ) { component.template = { t: tpl.t, e: tpl.e, f: tpl.f, m: attrs, p: tpl.p }; }
		ractive._attributePartial = partial;
	}
}

var teardownHook = new Hook( 'teardown' );
var destructHook = new Hook( 'destruct' );

// Teardown. This goes through the root fragment and all its children, removing observers
// and generally cleaning up after itself

function Ractive$teardown () {
	var this$1 = this;

	if ( this.torndown ) {
		warnIfDebug( 'ractive.teardown() was called on a Ractive instance that was already torn down' );
		return Promise.resolve();
	}

	this.shouldDestroy = true;
	return teardown$1( this, function () { return this$1.fragment.rendered ? this$1.unrender() : Promise.resolve(); } );
}

function teardown$1 ( instance, getPromise ) {
	instance.torndown = true;
	instance.viewmodel.teardown();
	instance.fragment.unbind();
	instance._observers.slice().forEach( cancel );

	if ( instance.el && instance.el.__ractive_instances__ ) {
		removeFromArray( instance.el.__ractive_instances__, instance );
	}

	var promise = getPromise();

	teardownHook.fire( instance );
	promise.then( function () { return destructHook.fire( instance ); } );

	return promise;
}

var Component = (function (Item$$1) {
	function Component ( options, ComponentConstructor ) {
		var this$1 = this;

		Item$$1.call( this, options );
		this.isAnchor = this.template.t === ANCHOR;
		this.type = this.isAnchor ? ANCHOR : COMPONENT; // override ELEMENT from super

		var partials = options.template.p || {};
		if ( !( 'content' in partials ) ) { partials.content = options.template.f || []; }
		this._partials = partials; // TEMP

		if ( this.isAnchor ) {
			this.name = options.template.n;

			this.addChild = addChild;
			this.removeChild = removeChild;
		} else {
			var instance = Object.create( ComponentConstructor.prototype );

			this.instance = instance;
			this.name = options.template.e;

			if ( instance.el ) {
				warnIfDebug( ("The <" + (this.name) + "> component has a default 'el' property; it has been disregarded") );
			}

			// find container
			var fragment = options.parentFragment;
			var container;
			while ( fragment ) {
				if ( fragment.owner.type === YIELDER ) {
					container = fragment.owner.container;
					break;
				}

				fragment = fragment.parent;
			}

			// add component-instance-specific properties
			instance.parent = this.parentFragment.ractive;
			instance.container = container || null;
			instance.root = instance.parent.root;
			instance.component = this;

			construct( this.instance, { partials: partials });

			// for hackability, this could be an open option
			// for any ractive instance, but for now, just
			// for components and just for ractive...
			instance._inlinePartials = partials;
		}

		this.attributeByName = {};

		this.events = [];
		this.attributes = [];
		var leftovers = [];
		( this.template.m || [] ).forEach( function (template) {
			switch ( template.t ) {
				case ATTRIBUTE:
				case EVENT:
					this$1.attributes.push( createItem({
						owner: this$1,
						parentFragment: this$1.parentFragment,
						template: template
					}) );
					break;

				case TRANSITION:
				case BINDING_FLAG:
				case DECORATOR:
					break;

				default:
					leftovers.push( template );
					break;
			}
		});

		if ( leftovers.length ) {
			this.attributes.push( new ConditionalAttribute({
				owner: this,
				parentFragment: this.parentFragment,
				template: leftovers
			}) );
		}

		this.eventHandlers = [];
	}

	if ( Item$$1 ) Component.__proto__ = Item$$1;
	Component.prototype = Object.create( Item$$1 && Item$$1.prototype );
	Component.prototype.constructor = Component;

	Component.prototype.bind = function bind$1 () {
		if ( !this.isAnchor ) {
			this.attributes.forEach( bind );

			initialise( this.instance, {
				partials: this._partials
			}, {
				cssIds: this.parentFragment.cssIds
			});

			this.eventHandlers.forEach( bind );

			this.bound = true;
		}
	};

	Component.prototype.bubble = function bubble () {
		if ( !this.dirty ) {
			this.dirty = true;
			this.parentFragment.bubble();
		}
	};

	Component.prototype.destroyed = function destroyed$$1 () {
		if ( !this.isAnchor && this.instance.fragment ) { this.instance.fragment.destroyed(); }
	};

	Component.prototype.detach = function detach () {
		if ( this.isAnchor ) {
			if ( this.instance ) { return this.instance.fragment.detach(); }
			return createDocumentFragment();
		}

		return this.instance.fragment.detach();
	};

	Component.prototype.find = function find ( selector, options ) {
		if ( this.instance ) { return this.instance.fragment.find( selector, options ); }
	};

	Component.prototype.findAll = function findAll ( selector, options ) {
		if ( this.instance ) { this.instance.fragment.findAll( selector, options ); }
	};

	Component.prototype.findComponent = function findComponent ( name, options ) {
		if ( !name || this.name === name ) { return this.instance; }

		if ( this.instance.fragment ) {
			return this.instance.fragment.findComponent( name, options );
		}
	};

	Component.prototype.findAllComponents = function findAllComponents ( name, options ) {
		var result = options.result;

		if ( this.instance && ( !name || this.name === name ) ) {
			result.push( this.instance );
		}

		if ( this.instance ) { this.instance.findAllComponents( name, options ); }
	};

	Component.prototype.firstNode = function firstNode ( skipParent ) {
		if ( this.instance ) { return this.instance.fragment.firstNode( skipParent ); }
	};

	Component.prototype.getContext = function getContext$$1 () {
		var assigns = [], len = arguments.length;
		while ( len-- ) assigns[ len ] = arguments[ len ];

		assigns.unshift( this );
		return getRactiveContext.apply( null, assigns );
	};

	Component.prototype.render = function render$1$$1 ( target, occupants ) {
		if ( this.isAnchor ) {
			this.rendered = true;
			this.target = target;

			if ( !checking.length ) {
				checking.push( this.ractive );
				if ( occupants ) {
					this.occupants = occupants;
					checkAnchors();
					this.occupants = null;
				} else {
					runloop.scheduleTask( checkAnchors, true );
				}
			}
		} else {
			render$1( this.instance, target, null, occupants );

			this.attributes.forEach( render );
			this.eventHandlers.forEach( render );

			this.rendered = true;
		}
	};

	Component.prototype.toString = function toString$$1 () {
		if ( this.instance ) { return this.instance.toHTML(); }
	};

	Component.prototype.unbind = function unbind$1 () {
		if ( !this.isAnchor ) {
			this.bound = false;

			this.attributes.forEach( unbind );

			teardown$1( this.instance, function () { return runloop.promise(); } );
		}
	};

	Component.prototype.unrender = function unrender$1 ( shouldDestroy ) {
		this.shouldDestroy = shouldDestroy;

		if ( this.isAnchor ) {
			if ( this.item ) { unrenderItem( this, this.item ); }
			this.target = null;
			if ( !checking.length ) {
				checking.push( this.ractive );
				runloop.scheduleTask( checkAnchors, true );
			}
		} else {
			this.instance.unrender();
			this.instance.el = this.instance.target = null;
			this.attributes.forEach( unrender );
			this.eventHandlers.forEach( unrender );
		}

		this.rendered = false;
	};

	Component.prototype.update = function update$1 () {
		this.dirty = false;
		if ( this.instance ) {
			this.instance.fragment.update();
			this.attributes.forEach( update );
			this.eventHandlers.forEach( update );
		}
	};

	return Component;
}(Item));

function addChild ( meta ) {
	if ( this.item ) { this.removeChild( this.item ); }

	var child = meta.instance;
	meta.anchor = this;

	meta.parentFragment = this.parentFragment;
	meta.name = meta.nameOption || this.name;
	this.name = meta.name;


	if ( !child.isolated ) { child.viewmodel.attached( this.parentFragment ); }

	// render as necessary
	if ( this.rendered ) {
		renderItem( this, meta );
	}
}

function removeChild ( meta ) {
	// unrender as necessary
	if ( this.item === meta ) {
		unrenderItem( this, meta );
		this.name = this.template.n;
	}
}

function renderItem ( anchor, meta ) {
	if ( !anchor.rendered ) { return; }

	meta.shouldDestroy = false;
	meta.parentFragment = anchor.parentFragment;

	anchor.item = meta;
	anchor.instance = meta.instance;
	var nextNode = anchor.parentFragment.findNextNode( anchor );

	if ( meta.instance.fragment.rendered ) {
		meta.instance.unrender();
	}

	meta.partials = meta.instance.partials;
	meta.instance.partials = Object.assign( {}, meta.partials, anchor._partials );

	meta.instance.fragment.unbind();
	meta.instance.fragment.bind( meta.instance.viewmodel );

	anchor.attributes.forEach( bind );
	anchor.eventHandlers.forEach( bind );
	anchor.attributes.forEach( render );
	anchor.eventHandlers.forEach( render );

	var target = anchor.parentFragment.findParentNode();
	render$1( meta.instance, target, target.contains( nextNode ) ? nextNode : null, anchor.occupants );

	if ( meta.lastBound !== anchor ) {
		meta.lastBound = anchor;
	}
}

function unrenderItem ( anchor, meta ) {
	if ( !anchor.rendered ) { return; }

	meta.shouldDestroy = true;
	meta.instance.unrender();

	anchor.eventHandlers.forEach( unrender );
	anchor.attributes.forEach( unrender );
	anchor.eventHandlers.forEach( unbind );
	anchor.attributes.forEach( unbind );

	meta.instance.el = meta.instance.anchor = null;
	meta.parentFragment = null;
	meta.anchor = null;
	anchor.item = null;
	anchor.instance = null;
}

var checking = [];
function checkAnchors () {
	var list = checking;
	checking = [];

	list.forEach( updateAnchors );
}

function setupArgsFn ( item, template, fragment, opts ) {
	if ( opts === void 0 ) opts = {};

	if ( template && template.f && template.f.s ) {
		item.fn = getFunction( template.f.s, template.f.r.length );
		if ( opts.register === true ) {
			item.models = resolveArgs( item, template, fragment, opts );
		}
	}
}

function resolveArgs ( item, template, fragment, opts ) {
	if ( opts === void 0 ) opts = {};

	return template.f.r.map( function ( ref, i ) {
		var model;

		if ( opts.specialRef && ( model = opts.specialRef( ref, i ) ) ) { return model; }

		model = resolveReference( fragment, ref );
		if ( opts.register === true ) {
			model.register( item );
		}

		return model;
	});
}

function teardownArgsFn ( item, template ) {
	if ( template && template.f && template.f.s ) {
		if ( item.models ) { item.models.forEach( function (m) {
			if ( m && m.unregister ) { m.unregister( item ); }
		}); }
		item.models = null;
	}
}

var missingDecorator = {
	update: noop,
	teardown: noop
};

var Decorator = function Decorator ( options ) {
	this.owner = options.owner || options.parentFragment.owner || findElement( options.parentFragment );
	this.element = this.owner.attributeByName ? this.owner : findElement( options.parentFragment );
	this.parentFragment = this.owner.parentFragment;
	this.ractive = this.owner.ractive;
	var template = this.template = options.template;

	this.name = template.n;

	this.node = null;
	this.intermediary = null;

	this.element.decorators.push( this );
};

Decorator.prototype.bind = function bind () {
	setupArgsFn( this, this.template, this.parentFragment, { register: true } );
};

Decorator.prototype.bubble = function bubble () {
	if ( !this.dirty ) {
		this.dirty = true;
		this.owner.bubble();
	}
};

Decorator.prototype.destroyed = function destroyed () {
	if ( this.intermediary ) { this.intermediary.teardown(); }
	this.shouldDestroy = true;
};

Decorator.prototype.handleChange = function handleChange () { this.bubble(); };

Decorator.prototype.rebind = function rebind ( next, previous, safe ) {
	var idx = this.models.indexOf( previous );
	if ( !~idx ) { return; }

	next = rebindMatch( this.template.f.r[ idx ], next, previous );
	if ( next === previous ) { return; }

	previous.unregister( this );
	this.models.splice( idx, 1, next );
	if ( next ) { next.addShuffleRegister( this, 'mark' ); }

	if ( !safe ) { this.bubble(); }
};

Decorator.prototype.render = function render () {
		var this$1 = this;

	runloop.scheduleTask( function () {
		var fn = findInViewHierarchy( 'decorators', this$1.ractive, this$1.name );

		if ( !fn ) {
			warnOnce( missingPlugin( this$1.name, 'decorator' ) );
			this$1.intermediary = missingDecorator;
			return;
		}

		this$1.node = this$1.element.node;

		var args;
		if ( this$1.fn ) {
			args = this$1.models.map( function (model) {
				if ( !model ) { return undefined; }

				return model.get();
			});
			args = this$1.fn.apply( this$1.ractive, args );
		}

		this$1.intermediary = fn.apply( this$1.ractive, [ this$1.node ].concat( args ) );

		if ( !this$1.intermediary || !this$1.intermediary.teardown ) {
			throw new Error( ("The '" + (this$1.name) + "' decorator must return an object with a teardown method") );
		}

		// watch out for decorators that cause their host element to be unrendered
		if ( this$1.shouldDestroy ) { this$1.destroyed(); }
	}, true );
	this.rendered = true;
};

Decorator.prototype.toString = function toString () { return ''; };

Decorator.prototype.unbind = function unbind () {
	teardownArgsFn( this, this.template );
};

Decorator.prototype.unrender = function unrender ( shouldDestroy ) {
	if ( ( !shouldDestroy || this.element.rendered ) && this.intermediary ) { this.intermediary.teardown(); }
	this.rendered = false;
};

Decorator.prototype.update = function update () {
	if ( !this.dirty ) { return; }

	this.dirty = false;

	if ( this.intermediary ) {
		if ( !this.intermediary.update ) {
			this.unrender();
			this.render();
		}
		else {
			var args = this.models.map( function (model) { return model && model.get(); } );
			this.intermediary.update.apply( this.ractive, this.fn.apply( this.ractive, args ) );
		}
	}
};

var Doctype = (function (Item$$1) {
	function Doctype () {
		Item$$1.apply(this, arguments);
	}

	if ( Item$$1 ) Doctype.__proto__ = Item$$1;
	Doctype.prototype = Object.create( Item$$1 && Item$$1.prototype );
	Doctype.prototype.constructor = Doctype;

	Doctype.prototype.toString = function toString () {
		return '<!DOCTYPE' + this.template.a + '>';
	};

	return Doctype;
}(Item));

var proto$2 = Doctype.prototype;
proto$2.bind = proto$2.render = proto$2.teardown = proto$2.unbind = proto$2.unrender = proto$2.update = noop;

var Binding = function Binding ( element, name ) {
	if ( name === void 0 ) name = 'value';

	this.element = element;
	this.ractive = element.ractive;
	this.attribute = element.attributeByName[ name ];

	var interpolator = this.attribute.interpolator;
	interpolator.twowayBinding = this;

	var model = interpolator.model;

	if ( model.isReadonly && !model.setRoot ) {
		var keypath = model.getKeypath().replace( /^@/, '' );
		warnOnceIfDebug( ("Cannot use two-way binding on <" + (element.name) + "> element: " + keypath + " is read-only. To suppress this warning use <" + (element.name) + " twoway='false'...>"), { ractive: this.ractive });
		return false;
	}

	this.attribute.isTwoway = true;
	this.model = model;

	// initialise value, if it's undefined
	var value = model.get();
	this.wasUndefined = value === undefined;

	if ( value === undefined && this.getInitialValue ) {
		value = this.getInitialValue();
		model.set( value );
	}
	this.lastVal( true, value );

	var parentForm = findElement( this.element, false, 'form' );
	if ( parentForm ) {
		this.resetValue = value;
		parentForm.formBindings.push( this );
	}
};

Binding.prototype.bind = function bind () {
	this.model.registerTwowayBinding( this );
};

Binding.prototype.handleChange = function handleChange () {
		var this$1 = this;

	var value = this.getValue();
	if ( this.lastVal() === value ) { return; }

	runloop.start( this.root );
	this.attribute.locked = true;
	this.model.set( value );
	this.lastVal( true, value );

	// if the value changes before observers fire, unlock to be updatable cause something weird and potentially freezy is up
	if ( this.model.get() !== value ) { this.attribute.locked = false; }
	else { runloop.scheduleTask( function () { return this$1.attribute.locked = false; } ); }

	runloop.end();
};

Binding.prototype.lastVal = function lastVal ( setting, value ) {
	if ( setting ) { this.lastValue = value; }
	else { return this.lastValue; }
};

Binding.prototype.rebind = function rebind ( next, previous ) {
		var this$1 = this;

	if ( this.model && this.model === previous ) { previous.unregisterTwowayBinding( this ); }
	if ( next ) {
		this.model = next;
		runloop.scheduleTask( function () { return next.registerTwowayBinding( this$1 ); } );
	}
};

Binding.prototype.render = function render () {
	this.node = this.element.node;
	this.node._ractive.binding = this;
	this.rendered = true; // TODO is this used anywhere?
};

Binding.prototype.setFromNode = function setFromNode ( node ) {
	this.model.set( node.value );
};

Binding.prototype.unbind = function unbind () {
	this.model.unregisterTwowayBinding( this );
};

Binding.prototype.unrender = noop;

// This is the handler for DOM events that would lead to a change in the model
// (i.e. change, sometimes, input, and occasionally click and keyup)
function handleDomEvent () {
	this._ractive.binding.handleChange();
}

var CheckboxBinding = (function (Binding$$1) {
	function CheckboxBinding ( element ) {
		Binding$$1.call( this, element, 'checked' );
	}

	if ( Binding$$1 ) CheckboxBinding.__proto__ = Binding$$1;
	CheckboxBinding.prototype = Object.create( Binding$$1 && Binding$$1.prototype );
	CheckboxBinding.prototype.constructor = CheckboxBinding;

	CheckboxBinding.prototype.render = function render () {
		Binding$$1.prototype.render.call(this);

		this.element.on( 'change', handleDomEvent );

		if ( this.node.attachEvent ) {
			this.element.on( 'click', handleDomEvent );
		}
	};

	CheckboxBinding.prototype.unrender = function unrender () {
		this.element.off( 'change', handleDomEvent );
		this.element.off( 'click', handleDomEvent );
	};

	CheckboxBinding.prototype.getInitialValue = function getInitialValue () {
		return !!this.element.getAttribute( 'checked' );
	};

	CheckboxBinding.prototype.getValue = function getValue () {
		return this.node.checked;
	};

	CheckboxBinding.prototype.setFromNode = function setFromNode ( node ) {
		this.model.set( node.checked );
	};

	return CheckboxBinding;
}(Binding));

function getBindingGroup ( group, model, getValue ) {
	var hash = group + "-bindingGroup";
	return model[hash] || ( model[ hash ] = new BindingGroup( hash, model, getValue ) );
}

var BindingGroup = function BindingGroup ( hash, model, getValue ) {
	var this$1 = this;

	this.model = model;
	this.hash = hash;
	this.getValue = function () {
		this$1.value = getValue.call(this$1);
		return this$1.value;
	};

	this.bindings = [];
};

BindingGroup.prototype.add = function add ( binding ) {
	this.bindings.push( binding );
};

BindingGroup.prototype.bind = function bind () {
	this.value = this.model.get();
	this.model.registerTwowayBinding( this );
	this.bound = true;
};

BindingGroup.prototype.remove = function remove ( binding ) {
	removeFromArray( this.bindings, binding );
	if ( !this.bindings.length ) {
		this.unbind();
	}
};

BindingGroup.prototype.unbind = function unbind () {
	this.model.unregisterTwowayBinding( this );
	this.bound = false;
	delete this.model[this.hash];
};

BindingGroup.prototype.rebind = Binding.prototype.rebind;

var push$1 = [].push;

function getValue() {
	var this$1 = this;

	var all = this.bindings.filter(function (b) { return b.node && b.node.checked; }).map(function (b) { return b.element.getAttribute( 'value' ); });
	var res = [];
	all.forEach(function (v) { if ( !this$1.bindings[0].arrayContains( res, v ) ) { res.push( v ); } });
	return res;
}

var CheckboxNameBinding = (function (Binding$$1) {
	function CheckboxNameBinding ( element ) {
		Binding$$1.call( this, element, 'name' );

		this.checkboxName = true; // so that ractive.updateModel() knows what to do with this

		// Each input has a reference to an array containing it and its
		// group, as two-way binding depends on being able to ascertain
		// the status of all inputs within the group
		this.group = getBindingGroup( 'checkboxes', this.model, getValue );
		this.group.add( this );

		if ( this.noInitialValue ) {
			this.group.noInitialValue = true;
		}

		// If no initial value was set, and this input is checked, we
		// update the model
		if ( this.group.noInitialValue && this.element.getAttribute( 'checked' ) ) {
			var existingValue = this.model.get();
			var bindingValue = this.element.getAttribute( 'value' );

			if ( !this.arrayContains( existingValue, bindingValue ) ) {
				push$1.call( existingValue, bindingValue ); // to avoid triggering runloop with array adaptor
			}
		}
	}

	if ( Binding$$1 ) CheckboxNameBinding.__proto__ = Binding$$1;
	CheckboxNameBinding.prototype = Object.create( Binding$$1 && Binding$$1.prototype );
	CheckboxNameBinding.prototype.constructor = CheckboxNameBinding;

	CheckboxNameBinding.prototype.bind = function bind () {
		if ( !this.group.bound ) {
			this.group.bind();
		}
	};

	CheckboxNameBinding.prototype.getInitialValue = function getInitialValue () {
		// This only gets called once per group (of inputs that
		// share a name), because it only gets called if there
		// isn't an initial value. By the same token, we can make
		// a note of that fact that there was no initial value,
		// and populate it using any `checked` attributes that
		// exist (which users should avoid, but which we should
		// support anyway to avoid breaking expectations)
		this.noInitialValue = true; // TODO are noInitialValue and wasUndefined the same thing?
		return [];
	};

	CheckboxNameBinding.prototype.getValue = function getValue () {
		return this.group.value;
	};

	CheckboxNameBinding.prototype.handleChange = function handleChange () {
		this.isChecked = this.element.node.checked;
		this.group.value = this.model.get();
		var value = this.element.getAttribute( 'value' );
		if ( this.isChecked && !this.arrayContains( this.group.value, value ) ) {
			this.group.value.push( value );
		} else if ( !this.isChecked && this.arrayContains( this.group.value, value ) ) {
			this.removeFromArray( this.group.value, value );
		}
		// make sure super knows there's a change
		this.lastValue = null;
		Binding$$1.prototype.handleChange.call(this);
	};

	CheckboxNameBinding.prototype.render = function render () {
		Binding$$1.prototype.render.call(this);

		var node = this.node;

		var existingValue = this.model.get();
		var bindingValue = this.element.getAttribute( 'value' );

		if ( Array.isArray( existingValue ) ) {
			this.isChecked = this.arrayContains( existingValue, bindingValue );
		} else {
			this.isChecked = this.element.compare( existingValue, bindingValue );
		}
		node.name = '{{' + this.model.getKeypath() + '}}';
		node.checked = this.isChecked;

		this.element.on( 'change', handleDomEvent );

		// in case of IE emergency, bind to click event as well
		if ( this.node.attachEvent ) {
			this.element.on( 'click', handleDomEvent );
		}
	};

	CheckboxNameBinding.prototype.setFromNode = function setFromNode ( node ) {
		this.group.bindings.forEach( function (binding) { return binding.wasUndefined = true; } );

		if ( node.checked ) {
			var valueSoFar = this.group.getValue();
			valueSoFar.push( this.element.getAttribute( 'value' ) );

			this.group.model.set( valueSoFar );
		}
	};

	CheckboxNameBinding.prototype.unbind = function unbind () {
		this.group.remove( this );
	};

	CheckboxNameBinding.prototype.unrender = function unrender () {
		var el = this.element;

		el.off( 'change', handleDomEvent );
		el.off( 'click', handleDomEvent );
	};

	CheckboxNameBinding.prototype.arrayContains = function arrayContains ( selectValue, optionValue ) {
		var this$1 = this;

		var i = selectValue.length;
		while ( i-- ) {
			if ( this$1.element.compare( optionValue, selectValue[i] ) ) { return true; }
		}
		return false;
	};

	CheckboxNameBinding.prototype.removeFromArray = function removeFromArray ( array, item ) {
		var this$1 = this;

		if (!array) { return; }
		var i = array.length;
		while( i-- ) {
			if ( this$1.element.compare( item, array[i] ) ) {
				array.splice( i, 1 );
			}
		}
	};

	return CheckboxNameBinding;
}(Binding));

var ContentEditableBinding = (function (Binding$$1) {
	function ContentEditableBinding () {
		Binding$$1.apply(this, arguments);
	}

	if ( Binding$$1 ) ContentEditableBinding.__proto__ = Binding$$1;
	ContentEditableBinding.prototype = Object.create( Binding$$1 && Binding$$1.prototype );
	ContentEditableBinding.prototype.constructor = ContentEditableBinding;

	ContentEditableBinding.prototype.getInitialValue = function getInitialValue () {
		return this.element.fragment ? this.element.fragment.toString() : '';
	};

	ContentEditableBinding.prototype.getValue = function getValue () {
		return this.element.node.innerHTML;
	};

	ContentEditableBinding.prototype.render = function render () {
		Binding$$1.prototype.render.call(this);

		var el = this.element;

		el.on( 'change', handleDomEvent );
		el.on( 'blur', handleDomEvent );

		if ( !this.ractive.lazy ) {
			el.on( 'input', handleDomEvent );

			if ( this.node.attachEvent ) {
				el.on( 'keyup', handleDomEvent );
			}
		}
	};

	ContentEditableBinding.prototype.setFromNode = function setFromNode ( node ) {
		this.model.set( node.innerHTML );
	};

	ContentEditableBinding.prototype.unrender = function unrender () {
		var el = this.element;

		el.off( 'blur', handleDomEvent );
		el.off( 'change', handleDomEvent );
		el.off( 'input', handleDomEvent );
		el.off( 'keyup', handleDomEvent );
	};

	return ContentEditableBinding;
}(Binding));

function handleBlur () {
	handleDomEvent.call( this );

	var value = this._ractive.binding.model.get();
	this.value = value == undefined ? '' : value;
}

function handleDelay ( delay ) {
	var timeout;

	return function () {
		var this$1 = this;

		if ( timeout ) { clearTimeout( timeout ); }

		timeout = setTimeout( function () {
			var binding = this$1._ractive.binding;
			if ( binding.rendered ) { handleDomEvent.call( this$1 ); }
			timeout = null;
		}, delay );
	};
}

var GenericBinding = (function (Binding$$1) {
	function GenericBinding () {
		Binding$$1.apply(this, arguments);
	}

	if ( Binding$$1 ) GenericBinding.__proto__ = Binding$$1;
	GenericBinding.prototype = Object.create( Binding$$1 && Binding$$1.prototype );
	GenericBinding.prototype.constructor = GenericBinding;

	GenericBinding.prototype.getInitialValue = function getInitialValue () {
		return '';
	};

	GenericBinding.prototype.getValue = function getValue () {
		return this.node.value;
	};

	GenericBinding.prototype.render = function render () {
		Binding$$1.prototype.render.call(this);

		// any lazy setting for this element overrides the root
		// if the value is a number, it's a timeout
		var lazy = this.ractive.lazy;
		var timeout = false;
		var el = this.element;

		if ( 'lazy' in this.element ) {
			lazy = this.element.lazy;
		}

		if ( isNumeric( lazy ) ) {
			timeout = +lazy;
			lazy = false;
		}

		this.handler = timeout ? handleDelay( timeout ) : handleDomEvent;

		var node = this.node;

		el.on( 'change', handleDomEvent );

		if ( node.type !== 'file' ) {
			if ( !lazy ) {
				el.on( 'input', this.handler );

				// IE is a special snowflake
				if ( node.attachEvent ) {
					el.on( 'keyup', this.handler );
				}
			}

			el.on( 'blur', handleBlur );
		}
	};

	GenericBinding.prototype.unrender = function unrender () {
		var el = this.element;
		this.rendered = false;

		el.off( 'change', handleDomEvent );
		el.off( 'input', this.handler );
		el.off( 'keyup', this.handler );
		el.off( 'blur', handleBlur );
	};

	return GenericBinding;
}(Binding));

var FileBinding = (function (GenericBinding$$1) {
	function FileBinding () {
		GenericBinding$$1.apply(this, arguments);
	}

	if ( GenericBinding$$1 ) FileBinding.__proto__ = GenericBinding$$1;
	FileBinding.prototype = Object.create( GenericBinding$$1 && GenericBinding$$1.prototype );
	FileBinding.prototype.constructor = FileBinding;

	FileBinding.prototype.getInitialValue = function getInitialValue () {
		return undefined;
	};

	FileBinding.prototype.getValue = function getValue () {
		return this.node.files;
	};

	FileBinding.prototype.render = function render () {
		this.element.lazy = false;
		GenericBinding$$1.prototype.render.call(this);
	};

	FileBinding.prototype.setFromNode = function setFromNode ( node ) {
		this.model.set( node.files );
	};

	return FileBinding;
}(GenericBinding));

function getSelectedOptions ( select ) {
	return select.selectedOptions
		? toArray( select.selectedOptions )
		: select.options
			? toArray( select.options ).filter( function (option) { return option.selected; } )
			: [];
}

var MultipleSelectBinding = (function (Binding$$1) {
	function MultipleSelectBinding () {
		Binding$$1.apply(this, arguments);
	}

	if ( Binding$$1 ) MultipleSelectBinding.__proto__ = Binding$$1;
	MultipleSelectBinding.prototype = Object.create( Binding$$1 && Binding$$1.prototype );
	MultipleSelectBinding.prototype.constructor = MultipleSelectBinding;

	MultipleSelectBinding.prototype.getInitialValue = function getInitialValue () {
		return this.element.options
			.filter( function (option) { return option.getAttribute( 'selected' ); } )
			.map( function (option) { return option.getAttribute( 'value' ); } );
	};

	MultipleSelectBinding.prototype.getValue = function getValue () {
		var options = this.element.node.options;
		var len = options.length;

		var selectedValues = [];

		for ( var i = 0; i < len; i += 1 ) {
			var option = options[i];

			if ( option.selected ) {
				var optionValue = option._ractive ? option._ractive.value : option.value;
				selectedValues.push( optionValue );
			}
		}

		return selectedValues;
	};

	MultipleSelectBinding.prototype.handleChange = function handleChange () {
		var attribute = this.attribute;
		var previousValue = attribute.getValue();

		var value = this.getValue();

		if ( previousValue === undefined || !arrayContentsMatch( value, previousValue ) ) {
			Binding$$1.prototype.handleChange.call(this);
		}

		return this;
	};

	MultipleSelectBinding.prototype.render = function render () {
		Binding$$1.prototype.render.call(this);

		this.element.on( 'change', handleDomEvent );

		if ( this.model.get() === undefined ) {
			// get value from DOM, if possible
			this.handleChange();
		}
	};

	MultipleSelectBinding.prototype.setFromNode = function setFromNode ( node ) {
		var selectedOptions = getSelectedOptions( node );
		var i = selectedOptions.length;
		var result = new Array( i );

		while ( i-- ) {
			var option = selectedOptions[i];
			result[i] = option._ractive ? option._ractive.value : option.value;
		}

		this.model.set( result );
	};

	MultipleSelectBinding.prototype.unrender = function unrender () {
		this.element.off( 'change', handleDomEvent );
	};

	return MultipleSelectBinding;
}(Binding));

var NumericBinding = (function (GenericBinding$$1) {
	function NumericBinding () {
		GenericBinding$$1.apply(this, arguments);
	}

	if ( GenericBinding$$1 ) NumericBinding.__proto__ = GenericBinding$$1;
	NumericBinding.prototype = Object.create( GenericBinding$$1 && GenericBinding$$1.prototype );
	NumericBinding.prototype.constructor = NumericBinding;

	NumericBinding.prototype.getInitialValue = function getInitialValue () {
		return undefined;
	};

	NumericBinding.prototype.getValue = function getValue () {
		var value = parseFloat( this.node.value );
		return isNaN( value ) ? undefined : value;
	};

	NumericBinding.prototype.setFromNode = function setFromNode ( node ) {
		var value = parseFloat( node.value );
		if ( !isNaN( value ) ) { this.model.set( value ); }
	};

	return NumericBinding;
}(GenericBinding));

var siblings = {};

function getSiblings ( hash ) {
	return siblings[ hash ] || ( siblings[ hash ] = [] );
}

var RadioBinding = (function (Binding$$1) {
	function RadioBinding ( element ) {
		Binding$$1.call( this, element, 'checked' );

		this.siblings = getSiblings( this.ractive._guid + this.element.getAttribute( 'name' ) );
		this.siblings.push( this );
	}

	if ( Binding$$1 ) RadioBinding.__proto__ = Binding$$1;
	RadioBinding.prototype = Object.create( Binding$$1 && Binding$$1.prototype );
	RadioBinding.prototype.constructor = RadioBinding;

	RadioBinding.prototype.getValue = function getValue () {
		return this.node.checked;
	};

	RadioBinding.prototype.handleChange = function handleChange () {
		runloop.start( this.root );

		this.siblings.forEach( function (binding) {
			binding.model.set( binding.getValue() );
		});

		runloop.end();
	};

	RadioBinding.prototype.render = function render () {
		Binding$$1.prototype.render.call(this);

		this.element.on( 'change', handleDomEvent );

		if ( this.node.attachEvent ) {
			this.element.on( 'click', handleDomEvent );
		}
	};

	RadioBinding.prototype.setFromNode = function setFromNode ( node ) {
		this.model.set( node.checked );
	};

	RadioBinding.prototype.unbind = function unbind () {
		removeFromArray( this.siblings, this );
	};

	RadioBinding.prototype.unrender = function unrender () {
		this.element.off( 'change', handleDomEvent );
		this.element.off( 'click', handleDomEvent );
	};

	return RadioBinding;
}(Binding));

function getValue$1() {
	var checked = this.bindings.filter( function (b) { return b.node.checked; } );
	if ( checked.length > 0 ) {
		return checked[0].element.getAttribute( 'value' );
	}
}

var RadioNameBinding = (function (Binding$$1) {
	function RadioNameBinding ( element ) {
		Binding$$1.call( this, element, 'name' );

		this.group = getBindingGroup( 'radioname', this.model, getValue$1 );
		this.group.add( this );

		if ( element.checked ) {
			this.group.value = this.getValue();
		}
	}

	if ( Binding$$1 ) RadioNameBinding.__proto__ = Binding$$1;
	RadioNameBinding.prototype = Object.create( Binding$$1 && Binding$$1.prototype );
	RadioNameBinding.prototype.constructor = RadioNameBinding;

	RadioNameBinding.prototype.bind = function bind () {
		var this$1 = this;

		if ( !this.group.bound ) {
			this.group.bind();
		}

		// update name keypath when necessary
		this.nameAttributeBinding = {
			handleChange: function () { return this$1.node.name = "{{" + (this$1.model.getKeypath()) + "}}"; },
			rebind: noop
		};

		this.model.getKeypathModel().register( this.nameAttributeBinding );
	};

	RadioNameBinding.prototype.getInitialValue = function getInitialValue () {
		if ( this.element.getAttribute( 'checked' ) ) {
			return this.element.getAttribute( 'value' );
		}
	};

	RadioNameBinding.prototype.getValue = function getValue () {
		return this.element.getAttribute( 'value' );
	};

	RadioNameBinding.prototype.handleChange = function handleChange () {
		// If this <input> is the one that's checked, then the value of its
		// `name` model gets set to its value
		if ( this.node.checked ) {
			this.group.value = this.getValue();
			Binding$$1.prototype.handleChange.call(this);
		}
	};

	RadioNameBinding.prototype.lastVal = function lastVal ( setting, value ) {
		if ( !this.group ) { return; }
		if ( setting ) { this.group.lastValue = value; }
		else { return this.group.lastValue; }
	};

	RadioNameBinding.prototype.render = function render () {
		Binding$$1.prototype.render.call(this);

		var node = this.node;

		node.name = "{{" + (this.model.getKeypath()) + "}}";
		node.checked = this.element.compare ( this.model.get(), this.element.getAttribute( 'value' ) );

		this.element.on( 'change', handleDomEvent );

		if ( node.attachEvent ) {
			this.element.on( 'click', handleDomEvent );
		}
	};

	RadioNameBinding.prototype.setFromNode = function setFromNode ( node ) {
		if ( node.checked ) {
			this.group.model.set( this.element.getAttribute( 'value' ) );
		}
	};

	RadioNameBinding.prototype.unbind = function unbind () {
		this.group.remove( this );

		this.model.getKeypathModel().unregister( this.nameAttributeBinding );
	};

	RadioNameBinding.prototype.unrender = function unrender () {
		var el = this.element;

		el.off( 'change', handleDomEvent );
		el.off( 'click', handleDomEvent );
	};

	return RadioNameBinding;
}(Binding));

var SingleSelectBinding = (function (Binding$$1) {
	function SingleSelectBinding () {
		Binding$$1.apply(this, arguments);
	}

	if ( Binding$$1 ) SingleSelectBinding.__proto__ = Binding$$1;
	SingleSelectBinding.prototype = Object.create( Binding$$1 && Binding$$1.prototype );
	SingleSelectBinding.prototype.constructor = SingleSelectBinding;

	SingleSelectBinding.prototype.forceUpdate = function forceUpdate () {
		var this$1 = this;

		var value = this.getValue();

		if ( value !== undefined ) {
			this.attribute.locked = true;
			runloop.scheduleTask( function () { return this$1.attribute.locked = false; } );
			this.model.set( value );
		}
	};

	SingleSelectBinding.prototype.getInitialValue = function getInitialValue () {
		if ( this.element.getAttribute( 'value' ) !== undefined ) {
			return;
		}

		var options = this.element.options;
		var len = options.length;

		if ( !len ) { return; }

		var value;
		var optionWasSelected;
		var i = len;

		// take the final selected option...
		while ( i-- ) {
			var option = options[i];

			if ( option.getAttribute( 'selected' ) ) {
				if ( !option.getAttribute( 'disabled' ) ) {
					value = option.getAttribute( 'value' );
				}

				optionWasSelected = true;
				break;
			}
		}

		// or the first non-disabled option, if none are selected
		if ( !optionWasSelected ) {
			while ( ++i < len ) {
				if ( !options[i].getAttribute( 'disabled' ) ) {
					value = options[i].getAttribute( 'value' );
					break;
				}
			}
		}

		// This is an optimisation (aka hack) that allows us to forgo some
		// other more expensive work
		// TODO does it still work? seems at odds with new architecture
		if ( value !== undefined ) {
			this.element.attributeByName.value.value = value;
		}

		return value;
	};

	SingleSelectBinding.prototype.getValue = function getValue () {
		var options = this.node.options;
		var len = options.length;

		var i;
		for ( i = 0; i < len; i += 1 ) {
			var option = options[i];

			if ( options[i].selected && !options[i].disabled ) {
				return option._ractive ? option._ractive.value : option.value;
			}
		}
	};

	SingleSelectBinding.prototype.render = function render () {
		Binding$$1.prototype.render.call(this);
		this.element.on( 'change', handleDomEvent );
	};

	SingleSelectBinding.prototype.setFromNode = function setFromNode ( node ) {
		var option = getSelectedOptions( node )[0];
		this.model.set( option._ractive ? option._ractive.value : option.value );
	};

	SingleSelectBinding.prototype.unrender = function unrender () {
		this.element.off( 'change', handleDomEvent );
	};

	return SingleSelectBinding;
}(Binding));

function isBindable ( attribute ) {

	// The fragment must be a single non-string fragment
	if ( !attribute || !attribute.template.f || !attribute.template.f.length === 1 || attribute.template.f[0].s ) { return false; }

	// A binding is an interpolator `{{ }}`, yey.
	if ( attribute.template.f[0].t === INTERPOLATOR ) { return true; }

	// The above is probably the only true case. For the rest, show an appropriate
	// warning before returning false.

	// You can't bind a triple curly. HTML values on an attribute makes no sense.
	if ( attribute.template.f[0].t === TRIPLE ) { warnIfDebug( 'It is not possible create a binding using a triple mustache.' ); }

	return false;
}

function selectBinding ( element ) {
	var name = element.name;
	var attributes = element.attributeByName;
	var isBindableByValue = isBindable( attributes.value );
	var isBindableByContentEditable = isBindable( attributes.contenteditable );
	var isContentEditable =  element.getAttribute( 'contenteditable' );

	// contenteditable
	// Bind if the contenteditable is true or a binding that may become true.
	if ( ( isContentEditable || isBindableByContentEditable ) && isBindableByValue ) { return ContentEditableBinding; }

	// <input>
	if ( name === 'input' ) {
		var type = element.getAttribute( 'type' );

		if ( type === 'radio' ) {
			var isBindableByName = isBindable( attributes.name );
			var isBindableByChecked = isBindable( attributes.checked );

			// For radios we can either bind the name or checked, but not both.
			// Name binding is handed instead.
			if ( isBindableByName && isBindableByChecked ) {
				warnIfDebug( 'A radio input can have two-way binding on its name attribute, or its checked attribute - not both', { ractive: element.root });
				return RadioNameBinding;
			}

			if ( isBindableByName ) { return RadioNameBinding; }

			if ( isBindableByChecked ) { return RadioBinding; }

			// Dead end. Unknown binding on radio input.
			return null;
		}

		if ( type === 'checkbox' ) {
			var isBindableByName$1 = isBindable( attributes.name );
			var isBindableByChecked$1 = isBindable( attributes.checked );

			// A checkbox with bindings for both name and checked. Checked treated as
			// the checkbox value, name is treated as a regular binding.
			//
			// See https://github.com/ractivejs/ractive/issues/1749
			if ( isBindableByName$1 && isBindableByChecked$1 ) { return CheckboxBinding; }

			if ( isBindableByName$1 ) { return CheckboxNameBinding; }

			if ( isBindableByChecked$1 ) { return CheckboxBinding; }

			// Dead end. Unknown binding on checkbox input.
			return null;
		}

		if ( type === 'file' && isBindableByValue ) { return FileBinding; }

		if ( type === 'number' && isBindableByValue ) { return NumericBinding; }

		if ( type === 'range' && isBindableByValue ) { return NumericBinding; }

		// Some input of unknown type (browser usually falls back to text).
		if ( isBindableByValue ) { return GenericBinding; }

		// Dead end. Some unknown input and an unbindable.
		return null;
	}

	// <select>
	if ( name === 'select' && isBindableByValue ){
		return element.getAttribute( 'multiple' ) ? MultipleSelectBinding : SingleSelectBinding;
	}

	// <textarea>
	if ( name === 'textarea' && isBindableByValue ) { return GenericBinding; }

	// Dead end. Some unbindable element.
	return null;
}

var endsWithSemi = /;\s*$/;

var Element = (function (ContainerItem$$1) {
	function Element ( options ) {
		var this$1 = this;

		ContainerItem$$1.call( this, options );

		this.name = options.template.e.toLowerCase();
		this.isVoid = voidElementNames.test( this.name );

		// find parent element
		this.parent = findElement( this.parentFragment, false );

		if ( this.parent && this.parent.name === 'option' ) {
			throw new Error( ("An <option> element cannot contain other elements (encountered <" + (this.name) + ">)") );
		}

		this.decorators = [];
		this.listeners = {};
		this.events = [];

		// create attributes
		this.attributeByName = {};

		this.attributes = [];
		var leftovers = [];
		( this.template.m || [] ).forEach( function (template) {
			switch ( template.t ) {
				case ATTRIBUTE:
				case BINDING_FLAG:
				case DECORATOR:
				case EVENT:
				case TRANSITION:
					this$1.attributes.push( createItem({
						owner: this$1,
						parentFragment: this$1.parentFragment,
						template: template
					}) );
					break;

				case DELEGATE_FLAG:
				  this$1.delegate = false;
					break;

				default:
					leftovers.push( template );
					break;
			}
		});

		if ( leftovers.length ) {
			this.attributes.push( new ConditionalAttribute({
				owner: this,
				parentFragment: this.parentFragment,
				template: leftovers
			}) );
		}

		this.attributes.sort( sortAttributes );

		// create children
		if ( options.template.f && !options.deferContent ) {
			this.fragment = new Fragment({
				template: options.template.f,
				owner: this,
				cssIds: null
			});
		}

		this.binding = null; // filled in later
	}

	if ( ContainerItem$$1 ) Element.__proto__ = ContainerItem$$1;
	Element.prototype = Object.create( ContainerItem$$1 && ContainerItem$$1.prototype );
	Element.prototype.constructor = Element;

	Element.prototype.bind = function bind$1 () {
		this.attributes.binding = true;
		this.attributes.forEach( bind );
		this.attributes.binding = false;

		if ( this.fragment ) { this.fragment.bind(); }

		// create two-way binding if necessary
		if ( !this.binding ) { this.recreateTwowayBinding(); }
		else { this.binding.bind(); }
	};

	Element.prototype.createTwowayBinding = function createTwowayBinding () {
		if ( 'twoway' in this ? this.twoway : this.ractive.twoway ) {
			var Binding = selectBinding( this );
			if ( Binding ) {
				var binding = new Binding( this );
				if ( binding && binding.model ) { return binding; }
			}
		}
	};

	Element.prototype.destroyed = function destroyed$1 () {
		var this$1 = this;

		this.attributes.forEach( destroyed );

		if ( !this.parentFragment.delegate ) {
			var ls = this.listeners;
			for ( var k in ls ) {
				if ( ls[k] && ls[k].length ) { this$1.node.removeEventListener( k, handler ); }
			}
		}

		if ( this.fragment ) { this.fragment.destroyed(); }
	};

	Element.prototype.detach = function detach () {
		// if this element is no longer rendered, the transitions are complete and the attributes can be torn down
		if ( !this.rendered ) { this.destroyed(); }

		return detachNode( this.node );
	};

	Element.prototype.find = function find ( selector, options ) {
		if ( this.node && matches( this.node, selector ) ) { return this.node; }
		if ( this.fragment ) {
			return this.fragment.find( selector, options );
		}
	};

	Element.prototype.findAll = function findAll ( selector, options ) {
		var result = options.result;

		if ( matches( this.node, selector ) ) {
			result.push( this.node );
		}

		if ( this.fragment ) {
			this.fragment.findAll( selector, options );
		}
	};

	Element.prototype.findNextNode = function findNextNode () {
		return null;
	};

	Element.prototype.firstNode = function firstNode () {
		return this.node;
	};

	Element.prototype.getAttribute = function getAttribute ( name ) {
		var attribute = this.attributeByName[ name ];
		return attribute ? attribute.getValue() : undefined;
	};

	Element.prototype.getContext = function getContext () {
		var assigns = [], len = arguments.length;
		while ( len-- ) assigns[ len ] = arguments[ len ];

		if ( this.fragment ) { return (ref = this.fragment).getContext.apply( ref, assigns ); }

		if ( !this.ctx ) { this.ctx = new Context( this.parentFragment, this ); }
		assigns.unshift( Object.create( this.ctx ) );
		return Object.assign.apply( null, assigns );
		var ref;
	};

	Element.prototype.off = function off ( event, callback, capture ) {
		if ( capture === void 0 ) capture = false;

		var delegate = this.parentFragment.delegate;
		var ref = this.listeners[event];

		if ( !ref ) { return; }
		removeFromArray( ref, callback );

		if ( delegate ) {
			var listeners = delegate.listeners[event] || ( delegate.listeners[event] = [] );
			if ( listeners.refs && !--listeners.refs ) { delegate.off( event, delegateHandler, true ); }
		} else if ( this.rendered ) {
			var n = this.node;
			var add = n.addEventListener;
			var rem = n.removeEventListener;

			if ( !ref.length ) {
				rem.call( n, event, handler, capture );
			} else if ( ref.length && !ref.refs && capture ) {
				rem.call( n, event, handler, true );
				add.call( n, event, handler, false );
			}
		}
	};

	Element.prototype.on = function on ( event, callback, capture ) {
		if ( capture === void 0 ) capture = false;

		var delegate = this.parentFragment.delegate;
		var ref = this.listeners[event] || ( this.listeners[event] = [] );

		if ( delegate ) {
			var listeners = delegate.listeners[event] || ( delegate.listeners[event] = [] );
			if ( !listeners.refs ) {
				listeners.refs = 0;
				delegate.on( event, delegateHandler, true );
				listeners.refs++;
			} else {
				listeners.refs++;
			}
		} else if ( this.rendered ) {
			var n = this.node;
			var add = n.addEventListener;
			var rem = n.removeEventListener;

			if ( !ref.length ) {
				add.call( n, event, handler, capture );
			} else if ( ref.length && !ref.refs && capture ) {
				rem.call( n, event, handler, false );
				add.call( n, event, handler, true );
			}
		}

		addToArray( this.listeners[event], callback );
	};

	Element.prototype.recreateTwowayBinding = function recreateTwowayBinding () {
		if ( this.binding ) {
			this.binding.unbind();
			this.binding.unrender();
		}

		if ( this.binding = this.createTwowayBinding() ) {
			this.binding.bind();
			if ( this.rendered ) { this.binding.render(); }
		}
	};

	Element.prototype.render = function render$1 ( target, occupants ) {
		var this$1 = this;

		// TODO determine correct namespace
		this.namespace = getNamespace( this );

		var node;
		var existing = false;

		if ( occupants ) {
			var n;
			while ( ( n = occupants.shift() ) ) {
				if ( n.nodeName.toUpperCase() === this$1.template.e.toUpperCase() && n.namespaceURI === this$1.namespace ) {
					this$1.node = node = n;
					existing = true;
					break;
				} else {
					detachNode( n );
				}
			}
		}

		if ( !node ) {
			var name = this.template.e;
			node = createElement( this.namespace === html ? name.toLowerCase() : name, this.namespace, this.getAttribute( 'is' ) );
			this.node = node;
		}

		// tie the node to this vdom element
		Object.defineProperty( node, '_ractive', {
			value: {
				proxy: this
			}
		});

		// Is this a top-level node of a component? If so, we may need to add
		// a data-ractive-css attribute, for CSS encapsulation
		if ( this.parentFragment.cssIds ) {
			node.setAttribute( 'data-ractive-css', this.parentFragment.cssIds.map( function (x) { return ("{" + x + "}"); } ).join( ' ' ) );
		}

		if ( existing && this.foundNode ) { this.foundNode( node ); }

		// register intro before rendering content so children can find the intro
		var intro = this.intro;
		if ( intro && intro.shouldFire( 'intro' ) ) {
			intro.isIntro = true;
			intro.isOutro = false;
			runloop.registerTransition( intro );
		}

		if ( this.fragment ) {
			var children = existing ? toArray( node.childNodes ) : undefined;

			this.fragment.render( node, children );

			// clean up leftover children
			if ( children ) {
				children.forEach( detachNode );
			}
		}

		if ( existing ) {
			// store initial values for two-way binding
			if ( this.binding && this.binding.wasUndefined ) { this.binding.setFromNode( node ); }
			// remove unused attributes
			var i = node.attributes.length;
			while ( i-- ) {
				var name$1 = node.attributes[i].name;
				if ( !( name$1 in this$1.attributeByName ) ){ node.removeAttribute( name$1 ); }
			}
		}

		this.attributes.forEach( render );
		if ( this.binding ) { this.binding.render(); }

		if ( !this.parentFragment.delegate ) {
			var ls = this.listeners;
			for ( var k in ls ) {
				if ( ls[k] && ls[k].length ) { this$1.node.addEventListener( k, handler, !!ls[k].refs ); }
			}
		}

		if ( !existing ) {
			target.appendChild( node );
		}

		this.rendered = true;
	};

	Element.prototype.toString = function toString$$1 () {
		var tagName = this.template.e;

		var attrs = this.attributes.map( stringifyAttribute ).join( '' );

		// Special case - selected options
		if ( this.name === 'option' && this.isSelected() ) {
			attrs += ' selected';
		}

		// Special case - two-way radio name bindings
		if ( this.name === 'input' && inputIsCheckedRadio( this ) ) {
			attrs += ' checked';
		}

		// Special case style and class attributes and directives
		var style, cls;
		this.attributes.forEach( function (attr) {
			if ( attr.name === 'class' ) {
				cls = ( cls || '' ) + ( cls ? ' ' : '' ) + safeAttributeString( attr.getString() );
			} else if ( attr.name === 'style' ) {
				style = ( style || '' ) + ( style ? ' ' : '' ) + safeAttributeString( attr.getString() );
				if ( style && !endsWithSemi.test( style ) ) { style += ';'; }
			} else if ( attr.style ) {
				style = ( style || '' ) + ( style ? ' ' : '' ) +  (attr.style) + ": " + (safeAttributeString( attr.getString() )) + ";";
			} else if ( attr.inlineClass && attr.getValue() ) {
				cls = ( cls || '' ) + ( cls ? ' ' : '' ) + attr.inlineClass;
			}
		});
		// put classes first, then inline style
		if ( style !== undefined ) { attrs = ' style' + ( style ? ("=\"" + style + "\"") : '' ) + attrs; }
		if ( cls !== undefined ) { attrs = ' class' + (cls ? ("=\"" + cls + "\"") : '') + attrs; }

		if ( this.parentFragment.cssIds ) {
			attrs += " data-ractive-css=\"" + (this.parentFragment.cssIds.map( function (x) { return ("{" + x + "}"); } ).join( ' ' )) + "\"";
		}

		var str = "<" + tagName + attrs + ">";

		if ( this.isVoid ) { return str; }

		// Special case - textarea
		if ( this.name === 'textarea' && this.getAttribute( 'value' ) !== undefined ) {
			str += escapeHtml( this.getAttribute( 'value' ) );
		}

		// Special case - contenteditable
		else if ( this.getAttribute( 'contenteditable' ) !== undefined ) {
			str += ( this.getAttribute( 'value' ) || '' );
		}

		if ( this.fragment ) {
			str += this.fragment.toString( !/^(?:script|style)$/i.test( this.template.e ) ); // escape text unless script/style
		}

		str += "</" + tagName + ">";
		return str;
	};

	Element.prototype.unbind = function unbind$1 () {
		this.attributes.unbinding = true;
		this.attributes.forEach( unbind );
		this.attributes.unbinding = false;

		if ( this.binding ) { this.binding.unbind(); }
		if ( this.fragment ) { this.fragment.unbind(); }
	};

	Element.prototype.unrender = function unrender$$1 ( shouldDestroy ) {
		if ( !this.rendered ) { return; }
		this.rendered = false;

		// unrendering before intro completed? complete it now
		// TODO should be an API for aborting transitions
		var transition = this.intro;
		if ( transition && transition.complete ) { transition.complete(); }

		// Detach as soon as we can
		if ( this.name === 'option' ) {
			// <option> elements detach immediately, so that
			// their parent <select> element syncs correctly, and
			// since option elements can't have transitions anyway
			this.detach();
		} else if ( shouldDestroy ) {
			runloop.detachWhenReady( this );
		}

		// outro transition
		var outro = this.outro;
		if ( outro && outro.shouldFire( 'outro' ) ) {
			outro.isIntro = false;
			outro.isOutro = true;
			runloop.registerTransition( outro );
		}

		if ( this.fragment ) { this.fragment.unrender(); }

		if ( this.binding ) { this.binding.unrender(); }
	};

	Element.prototype.update = function update$1 () {
		if ( this.dirty ) {
			this.dirty = false;

			this.attributes.forEach( update );

			if ( this.fragment ) { this.fragment.update(); }
		}
	};

	return Element;
}(ContainerItem));

var toFront = [ 'min', 'max', 'class', 'type' ];
function sortAttributes ( left, right ) {
	left = left.name;
	right = right.name;
	var l = left === 'value' ? 1 : ~toFront.indexOf( left );
	var r = right === 'value' ? 1 : ~toFront.indexOf( right );
	return l < r ? -1 : l > r ? 1 : 0;
}

function inputIsCheckedRadio ( element ) {
	var nameAttr = element.attributeByName.name;
	return element.getAttribute( 'type' ) === 'radio' &&
		( nameAttr || {} ).interpolator &&
		element.getAttribute( 'value' ) === nameAttr.interpolator.model.get();
}

function stringifyAttribute ( attribute ) {
	var str = attribute.toString();
	return str ? ' ' + str : '';
}

function getNamespace ( element ) {
	// Use specified namespace...
	var xmlns$$1 = element.getAttribute( 'xmlns' );
	if ( xmlns$$1 ) { return xmlns$$1; }

	// ...or SVG namespace, if this is an <svg> element
	if ( element.name === 'svg' ) { return svg$1; }

	var parent = element.parent;

	if ( parent ) {
		// ...or HTML, if the parent is a <foreignObject>
		if ( parent.name === 'foreignobject' ) { return html; }

		// ...or inherit from the parent node
		return parent.node.namespaceURI;
	}

	return element.ractive.el.namespaceURI;
}

function delegateHandler ( ev ) {
	var name = ev.type;
	var end = ev.currentTarget;
	var node = ev.target;
	var bubble = true;
	var listeners;

	// starting with the origin node, walk up the DOM looking for ractive nodes with a matching event listener
	while ( bubble && node && node !== end ) {
		var proxy = node._ractive && node._ractive.proxy;
		if ( proxy && proxy.parentFragment.delegate ) {
			listeners = proxy.listeners[name];

			if ( listeners ) {
				listeners.forEach( function (l) {
					bubble = l.call( node, ev ) !== false && bubble;
				});
			}
		}

		node = node.parentNode;
	}

	return bubble;
}

function handler ( ev ) {
	var this$1 = this;

	var el = this._ractive.proxy;
	if ( !el.listeners[ ev.type ] ) { return; }
	el.listeners[ ev.type ].forEach( function (l) { return l.call( this$1, ev ); } );
}

var Form = (function (Element$$1) {
	function Form ( options ) {
		Element$$1.call( this, options );
		this.formBindings = [];
	}

	if ( Element$$1 ) Form.__proto__ = Element$$1;
	Form.prototype = Object.create( Element$$1 && Element$$1.prototype );
	Form.prototype.constructor = Form;

	Form.prototype.render = function render ( target, occupants ) {
		Element$$1.prototype.render.call( this, target, occupants );
		this.on( 'reset', handleReset );
	};

	Form.prototype.unrender = function unrender ( shouldDestroy ) {
		this.off( 'reset', handleReset );
		Element$$1.prototype.unrender.call( this, shouldDestroy );
	};

	return Form;
}(Element));

function handleReset () {
	var element = this._ractive.proxy;

	runloop.start();
	element.formBindings.forEach( updateModel );
	runloop.end();
}

function updateModel ( binding ) {
	binding.model.set( binding.resetValue );
}

var DOMEvent = function DOMEvent ( name, owner ) {
	if ( name.indexOf( '*' ) !== -1 ) {
		fatal( ("Only component proxy-events may contain \"*\" wildcards, <" + (owner.name) + " on-" + name + "=\"...\"/> is not valid") );
	}

	this.name = name;
	this.owner = owner;
	this.handler = null;
};

DOMEvent.prototype.listen = function listen ( directive ) {
	var node = this.owner.node;
	var name = this.name;

	// this is probably a custom event fired from a decorator or manually
	if ( !( ("on" + name) in node ) ) { return; }

	this.owner.on( name, this.handler = function ( event ) {
		return directive.fire({
			node: node,
			original: event,
			event: event,
			name: name
		});
	});
};

DOMEvent.prototype.unlisten = function unlisten () {
	if ( this.handler ) { this.owner.off( this.name, this.handler ); }
};

var CustomEvent = function CustomEvent ( eventPlugin, owner, name ) {
	this.eventPlugin = eventPlugin;
	this.owner = owner;
	this.name = name;
	this.handler = null;
};

CustomEvent.prototype.listen = function listen ( directive ) {
		var this$1 = this;

	var node = this.owner.node;

	this.handler = this.eventPlugin( node, function ( event ) {
			if ( event === void 0 ) event = {};

		if ( event.original ) { event.event = event.original; }
		else { event.original = event.event; }

		event.name = this$1.name;
		event.node = event.node || node;
		return directive.fire( event );
	});
};

CustomEvent.prototype.unlisten = function unlisten () {
	this.handler.teardown();
};

var RactiveEvent = function RactiveEvent ( component, name ) {
	this.component = component;
	this.name = name;
	this.handler = null;
};

RactiveEvent.prototype.listen = function listen ( directive ) {
	var ractive = this.component.instance;

	this.handler = ractive.on( this.name, function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];

		// watch for reproxy
		if ( args[0] instanceof Context ) {
			var ctx = args.shift();
			ctx.component = ractive;
			directive.fire( ctx, args );
		} else {
			directive.fire( {}, args );
		}

		// cancel bubbling
		return false;
	});
};

RactiveEvent.prototype.unlisten = function unlisten () {
	this.handler.cancel();
};

var specialPattern = /^(event|arguments|@node|@event|@context)(\..+)?$/;
var dollarArgsPattern = /^\$(\d+)(\..+)?$/;

var EventDirective = function EventDirective ( options ) {
	var this$1 = this;

	this.owner = options.owner || options.parentFragment.owner || findElement( options.parentFragment );
	this.element = this.owner.attributeByName ? this.owner : findElement( options.parentFragment, true );
	this.template = options.template;
	this.parentFragment = options.parentFragment;
	this.ractive = options.parentFragment.ractive;
	//const delegate = this.delegate = this.ractive.delegate && options.parentFragment.delegate;
	this.events = [];

	if ( this.element.type === COMPONENT || this.element.type === ANCHOR ) {
		this.template.n.forEach( function (n) {
			this$1.events.push( new RactiveEvent( this$1.element, n ) );
		});
	} else {
		// make sure the delegate element has a storag object
		//if ( delegate && !delegate.delegates ) delegate.delegates = {};

		this.template.n.forEach( function (n) {
			var fn = findInViewHierarchy( 'events', this$1.ractive, n );
			if ( fn ) {
				this$1.events.push( new CustomEvent( fn, this$1.element, n ) );
			} else {
				/*if ( delegate ) {
					if ( !delegate.delegates[n] ) {
						const ev = new DOMEvent( n, delegate, true );
						delegate.delegates[n] = ev;
						// if the element is already rendered, render the event too
						if ( delegate.rendered ) ev.listen( DelegateProxy );
					}
				} else {
					this.events.push( new DOMEvent( n, this.element ) );
				}*/
				this$1.events.push( new DOMEvent( n, this$1.element ) );
			}
		});
	}

	// method calls
	this.models = null;
};

EventDirective.prototype.bind = function bind () {
	addToArray( this.element.events, this );

	setupArgsFn( this, this.template );
	if ( !this.fn ) { this.action = this.template.f; }
};

EventDirective.prototype.destroyed = function destroyed () {
	this.events.forEach( function (e) { return e.unlisten(); } );
};

EventDirective.prototype.fire = function fire ( event, args ) {
		var this$1 = this;
		if ( args === void 0 ) args = [];

	var context = this.element.getContext( event );

	if ( this.fn ) {
		var values = [];

		var models = resolveArgs( this, this.template, this.parentFragment, {
			specialRef: function specialRef ( ref ) {
				var specialMatch = specialPattern.exec( ref );
				if ( specialMatch ) {
					// on-click="foo(event.node)"
					return {
						special: specialMatch[1],
						keys: specialMatch[2] ? splitKeypath( specialMatch[2].substr(1) ) : []
					};
				}

				var dollarMatch = dollarArgsPattern.exec( ref );
				if ( dollarMatch ) {
					// on-click="foo($1)"
					return {
						special: 'arguments',
						keys: [ dollarMatch[1] - 1 ].concat( dollarMatch[2] ? splitKeypath( dollarMatch[2].substr( 1 ) ) : [] )
					};
				}
			}
		});

		if ( models ) {
			models.forEach( function (model) {
				if ( !model ) { return values.push( undefined ); }

				if ( model.special ) {
					var which = model.special;
					var obj;

					if ( which === '@node' ) {
						obj = this$1.element.node;
					} else if ( which === '@event' ) {
						obj = event && event.event;
					} else if ( which === 'event' ) {
						warnOnceIfDebug( "The event reference available to event directives is deprecated and should be replaced with @context and @event" );
						obj = context;
					} else if ( which === '@context' ) {
						obj = context;
					} else {
						obj = args;
					}

					var keys = model.keys.slice();

					while ( obj && keys.length ) { obj = obj[ keys.shift() ]; }
					return values.push( obj );
				}

				if ( model.wrapper ) {
					return values.push( model.wrapperValue );
				}

				values.push( model.get() );
			});
		}

		// make event available as `this.event`
		var ractive = this.ractive;
		var oldEvent = ractive.event;

		ractive.event = context;
		var returned = this.fn.apply( ractive, values );
		var result = returned.pop();

		// Auto prevent and stop if return is explicitly false
		if ( result === false ) {
			var original = event ? event.original : undefined;
			if ( original ) {
				original.preventDefault && original.preventDefault();
				original.stopPropagation && original.stopPropagation();
			} else {
				warnOnceIfDebug( ("handler '" + (this.template.n.join( ' ' )) + "' returned false, but there is no event available to cancel") );
			}
		}

		// watch for proxy events
		else if ( !returned.length && Array.isArray( result ) && typeof result[0] === 'string' ) {
			result = fireEvent( this.ractive, result.shift(), context, result );
		}

		ractive.event = oldEvent;

		return result;
	}

	else {
		return fireEvent( this.ractive, this.action, context, args);
	}
};

EventDirective.prototype.handleChange = function handleChange () {};

EventDirective.prototype.render = function render () {
		var this$1 = this;

	// render events after everything else, so they fire after bindings
	runloop.scheduleTask( function () { return this$1.events.forEach( function (e) { return e.listen( this$1 ); }, true ); } );
};

EventDirective.prototype.toString = function toString () { return ''; };

EventDirective.prototype.unbind = function unbind () {
	removeFromArray( this.element.events, this );
};

EventDirective.prototype.unrender = function unrender () {
	this.events.forEach( function (e) { return e.unlisten(); } );
};

EventDirective.prototype.update = noop;

function progressiveText ( item, target, occupants, text ) {
	if ( occupants ) {
		var n = occupants[0];
		if ( n && n.nodeType === 3 ) {
			var idx = n.nodeValue.indexOf( text );
			occupants.shift();

			if ( idx === 0 ) {
				if ( n.nodeValue.length !== text.length ) {
					occupants.unshift( n.splitText( text.length ) );
				}
			} else {
				n.nodeValue = text;
			}
		} else {
			n = item.node = doc.createTextNode( text );
			if ( occupants[0] ) {
				target.insertBefore( n, occupants[0] );
			} else {
				target.appendChild( n );
			}
		}

		item.node = n;
	} else {
		if ( !item.node ) { item.node = doc.createTextNode( text ); }
		target.appendChild( item.node );
	}
}

var Mustache = (function (Item$$1) {
	function Mustache ( options ) {
		Item$$1.call( this, options );

		this.parentFragment = options.parentFragment;
		this.template = options.template;
		this.index = options.index;
		if ( options.owner ) { this.parent = options.owner; }

		this.isStatic = !!options.template.s;

		this.model = null;
		this.dirty = false;
	}

	if ( Item$$1 ) Mustache.__proto__ = Item$$1;
	Mustache.prototype = Object.create( Item$$1 && Item$$1.prototype );
	Mustache.prototype.constructor = Mustache;

	Mustache.prototype.bind = function bind () {
		// yield mustaches should resolve in container context
		var start = this.containerFragment || this.parentFragment;
		// try to find a model for this view
		var model = resolve( start, this.template );

		if ( model ) {
			var value = model.get();

			if ( this.isStatic ) {
				this.model = { get: function () { return value; } };
				return;
			}

			model.register( this );
			this.model = model;
		}
	};

	Mustache.prototype.handleChange = function handleChange () {
		this.bubble();
	};

	Mustache.prototype.rebind = function rebind ( next, previous, safe ) {
		next = rebindMatch( this.template, next, previous, this.parentFragment );
		if ( next === this.model ) { return false; }

		if ( this.model ) {
			this.model.unregister( this );
		}
		if ( next ) { next.addShuffleRegister( this, 'mark' ); }
		this.model = next;
		if ( !safe ) { this.handleChange(); }
		return true;
	};

	Mustache.prototype.unbind = function unbind () {
		if ( !this.isStatic ) {
			this.model && this.model.unregister( this );
			this.model = undefined;
		}
	};

	return Mustache;
}(Item));

var MustacheContainer = (function (ContainerItem$$1) {
	function MustacheContainer ( options ) {
		ContainerItem$$1.call( this, options );
	}

	if ( ContainerItem$$1 ) MustacheContainer.__proto__ = ContainerItem$$1;
	MustacheContainer.prototype = Object.create( ContainerItem$$1 && ContainerItem$$1.prototype );
	MustacheContainer.prototype.constructor = MustacheContainer;

	return MustacheContainer;
}(ContainerItem));
var proto$3 = MustacheContainer.prototype;
var mustache = Mustache.prototype;
proto$3.bind = mustache.bind;
proto$3.handleChange = mustache.handleChange;
proto$3.rebind = mustache.rebind;
proto$3.unbind = mustache.unbind;

var Interpolator = (function (Mustache$$1) {
	function Interpolator () {
		Mustache$$1.apply(this, arguments);
	}

	if ( Mustache$$1 ) Interpolator.__proto__ = Mustache$$1;
	Interpolator.prototype = Object.create( Mustache$$1 && Mustache$$1.prototype );
	Interpolator.prototype.constructor = Interpolator;

	Interpolator.prototype.bubble = function bubble () {
		if ( this.owner ) { this.owner.bubble(); }
		Mustache$$1.prototype.bubble.call(this);
	};

	Interpolator.prototype.detach = function detach () {
		return detachNode( this.node );
	};

	Interpolator.prototype.firstNode = function firstNode () {
		return this.node;
	};

	Interpolator.prototype.getString = function getString () {
		return this.model ? safeToStringValue( this.model.get() ) : '';
	};

	Interpolator.prototype.render = function render ( target, occupants ) {
		if ( inAttributes() ) { return; }
		var value = this.getString();

		this.rendered = true;

		progressiveText( this, target, occupants, value );
	};

	Interpolator.prototype.toString = function toString ( escape ) {
		var string = this.getString();
		return escape ? escapeHtml( string ) : string;
	};

	Interpolator.prototype.unrender = function unrender ( shouldDestroy ) {
		if ( shouldDestroy ) { this.detach(); }
		this.rendered = false;
	};

	Interpolator.prototype.update = function update () {
		if ( this.dirty ) {
			this.dirty = false;
			if ( this.rendered ) {
				this.node.data = this.getString();
			}
		}
	};

	Interpolator.prototype.valueOf = function valueOf () {
		return this.model ? this.model.get() : undefined;
	};

	return Interpolator;
}(Mustache));

var Input = (function (Element$$1) {
	function Input () {
		Element$$1.apply(this, arguments);
	}

	if ( Element$$1 ) Input.__proto__ = Element$$1;
	Input.prototype = Object.create( Element$$1 && Element$$1.prototype );
	Input.prototype.constructor = Input;

	Input.prototype.render = function render ( target, occupants ) {
		Element$$1.prototype.render.call( this, target, occupants );
		this.node.defaultValue = this.node.value;
	};
	Input.prototype.compare = function compare ( value, attrValue ) {
		var comparator = this.getAttribute( 'value-comparator' );
		if ( comparator ) {
			if ( typeof comparator === 'function' ) {
				return comparator( value, attrValue );
			}
			if (value && attrValue) {
				return value[comparator] == attrValue[comparator];
			}
		}
		return value == attrValue;
	};

	return Input;
}(Element));

// simple JSON parser, without the restrictions of JSON parse
// (i.e. having to double-quote keys).
//
// If passed a hash of values as the second argument, ${placeholders}
// will be replaced with those values

var specials$1 = {
	true: true,
	false: false,
	null: null,
	undefined: undefined
};

var specialsPattern = new RegExp( '^(?:' + Object.keys( specials$1 ).join( '|' ) + ')' );
var numberPattern$1 = /^(?:[+-]?)(?:(?:(?:0|[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/;
var placeholderPattern = /\$\{([^\}]+)\}/g;
var placeholderAtStartPattern = /^\$\{([^\}]+)\}/;
var onlyWhitespace = /^\s*$/;

var JsonParser = Parser.extend({
	init: function init ( str, options ) {
		this.values = options.values;
		this.allowWhitespace();
	},

	postProcess: function postProcess ( result ) {
		if ( result.length !== 1 || !onlyWhitespace.test( this.leftover ) ) {
			return null;
		}

		return { value: result[0].v };
	},

	converters: [
		function getPlaceholder ( parser ) {
			if ( !parser.values ) { return null; }

			var placeholder = parser.matchPattern( placeholderAtStartPattern );

			if ( placeholder && ( parser.values.hasOwnProperty( placeholder ) ) ) {
				return { v: parser.values[ placeholder ] };
			}
		},

		function getSpecial ( parser ) {
			var special = parser.matchPattern( specialsPattern );
			if ( special ) { return { v: specials$1[ special ] }; }
		},

		function getNumber ( parser ) {
			var number = parser.matchPattern( numberPattern$1 );
			if ( number ) { return { v: +number }; }
		},

		function getString ( parser ) {
			var stringLiteral = readStringLiteral( parser );
			var values = parser.values;

			if ( stringLiteral && values ) {
				return {
					v: stringLiteral.v.replace( placeholderPattern, function ( match, $1 ) { return ( $1 in values ? values[ $1 ] : $1 ); } )
				};
			}

			return stringLiteral;
		},

		function getObject ( parser ) {
			if ( !parser.matchString( '{' ) ) { return null; }

			var result = {};

			parser.allowWhitespace();

			if ( parser.matchString( '}' ) ) {
				return { v: result };
			}

			var pair;
			while ( pair = getKeyValuePair( parser ) ) {
				result[ pair.key ] = pair.value;

				parser.allowWhitespace();

				if ( parser.matchString( '}' ) ) {
					return { v: result };
				}

				if ( !parser.matchString( ',' ) ) {
					return null;
				}
			}

			return null;
		},

		function getArray ( parser ) {
			if ( !parser.matchString( '[' ) ) { return null; }

			var result = [];

			parser.allowWhitespace();

			if ( parser.matchString( ']' ) ) {
				return { v: result };
			}

			var valueToken;
			while ( valueToken = parser.read() ) {
				result.push( valueToken.v );

				parser.allowWhitespace();

				if ( parser.matchString( ']' ) ) {
					return { v: result };
				}

				if ( !parser.matchString( ',' ) ) {
					return null;
				}

				parser.allowWhitespace();
			}

			return null;
		}
	]
});

function getKeyValuePair ( parser ) {
	parser.allowWhitespace();

	var key = readKey( parser );

	if ( !key ) { return null; }

	var pair = { key: key };

	parser.allowWhitespace();
	if ( !parser.matchString( ':' ) ) {
		return null;
	}
	parser.allowWhitespace();

	var valueToken = parser.read();

	if ( !valueToken ) { return null; }

	pair.value = valueToken.v;
	return pair;
}

var parseJSON = function ( str, values ) {
	var parser = new JsonParser( str, { values: values });
	return parser.result;
};

var Mapping = (function (Item$$1) {
	function Mapping ( options ) {
		Item$$1.call( this, options );

		this.name = options.template.n;

		this.owner = options.owner || options.parentFragment.owner || options.element || findElement( options.parentFragment );
		this.element = options.element || (this.owner.attributeByName ? this.owner : findElement( options.parentFragment ) );
		this.parentFragment = this.element.parentFragment; // shared
		this.ractive = this.parentFragment.ractive;

		this.element.attributeByName[ this.name ] = this;

		this.value = options.template.f;
	}

	if ( Item$$1 ) Mapping.__proto__ = Item$$1;
	Mapping.prototype = Object.create( Item$$1 && Item$$1.prototype );
	Mapping.prototype.constructor = Mapping;

	Mapping.prototype.bind = function bind () {
		var template = this.template.f;
		var viewmodel = this.element.instance.viewmodel;

		if ( template === 0 ) {
			// empty attributes are `true`
			viewmodel.joinKey( this.name ).set( true );
		}

		else if ( typeof template === 'string' ) {
			var parsed = parseJSON( template );
			viewmodel.joinKey( this.name ).set( parsed ? parsed.value : template );
		}

		else if ( Array.isArray( template ) ) {
			createMapping( this, true );
		}
	};

	Mapping.prototype.render = function render () {};

	Mapping.prototype.unbind = function unbind () {
		if ( this.model ) { this.model.unregister( this ); }
		if ( this.boundFragment ) { this.boundFragment.unbind(); }

		if ( this.element.bound ) {
			if ( this.link.target === this.model ) { this.link.owner.unlink(); }
		}
	};

	Mapping.prototype.unrender = function unrender () {};

	Mapping.prototype.update = function update () {
		if ( this.dirty ) {
			this.dirty = false;
			if ( this.boundFragment ) { this.boundFragment.update(); }
		}
	};

	return Mapping;
}(Item));

function createMapping ( item ) {
	var template = item.template.f;
	var viewmodel = item.element.instance.viewmodel;
	var childData = viewmodel.value;

	if ( template.length === 1 && template[0].t === INTERPOLATOR ) {
		var model = resolve( item.parentFragment, template[0] );
		var val = model.get( false );

		// if the interpolator is not static
		if ( !template[0].s ) {
			item.model = model;
			item.link = viewmodel.createLink( item.name, model, template[0].r );

			// initialize parent side of the mapping from child data
			if ( val === undefined && !model.isReadonly && item.name in childData ) {
				model.set( childData[ item.name ] );
			}
		}

		// copy non-object, non-computed vals through
		else if ( typeof val !== 'object' || template[0].x ) {
			viewmodel.joinKey( splitKeypath( item.name ) ).set( val );
		}

		// warn about trying to copy an object
		else {
			warnIfDebug( ("Cannot copy non-computed object value from static mapping '" + (item.name) + "'") );
		}
	}

	else {
		item.boundFragment = new Fragment({
			owner: item,
			template: template
		}).bind();

		item.model = viewmodel.joinKey( splitKeypath( item.name ) );
		item.model.set( item.boundFragment.valueOf() );

		// item is a *bit* of a hack
		item.boundFragment.bubble = function () {
			Fragment.prototype.bubble.call( item.boundFragment );
			// defer this to avoid mucking around model deps if there happens to be an expression involved
			runloop.scheduleTask(function () {
				item.boundFragment.update();
				item.model.set( item.boundFragment.valueOf() );
			});
		};
	}
}

var Option = (function (Element$$1) {
	function Option ( options ) {
		var template = options.template;
		if ( !template.a ) { template.a = {}; }

		// If the value attribute is missing, use the element's content,
		// as long as it isn't disabled
		if ( template.a.value === undefined && !( 'disabled' in template.a ) ) {
			template.a.value = template.f || '';
		}

		Element$$1.call( this, options );

		this.select = findElement( this.parent || this.parentFragment, false, 'select' );
	}

	if ( Element$$1 ) Option.__proto__ = Element$$1;
	Option.prototype = Object.create( Element$$1 && Element$$1.prototype );
	Option.prototype.constructor = Option;

	Option.prototype.bind = function bind () {
		if ( !this.select ) {
			Element$$1.prototype.bind.call(this);
			return;
		}

		// If the select has a value, it overrides the `selected` attribute on
		// this option - so we delete the attribute
		var selectedAttribute = this.attributeByName.selected;
		if ( selectedAttribute && this.select.getAttribute( 'value' ) !== undefined ) {
			var index = this.attributes.indexOf( selectedAttribute );
			this.attributes.splice( index, 1 );
			delete this.attributeByName.selected;
		}

		Element$$1.prototype.bind.call(this);
		this.select.options.push( this );
	};

	Option.prototype.bubble = function bubble () {
		// if we're using content as value, may need to update here
		var value = this.getAttribute( 'value' );
		if ( this.node && this.node.value !== value ) {
			this.node._ractive.value = value;
		}
		Element$$1.prototype.bubble.call(this);
	};

	Option.prototype.getAttribute = function getAttribute ( name ) {
		var attribute = this.attributeByName[ name ];
		return attribute ? attribute.getValue() : name === 'value' && this.fragment ? this.fragment.valueOf() : undefined;
	};

	Option.prototype.isSelected = function isSelected () {
		var this$1 = this;

		var optionValue = this.getAttribute( 'value' );

		if ( optionValue === undefined || !this.select ) {
			return false;
		}

		var selectValue = this.select.getAttribute( 'value' );

		if ( this.select.compare( selectValue, optionValue ) ) {
			return true;
		}

		if ( this.select.getAttribute( 'multiple' ) && Array.isArray( selectValue ) ) {
			var i = selectValue.length;
			while ( i-- ) {
				if ( this$1.select.compare( selectValue[i], optionValue ) ) {
					return true;
				}
			}
		}
	};

	Option.prototype.render = function render ( target, occupants ) {
		Element$$1.prototype.render.call( this, target, occupants );

		if ( !this.attributeByName.value ) {
			this.node._ractive.value = this.getAttribute( 'value' );
		}
	};

	Option.prototype.unbind = function unbind () {
		Element$$1.prototype.unbind.call(this);

		if ( this.select ) {
			removeFromArray( this.select.options, this );
		}
	};

	return Option;
}(Element));

function getPartialTemplate ( ractive, name, parentFragment ) {
	// If the partial in instance or view heirarchy instances, great
	var partial = getPartialFromRegistry( ractive, name, parentFragment || {} );
	if ( partial ) { return partial; }

	// Does it exist on the page as a script tag?
	partial = parser.fromId( name, { noThrow: true } );
	if ( partial ) {
		// parse and register to this ractive instance
		var parsed = parser.parseFor( partial, ractive );

		// register extra partials on the ractive instance if they don't already exist
		if ( parsed.p ) { fillGaps( ractive.partials, parsed.p ); }

		// register (and return main partial if there are others in the template)
		return ractive.partials[ name ] = parsed.t;
	}
}

function getPartialFromRegistry ( ractive, name, parentFragment ) {
	// if there was an instance up-hierarchy, cool
	var partial = findParentPartial( name, parentFragment.owner );
	if ( partial ) { return partial; }

	// find first instance in the ractive or view hierarchy that has this partial
	var instance = findInstance( 'partials', ractive, name );

	if ( !instance ) { return; }

	partial = instance.partials[ name ];

	// partial is a function?
	var fn;
	if ( typeof partial === 'function' ) {
		fn = partial.bind( instance );
		fn.isOwner = instance.partials.hasOwnProperty(name);
		partial = fn.call( ractive, parser );
	}

	if ( !partial && partial !== '' ) {
		warnIfDebug( noRegistryFunctionReturn, name, 'partial', 'partial', { ractive: ractive });
		return;
	}

	// If this was added manually to the registry,
	// but hasn't been parsed, parse it now
	if ( !parser.isParsed( partial ) ) {
		// use the parseOptions of the ractive instance on which it was found
		var parsed = parser.parseFor( partial, instance );

		// Partials cannot contain nested partials!
		// TODO add a test for this
		if ( parsed.p ) {
			warnIfDebug( 'Partials ({{>%s}}) cannot contain nested inline partials', name, { ractive: ractive });
		}

		// if fn, use instance to store result, otherwise needs to go
		// in the correct point in prototype chain on instance or constructor
		var target = fn ? instance : findOwner( instance, name );

		// may be a template with partials, which need to be registered and main template extracted
		target.partials[ name ] = partial = parsed.t;
	}

	// store for reset
	if ( fn ) { partial._fn = fn; }

	return partial.v ? partial.t : partial;
}

function findOwner ( ractive, key ) {
	return ractive.partials.hasOwnProperty( key )
		? ractive
		: findConstructor( ractive.constructor, key);
}

function findConstructor ( constructor, key ) {
	if ( !constructor ) { return; }
	return constructor.partials.hasOwnProperty( key )
		? constructor
		: findConstructor( constructor.Parent, key );
}

function findParentPartial( name, parent ) {
	if ( parent ) {
		if ( parent.template && parent.template.p && parent.template.p[name] ) {
			return parent.template.p[name];
		} else if ( parent.parentFragment && parent.parentFragment.owner ) {
			return findParentPartial( name, parent.parentFragment.owner );
		}
	}
}

var Partial = (function (MustacheContainer$$1) {
	function Partial ( options ) {
		MustacheContainer$$1.call( this, options );

		this.yielder = options.template.t === YIELDER;

		if ( this.yielder ) {
			this.container = options.parentFragment.ractive;
			this.component = this.container.component;

			this.containerFragment = options.parentFragment;
			this.parentFragment = this.component.parentFragment;

			// {{yield}} is equivalent to {{yield content}}
			if ( !options.template.r && !options.template.rx && !options.template.x ) { options.template.r = 'content'; }
		}
	}

	if ( MustacheContainer$$1 ) Partial.__proto__ = MustacheContainer$$1;
	Partial.prototype = Object.create( MustacheContainer$$1 && MustacheContainer$$1.prototype );
	Partial.prototype.constructor = Partial;

	Partial.prototype.bind = function bind () {
		var this$1 = this;

		// keep track of the reference name for future resets
		this.refName = this.template.r;

		// name matches take priority over expressions
		var template = this.refName ? getPartialTemplate( this.ractive, this.refName, this.parentFragment ) || null : null;
		var templateObj;

		if ( template ) {
			this.named = true;
			this.setTemplate( this.template.r, template );
		}

		if ( !template ) {
			MustacheContainer$$1.prototype.bind.call(this);
			if ( ( templateObj = this.model.get() ) && typeof templateObj === 'object' && ( typeof templateObj.template === 'string' || Array.isArray( templateObj.t ) ) ) {
				if ( templateObj.template ) {
					this.source = templateObj.template;
					templateObj = parsePartial( this.template.r, templateObj.template, this.ractive );
				} else {
					this.source = templateObj.t;
				}
				this.setTemplate( this.template.r, templateObj.t );
			} else if ( typeof this.model.get() !== 'string' && this.refName ) {
				this.setTemplate( this.refName, template );
			} else {
				this.setTemplate( this.model.get() );
			}
		}

		var options = {
			owner: this,
			template: this.partialTemplate
		};

		if ( this.template.c ) {
			options.template = [{ t: SECTION, n: SECTION_WITH, f: options.template }];
			for ( var k in this$1.template.c ) {
				options.template[0][k] = this$1.template.c[k];
			}
		}

		if ( this.yielder ) {
			options.ractive = this.container.parent;
		}

		this.fragment = new Fragment(options);
		if ( this.template.z ) {
			this.fragment.aliases = resolveAliases( this.template.z, this.yielder ? this.containerFragment : this.parentFragment );
		}
		this.fragment.bind();
	};

	Partial.prototype.bubble = function bubble () {
		if ( this.yielder && !this.dirty ) {
			this.containerFragment.bubble();
			this.dirty = true;
		} else {
			MustacheContainer$$1.prototype.bubble.call(this);
		}
	};

	Partial.prototype.findNextNode = function findNextNode () {
		return this.yielder ? this.containerFragment.findNextNode( this ) : MustacheContainer$$1.prototype.findNextNode.call(this);
	};

	Partial.prototype.forceResetTemplate = function forceResetTemplate () {
		var this$1 = this;

		this.partialTemplate = undefined;

		// on reset, check for the reference name first
		if ( this.refName ) {
			this.partialTemplate = getPartialTemplate( this.ractive, this.refName, this.parentFragment );
		}

		// then look for the resolved name
		if ( !this.partialTemplate ) {
			this.partialTemplate = getPartialTemplate( this.ractive, this.name, this.parentFragment );
		}

		if ( !this.partialTemplate ) {
			warnOnceIfDebug( ("Could not find template for partial '" + (this.name) + "'") );
			this.partialTemplate = [];
		}

		if ( this.inAttribute ) {
			doInAttributes( function () { return this$1.fragment.resetTemplate( this$1.partialTemplate ); } );
		} else {
			this.fragment.resetTemplate( this.partialTemplate );
		}

		this.bubble();
	};

	Partial.prototype.render = function render ( target, occupants ) {
		return this.fragment.render( target, occupants );
	};

	Partial.prototype.setTemplate = function setTemplate ( name, template ) {
		this.name = name;

		if ( !template && template !== null ) { template = getPartialTemplate( this.ractive, name, this.parentFragment ); }

		if ( !template ) {
			warnOnceIfDebug( ("Could not find template for partial '" + name + "'") );
		}

		this.partialTemplate = template || [];
	};

	Partial.prototype.unbind = function unbind () {
		MustacheContainer$$1.prototype.unbind.call(this);
		this.fragment.aliases = {};
		this.fragment.unbind();
	};

	Partial.prototype.unrender = function unrender ( shouldDestroy ) {
		this.fragment.unrender( shouldDestroy );
	};

	Partial.prototype.update = function update () {
		var template;

		if ( this.dirty ) {
			this.dirty = false;

			if ( !this.named ) {
				if ( this.model ) {
					template = this.model.get();
				}

				if ( template && typeof template === 'string' && template !== this.name ) {
					this.setTemplate( template );
					this.fragment.resetTemplate( this.partialTemplate );
				} else if ( template && typeof template === 'object' && ( typeof template.template === 'string' || Array.isArray( template.t ) ) ) {
					if ( template.t !== this.source && template.template !== this.source ) {
						if ( template.template ) {
							this.source = template.template;
							template = parsePartial( this.name, template.template, this.ractive );
						} else {
							this.source = template.t;
						}
						this.setTemplate( this.name, template.t );
						this.fragment.resetTemplate( this.partialTemplate );
					}
				}
			}

			this.fragment.update();
		}
	};

	return Partial;
}(MustacheContainer));

function parsePartial( name, partial, ractive ) {
	var parsed;

	try {
		parsed = parser.parse( partial, parser.getParseOptions( ractive ) );
	} catch (e) {
		warnIfDebug( ("Could not parse partial from expression '" + name + "'\n" + (e.message)) );
	}

	return parsed || { t: [] };
}

var RepeatedFragment = function RepeatedFragment ( options ) {
	this.parent = options.owner.parentFragment;

	// bit of a hack, so reference resolution works without another
	// layer of indirection
	this.parentFragment = this;
	this.owner = options.owner;
	this.ractive = this.parent.ractive;
	this.delegate = this.parent.delegate || findElement( options.owner );
	// delegation disabled by directive
	if ( this.delegate && this.delegate.delegate === false ) { this.delegate = false; }

	// encapsulated styles should be inherited until they get applied by an element
	this.cssIds = 'cssIds' in options ? options.cssIds : ( this.parent ? this.parent.cssIds : null );

	this.context = null;
	this.rendered = false;
	this.iterations = [];

	this.template = options.template;

	this.indexRef = options.indexRef;
	this.keyRef = options.keyRef;

	this.pendingNewIndices = null;
	this.previousIterations = null;

	// track array versus object so updates of type rest
	this.isArray = false;
};

RepeatedFragment.prototype.bind = function bind$$1 ( context ) {
		var this$1 = this;

	this.context = context;
	var value = context.get();

	// {{#each array}}...
	if ( this.isArray = Array.isArray( value ) ) {
		// we can't use map, because of sparse arrays
		this.iterations = [];
		var max = value.length;
		for ( var i = 0; i < max; i += 1 ) {
			this$1.iterations[i] = this$1.createIteration( i, i );
		}
	}

	// {{#each object}}...
	else if ( isObject( value ) ) {
		this.isArray = false;

		// TODO this is a dreadful hack. There must be a neater way
		if ( this.indexRef ) {
			var refs = this.indexRef.split( ',' );
			this.keyRef = refs[0];
			this.indexRef = refs[1];
		}

		this.iterations = Object.keys( value ).map( function ( key, index ) {
			return this$1.createIteration( key, index );
		});
	}

	return this;
};

RepeatedFragment.prototype.bubble = function bubble ( index ) {
	if  ( !this.bubbled ) { this.bubbled = []; }
	this.bubbled.push( index );

	this.owner.bubble();
};

RepeatedFragment.prototype.createIteration = function createIteration ( key, index ) {
	var fragment = new Fragment({
		owner: this,
		template: this.template
	});

	fragment.key = key;
	fragment.index = index;
	fragment.isIteration = true;
	fragment.delegate = this.delegate;

	var model = this.context.joinKey( key );

	// set up an iteration alias if there is one
	if ( this.owner.template.z ) {
		fragment.aliases = {};
		fragment.aliases[ this.owner.template.z[0].n ] = model;
	}

	return fragment.bind( model );
};

RepeatedFragment.prototype.destroyed = function destroyed$1 () {
	this.iterations.forEach( destroyed );
};

RepeatedFragment.prototype.detach = function detach () {
	var docFrag = createDocumentFragment();
	this.iterations.forEach( function (fragment) { return docFrag.appendChild( fragment.detach() ); } );
	return docFrag;
};

RepeatedFragment.prototype.find = function find ( selector, options ) {
	return findMap( this.iterations, function (i) { return i.find( selector, options ); } );
};

RepeatedFragment.prototype.findAll = function findAll ( selector, options ) {
	return this.iterations.forEach( function (i) { return i.findAll( selector, options ); } );
};

RepeatedFragment.prototype.findComponent = function findComponent ( name, options ) {
	return findMap( this.iterations, function (i) { return i.findComponent( name, options ); } );
};

RepeatedFragment.prototype.findAllComponents = function findAllComponents ( name, options ) {
	return this.iterations.forEach( function (i) { return i.findAllComponents( name, options ); } );
};

RepeatedFragment.prototype.findNextNode = function findNextNode ( iteration ) {
		var this$1 = this;

	if ( iteration.index < this.iterations.length - 1 ) {
		for ( var i = iteration.index + 1; i < this.iterations.length; i++ ) {
			var node = this$1.iterations[ i ].firstNode( true );
			if ( node ) { return node; }
		}
	}

	return this.owner.findNextNode();
};

RepeatedFragment.prototype.firstNode = function firstNode ( skipParent ) {
	return this.iterations[0] ? this.iterations[0].firstNode( skipParent ) : null;
};

RepeatedFragment.prototype.rebind = function rebind ( next ) {
		var this$1 = this;

	this.context = next;
	this.iterations.forEach( function (fragment) {
		var model = next ? next.joinKey( fragment.key ) : undefined;
		fragment.context = model;
		if ( this$1.owner.template.z ) {
			fragment.aliases = {};
			fragment.aliases[ this$1.owner.template.z[0].n ] = model;
		}
	});
};

RepeatedFragment.prototype.render = function render$$1 ( target, occupants ) {
	// TODO use docFrag.cloneNode...

	var xs = this.iterations;
	if ( xs ) {
		var len = xs.length;
		for ( var i = 0; i < len; i++ ) {
			xs[i].render( target, occupants );
		}
	}

	this.rendered = true;
};

RepeatedFragment.prototype.shuffle = function shuffle ( newIndices ) {
		var this$1 = this;

	if ( !this.pendingNewIndices ) { this.previousIterations = this.iterations.slice(); }

	if ( !this.pendingNewIndices ) { this.pendingNewIndices = []; }

	this.pendingNewIndices.push( newIndices );

	var iterations = [];

	newIndices.forEach( function ( newIndex, oldIndex ) {
		if ( newIndex === -1 ) { return; }

		var fragment = this$1.iterations[ oldIndex ];
		iterations[ newIndex ] = fragment;

		if ( newIndex !== oldIndex && fragment ) { fragment.dirty = true; }
	});

	this.iterations = iterations;

	this.bubble();
};

RepeatedFragment.prototype.shuffled = function shuffled$1 () {
	this.iterations.forEach( shuffled );
};

RepeatedFragment.prototype.toString = function toString$1$$1 ( escape ) {
	return this.iterations ?
		this.iterations.map( escape ? toEscapedString : toString$1 ).join( '' ) :
		'';
};

RepeatedFragment.prototype.unbind = function unbind$1 () {
	this.iterations.forEach( unbind );
	return this;
};

RepeatedFragment.prototype.unrender = function unrender$1 ( shouldDestroy ) {
	this.iterations.forEach( shouldDestroy ? unrenderAndDestroy : unrender );
	if ( this.pendingNewIndices && this.previousIterations ) {
		this.previousIterations.forEach( function (fragment) {
			if ( fragment.rendered ) { shouldDestroy ? unrenderAndDestroy( fragment ) : unrender( fragment ); }
		});
	}
	this.rendered = false;
};

// TODO smart update
RepeatedFragment.prototype.update = function update$1 () {
		var this$1 = this;

	// skip dirty check, since this is basically just a facade

	if ( this.pendingNewIndices ) {
		this.bubbled.length = 0;
		this.updatePostShuffle();
		return;
	}

	if ( this.updating ) { return; }
	this.updating = true;

	var value = this.context.get();
	var wasArray = this.isArray;

	var toRemove;
	var oldKeys;
	var reset = true;
	var i;

	if ( this.isArray = Array.isArray( value ) ) {
		if ( wasArray ) {
			reset = false;
			if ( this.iterations.length > value.length ) {
				toRemove = this.iterations.splice( value.length );
			}
		}
	} else if ( isObject( value ) && !wasArray ) {
		reset = false;
		toRemove = [];
		oldKeys = {};
		i = this.iterations.length;

		while ( i-- ) {
			var fragment$1 = this$1.iterations[i];
			if ( fragment$1.key in value ) {
				oldKeys[ fragment$1.key ] = true;
			} else {
				this$1.iterations.splice( i, 1 );
				toRemove.push( fragment$1 );
			}
		}
	}

	if ( reset ) {
		toRemove = this.iterations;
		this.iterations = [];
	}

	if ( toRemove ) {
		toRemove.forEach( function (fragment) {
			fragment.unbind();
			fragment.unrender( true );
		});
	}

	// update the remaining ones
	if ( !reset && this.isArray && this.bubbled && this.bubbled.length ) {
		this.bubbled.forEach( function (i) { return this$1.iterations[i] && this$1.iterations[i].update(); } );
	} else {
		this.iterations.forEach( update );
	}

	if ( this.bubbled ) { this.bubbled.length = 0; }

	// add new iterations
	var newLength = Array.isArray( value ) ?
		value.length :
		isObject( value ) ?
			Object.keys( value ).length :
			0;

	var docFrag;
	var fragment;

	if ( newLength > this.iterations.length ) {
		docFrag = this.rendered ? createDocumentFragment() : null;
		i = this.iterations.length;

		if ( Array.isArray( value ) ) {
			while ( i < value.length ) {
				fragment = this$1.createIteration( i, i );

				this$1.iterations.push( fragment );
				if ( this$1.rendered ) { fragment.render( docFrag ); }

				i += 1;
			}
		}

		else if ( isObject( value ) ) {
			// TODO this is a dreadful hack. There must be a neater way
			if ( this.indexRef && !this.keyRef ) {
				var refs = this.indexRef.split( ',' );
				this.keyRef = refs[0];
				this.indexRef = refs[1];
			}

			Object.keys( value ).forEach( function (key) {
				if ( !oldKeys || !( key in oldKeys ) ) {
					fragment = this$1.createIteration( key, i );

					this$1.iterations.push( fragment );
					if ( this$1.rendered ) { fragment.render( docFrag ); }

					i += 1;
				}
			});
		}

		if ( this.rendered ) {
			var parentNode = this.parent.findParentNode();
			var anchor = this.parent.findNextNode( this.owner );

			parentNode.insertBefore( docFrag, anchor );
		}
	}

	this.updating = false;
};

RepeatedFragment.prototype.updatePostShuffle = function updatePostShuffle () {
		var this$1 = this;

	var newIndices = this.pendingNewIndices[ 0 ];

	// map first shuffle through
	this.pendingNewIndices.slice( 1 ).forEach( function (indices) {
		newIndices.forEach( function ( newIndex, oldIndex ) {
			newIndices[ oldIndex ] = indices[ newIndex ];
		});
	});

	// This algorithm (for detaching incorrectly-ordered fragments from the DOM and
	// storing them in a document fragment for later reinsertion) seems a bit hokey,
	// but it seems to work for now
	var len = this.context.get().length;
	var oldLen = this.previousIterations.length;
	var removed = {};
	var i;

	newIndices.forEach( function ( newIndex, oldIndex ) {
		var fragment = this$1.previousIterations[ oldIndex ];
		this$1.previousIterations[ oldIndex ] = null;

		if ( newIndex === -1 ) {
			removed[ oldIndex ] = fragment;
		} else if ( fragment.index !== newIndex ) {
			var model = this$1.context.joinKey( newIndex );
			fragment.index = fragment.key = newIndex;
			fragment.context = model;
			if ( this$1.owner.template.z ) {
				fragment.aliases = {};
				fragment.aliases[ this$1.owner.template.z[0].n ] = model;
			}
		}
	});

	// if the array was spliced outside of ractive, sometimes there are leftover fragments not in the newIndices
	this.previousIterations.forEach( function ( frag, i ) {
		if ( frag ) { removed[ i ] = frag; }
	});

	// create new/move existing iterations
	var docFrag = this.rendered ? createDocumentFragment() : null;
	var parentNode = this.rendered ? this.parent.findParentNode() : null;

	var contiguous = 'startIndex' in newIndices;
	i = contiguous ? newIndices.startIndex : 0;

	for ( i; i < len; i++ ) {
		var frag = this$1.iterations[i];

		if ( frag && contiguous ) {
			// attach any built-up iterations
			if ( this$1.rendered ) {
				if ( removed[i] ) { docFrag.appendChild( removed[i].detach() ); }
				if ( docFrag.childNodes.length  ) { parentNode.insertBefore( docFrag, frag.firstNode() ); }
			}
			continue;
		}

		if ( !frag ) { this$1.iterations[i] = this$1.createIteration( i, i ); }

		if ( this$1.rendered ) {
			if ( removed[i] ) { docFrag.appendChild( removed[i].detach() ); }

			if ( frag ) { docFrag.appendChild( frag.detach() ); }
			else {
				this$1.iterations[i].render( docFrag );
			}
		}
	}

	// append any leftovers
	if ( this.rendered ) {
		for ( i = len; i < oldLen; i++ ) {
			if ( removed[i] ) { docFrag.appendChild( removed[i].detach() ); }
		}

		if ( docFrag.childNodes.length ) {
			parentNode.insertBefore( docFrag, this.owner.findNextNode() );
		}
	}

	// trigger removal on old nodes
	Object.keys( removed ).forEach( function (k) { return removed[k].unbind().unrender( true ); } );

	this.iterations.forEach( update );

	this.pendingNewIndices = null;

	this.shuffled();
};

function isEmpty ( value ) {
	return !value ||
	       ( Array.isArray( value ) && value.length === 0 ) ||
		   ( isObject( value ) && Object.keys( value ).length === 0 );
}

function getType ( value, hasIndexRef ) {
	if ( hasIndexRef || Array.isArray( value ) ) { return SECTION_EACH; }
	if ( isObject( value ) || typeof value === 'function' ) { return SECTION_IF_WITH; }
	if ( value === undefined ) { return null; }
	return SECTION_IF;
}

var Section = (function (MustacheContainer$$1) {
	function Section ( options ) {
		MustacheContainer$$1.call( this, options );

		this.sectionType = options.template.n || null;
		this.templateSectionType = this.sectionType;
		this.subordinate = options.template.l === 1;
		this.fragment = null;
	}

	if ( MustacheContainer$$1 ) Section.__proto__ = MustacheContainer$$1;
	Section.prototype = Object.create( MustacheContainer$$1 && MustacheContainer$$1.prototype );
	Section.prototype.constructor = Section;

	Section.prototype.bind = function bind () {
		MustacheContainer$$1.prototype.bind.call(this);

		if ( this.subordinate ) {
			this.sibling = this.parentFragment.items[ this.parentFragment.items.indexOf( this ) - 1 ];
			this.sibling.nextSibling = this;
		}

		// if we managed to bind, we need to create children
		if ( this.model ) {
			this.dirty = true;
			this.update();
		} else if ( this.sectionType && this.sectionType === SECTION_UNLESS && ( !this.sibling || !this.sibling.isTruthy() ) ) {
			this.fragment = new Fragment({
				owner: this,
				template: this.template.f
			}).bind();
		}
	};

	Section.prototype.detach = function detach () {
		var frag = this.fragment || this.detached;
		return frag ? frag.detach() : MustacheContainer$$1.prototype.detach.call(this);
	};

	Section.prototype.isTruthy = function isTruthy () {
		if ( this.subordinate && this.sibling.isTruthy() ) { return true; }
		var value = !this.model ? undefined : this.model.isRoot ? this.model.value : this.model.get();
		return !!value && ( this.templateSectionType === SECTION_IF_WITH || !isEmpty( value ) );
	};

	Section.prototype.rebind = function rebind ( next, previous, safe ) {
		if ( MustacheContainer$$1.prototype.rebind.call( this, next, previous, safe ) ) {
			if ( this.fragment && this.sectionType !== SECTION_IF && this.sectionType !== SECTION_UNLESS ) {
				this.fragment.rebind( next );
			}
		}
	};

	Section.prototype.render = function render ( target, occupants ) {
		this.rendered = true;
		if ( this.fragment ) { this.fragment.render( target, occupants ); }
	};

	Section.prototype.shuffle = function shuffle ( newIndices ) {
		if ( this.fragment && this.sectionType === SECTION_EACH ) {
			this.fragment.shuffle( newIndices );
		}
	};

	Section.prototype.unbind = function unbind () {
		MustacheContainer$$1.prototype.unbind.call(this);
		if ( this.fragment ) { this.fragment.unbind(); }
	};

	Section.prototype.unrender = function unrender ( shouldDestroy ) {
		if ( this.rendered && this.fragment ) { this.fragment.unrender( shouldDestroy ); }
		this.rendered = false;
	};

	Section.prototype.update = function update () {
		var this$1 = this;

		if ( !this.dirty ) { return; }

		if ( this.fragment && this.sectionType !== SECTION_IF && this.sectionType !== SECTION_UNLESS ) {
			this.fragment.context = this.model;
		}

		if ( !this.model && this.sectionType !== SECTION_UNLESS ) { return; }

		this.dirty = false;

		var value = !this.model ? undefined : this.model.isRoot ? this.model.value : this.model.get();
		var siblingFalsey = !this.subordinate || !this.sibling.isTruthy();
		var lastType = this.sectionType;

		// watch for switching section types
		if ( this.sectionType === null || this.templateSectionType === null ) { this.sectionType = getType( value, this.template.i ); }
		if ( lastType && lastType !== this.sectionType && this.fragment ) {
			if ( this.rendered ) {
				this.fragment.unbind().unrender( true );
			}

			this.fragment = null;
		}

		var newFragment;

		var fragmentShouldExist = this.sectionType === SECTION_EACH || // each always gets a fragment, which may have no iterations
		                            this.sectionType === SECTION_WITH || // with (partial context) always gets a fragment
		                            ( siblingFalsey && ( this.sectionType === SECTION_UNLESS ? !this.isTruthy() : this.isTruthy() ) ); // if, unless, and if-with depend on siblings and the condition

		if ( fragmentShouldExist ) {
			if ( !this.fragment ) { this.fragment = this.detached; }

			if ( this.fragment ) {
				// check for detached fragment
				if ( this.detached ) {
					attach( this, this.fragment );
					this.detached = false;
					this.rendered = true;
				}

				this.fragment.update();
			} else {
				if ( this.sectionType === SECTION_EACH ) {
					newFragment = new RepeatedFragment({
						owner: this,
						template: this.template.f,
						indexRef: this.template.i
					}).bind( this.model );
				} else {
					// only with and if-with provide context - if and unless do not
					var context = this.sectionType !== SECTION_IF && this.sectionType !== SECTION_UNLESS ? this.model : null;
					newFragment = new Fragment({
						owner: this,
						template: this.template.f
					}).bind( context );
				}
			}
		} else {
			if ( this.fragment && this.rendered ) {
				if ( keep !== true ) {
					this.fragment.unbind().unrender( true );
				} else {
					this.unrender( false );
					this.detached = this.fragment;
					runloop.scheduleTask( function () { return this$1.detach(); } );
				}
			} else if ( this.fragment ) {
				this.fragment.unbind();
			}

			this.fragment = null;
		}

		if ( newFragment ) {
			if ( this.rendered ) {
				attach( this, newFragment );
			}

			this.fragment = newFragment;
		}

		if ( this.nextSibling ) {
			this.nextSibling.dirty = true;
			this.nextSibling.update();
		}
	};

	return Section;
}(MustacheContainer));

function attach ( section, fragment ) {
	var anchor = section.parentFragment.findNextNode( section );

	if ( anchor ) {
		var docFrag = createDocumentFragment();
		fragment.render( docFrag );

		anchor.parentNode.insertBefore( docFrag, anchor );
	} else {
		fragment.render( section.parentFragment.findParentNode() );
	}
}

var Select = (function (Element$$1) {
	function Select ( options ) {
		Element$$1.call( this, options );
		this.options = [];
	}

	if ( Element$$1 ) Select.__proto__ = Element$$1;
	Select.prototype = Object.create( Element$$1 && Element$$1.prototype );
	Select.prototype.constructor = Select;

	Select.prototype.foundNode = function foundNode ( node ) {
		if ( this.binding ) {
			var selectedOptions = getSelectedOptions( node );

			if ( selectedOptions.length > 0 ) {
				this.selectedOptions = selectedOptions;
			}
		}
	};

	Select.prototype.render = function render ( target, occupants ) {
		Element$$1.prototype.render.call( this, target, occupants );
		this.sync();

		var node = this.node;

		var i = node.options.length;
		while ( i-- ) {
			node.options[i].defaultSelected = node.options[i].selected;
		}

		this.rendered = true;
	};

	Select.prototype.sync = function sync () {
		var this$1 = this;

		var selectNode = this.node;

		if ( !selectNode ) { return; }

		var options = toArray( selectNode.options );

		if ( this.selectedOptions ) {
			options.forEach( function (o) {
				if ( this$1.selectedOptions.indexOf( o ) >= 0 ) { o.selected = true; }
				else { o.selected = false; }
			});
			this.binding.setFromNode( selectNode );
			delete this.selectedOptions;
			return;
		}

		var selectValue = this.getAttribute( 'value' );
		var isMultiple = this.getAttribute( 'multiple' );
		var array = isMultiple && Array.isArray( selectValue );

		// If the <select> has a specified value, that should override
		// these options
		if ( selectValue !== undefined ) {
			var optionWasSelected;

			options.forEach( function (o) {
				var optionValue = o._ractive ? o._ractive.value : o.value;
				var shouldSelect = isMultiple ?
					array && this$1.valueContains( selectValue, optionValue ) :
					this$1.compare( selectValue, optionValue );

				if ( shouldSelect ) {
					optionWasSelected = true;
				}

				o.selected = shouldSelect;
			});

			if ( !optionWasSelected && !isMultiple ) {
				if ( this.binding ) {
					this.binding.forceUpdate();
				}
			}
		}

		// Otherwise the value should be initialised according to which
		// <option> element is selected, if twoway binding is in effect
		else if ( this.binding ) {
			this.binding.forceUpdate();
		}
	};
	Select.prototype.valueContains = function valueContains ( selectValue, optionValue ) {
		var this$1 = this;

		var i = selectValue.length;
		while ( i-- ) {
			if ( this$1.compare( optionValue, selectValue[i] ) ) { return true; }
		}
	};
	Select.prototype.compare = function compare (optionValue, selectValue) {
		var comparator = this.getAttribute( 'value-comparator' );
		if ( comparator ) {
			if (typeof comparator === 'function') {
				return comparator( selectValue, optionValue );
			}
			if ( selectValue && optionValue ) {
				return selectValue[comparator] == optionValue[comparator];
			}
		}
		return selectValue == optionValue;
	};
	Select.prototype.update = function update () {
		var dirty = this.dirty;
		Element$$1.prototype.update.call(this);
		if ( dirty ) {
			this.sync();
		}
	};

	return Select;
}(Element));

var Textarea = (function (Input$$1) {
	function Textarea( options ) {
		var template = options.template;

		options.deferContent = true;

		Input$$1.call( this, options );

		// check for single interpolator binding
		if ( !this.attributeByName.value ) {
			if ( template.f && isBindable( { template: template } ) ) {
				this.attributes.push( createItem( {
					owner: this,
					template: { t: ATTRIBUTE, f: template.f, n: 'value' },
					parentFragment: this.parentFragment
				} ) );
			} else {
				this.fragment = new Fragment({ owner: this, cssIds: null, template: template.f });
			}
		}
	}

	if ( Input$$1 ) Textarea.__proto__ = Input$$1;
	Textarea.prototype = Object.create( Input$$1 && Input$$1.prototype );
	Textarea.prototype.constructor = Textarea;

	Textarea.prototype.bubble = function bubble () {
		var this$1 = this;

		if ( !this.dirty ) {
			this.dirty = true;

			if ( this.rendered && !this.binding && this.fragment ) {
				runloop.scheduleTask( function () {
					this$1.dirty = false;
					this$1.node.value = this$1.fragment.toString();
				});
			}

			this.parentFragment.bubble(); // default behaviour
		}
	};

	return Textarea;
}(Input));

var Text = (function (Item$$1) {
	function Text ( options ) {
		Item$$1.call( this, options );
		this.type = TEXT;
	}

	if ( Item$$1 ) Text.__proto__ = Item$$1;
	Text.prototype = Object.create( Item$$1 && Item$$1.prototype );
	Text.prototype.constructor = Text;

	Text.prototype.detach = function detach () {
		return detachNode( this.node );
	};

	Text.prototype.firstNode = function firstNode () {
		return this.node;
	};

	Text.prototype.render = function render ( target, occupants ) {
		if ( inAttributes() ) { return; }
		this.rendered = true;

		progressiveText( this, target, occupants, this.template );
	};

	Text.prototype.toString = function toString ( escape ) {
		return escape ? escapeHtml( this.template ) : this.template;
	};

	Text.prototype.unrender = function unrender ( shouldDestroy ) {
		if ( this.rendered && shouldDestroy ) { this.detach(); }
		this.rendered = false;
	};

	Text.prototype.valueOf = function valueOf () {
		return this.template;
	};

	return Text;
}(Item));

var proto$4 = Text.prototype;
proto$4.bind = proto$4.unbind = proto$4.update = noop;

var prefix;

if ( !isClient ) {
	prefix = null;
} else {
	var prefixCache = {};
	var testStyle = createElement( 'div' ).style;

	// technically this also normalizes on hyphenated styles as well
	prefix = function ( prop ) {
		if ( !prefixCache[ prop ] ) {
			var name = hyphenateCamel( prop );

			if ( testStyle[ prop ] !== undefined ) {
				prefixCache[ prop ] = name;
			}

			else {
				// test vendors...
				var i = vendors.length;
				while ( i-- ) {
					var vendor = "-" + (vendors[i]) + "-" + name;
					if ( testStyle[ vendor ] !== undefined ) {
						prefixCache[ prop ] = vendor;
						break;
					}
				}
			}
		}

		return prefixCache[ prop ];
	};
}

var prefix$1 = prefix;

var visible;
var hidden = 'hidden';

if ( doc ) {
	var prefix$2;

	if ( hidden in doc ) {
		prefix$2 = '';
	} else {
		var i$1 = vendors.length;
		while ( i$1-- ) {
			var vendor = vendors[i$1];
			hidden = vendor + 'Hidden';

			if ( hidden in doc ) {
				prefix$2 = vendor;
				break;
			}
		}
	}

	if ( prefix$2 !== undefined ) {
		doc.addEventListener( prefix$2 + 'visibilitychange', onChange );
		onChange();
	} else {
		// gah, we're in an old browser
		if ( 'onfocusout' in doc ) {
			doc.addEventListener( 'focusout', onHide );
			doc.addEventListener( 'focusin', onShow );
		}

		else {
			win.addEventListener( 'pagehide', onHide );
			win.addEventListener( 'blur', onHide );

			win.addEventListener( 'pageshow', onShow );
			win.addEventListener( 'focus', onShow );
		}

		visible = true; // until proven otherwise. Not ideal but hey
	}
}

function onChange () {
	visible = !doc[ hidden ];
}

function onHide () {
	visible = false;
}

function onShow () {
	visible = true;
}

var vendorPattern = new RegExp( '^(?:' + vendors.join( '|' ) + ')([A-Z])' );

var hyphenate = function ( str ) {
	if ( !str ) { return ''; } // edge case

	if ( vendorPattern.test( str ) ) { str = '-' + str; }

	return str.replace( /[A-Z]/g, function (match) { return '-' + match.toLowerCase(); } );
};

var createTransitions;

if ( !isClient ) {
	createTransitions = null;
} else {
	var testStyle$1 = createElement( 'div' ).style;
	var linear$1 = function (x) { return x; };

	var canUseCssTransitions = {};
	var cannotUseCssTransitions = {};

	// determine some facts about our environment
	var TRANSITION$1;
	var TRANSITIONEND;
	var CSS_TRANSITIONS_ENABLED;
	var TRANSITION_DURATION;
	var TRANSITION_PROPERTY;
	var TRANSITION_TIMING_FUNCTION;

	if ( testStyle$1.transition !== undefined ) {
		TRANSITION$1 = 'transition';
		TRANSITIONEND = 'transitionend';
		CSS_TRANSITIONS_ENABLED = true;
	} else if ( testStyle$1.webkitTransition !== undefined ) {
		TRANSITION$1 = 'webkitTransition';
		TRANSITIONEND = 'webkitTransitionEnd';
		CSS_TRANSITIONS_ENABLED = true;
	} else {
		CSS_TRANSITIONS_ENABLED = false;
	}

	if ( TRANSITION$1 ) {
		TRANSITION_DURATION = TRANSITION$1 + 'Duration';
		TRANSITION_PROPERTY = TRANSITION$1 + 'Property';
		TRANSITION_TIMING_FUNCTION = TRANSITION$1 + 'TimingFunction';
	}

	createTransitions = function ( t, to, options, changedProperties, resolve ) {

		// Wait a beat (otherwise the target styles will be applied immediately)
		// TODO use a fastdom-style mechanism?
		setTimeout( function () {
			var jsTransitionsComplete;
			var cssTransitionsComplete;
			var cssTimeout; // eslint-disable-line prefer-const

			function transitionDone () { clearTimeout( cssTimeout ); }

			function checkComplete () {
				if ( jsTransitionsComplete && cssTransitionsComplete ) {
					t.unregisterCompleteHandler( transitionDone );
					// will changes to events and fire have an unexpected consequence here?
					t.ractive.fire( t.name + ':end', t.node, t.isIntro );
					resolve();
				}
			}

			// this is used to keep track of which elements can use CSS to animate
			// which properties
			var hashPrefix = ( t.node.namespaceURI || '' ) + t.node.tagName;

			// need to reset transition properties
			var style = t.node.style;
			var previous = {
				property: style[ TRANSITION_PROPERTY ],
				timing: style[ TRANSITION_TIMING_FUNCTION ],
				duration: style[ TRANSITION_DURATION ]
			};

			function transitionEndHandler ( event ) {
				var index = changedProperties.indexOf( event.propertyName );

				if ( index !== -1 ) {
					changedProperties.splice( index, 1 );
				}

				if ( changedProperties.length ) {
					// still transitioning...
					return;
				}

				clearTimeout( cssTimeout );
				cssTransitionsDone();
			}

			function cssTransitionsDone () {
				style[ TRANSITION_PROPERTY ] = previous.property;
				style[ TRANSITION_TIMING_FUNCTION ] = previous.duration;
				style[ TRANSITION_DURATION ] = previous.timing;

				t.node.removeEventListener( TRANSITIONEND, transitionEndHandler, false );

				cssTransitionsComplete = true;
				checkComplete();
			}

			t.node.addEventListener( TRANSITIONEND, transitionEndHandler, false );

			// safety net in case transitionend never fires
			cssTimeout = setTimeout( function () {
				changedProperties = [];
				cssTransitionsDone();
			}, options.duration + ( options.delay || 0 ) + 50 );
			t.registerCompleteHandler( transitionDone );

			style[ TRANSITION_PROPERTY ] = changedProperties.join( ',' );
			var easingName = hyphenate( options.easing || 'linear' );
			style[ TRANSITION_TIMING_FUNCTION ] = easingName;
			var cssTiming = style[ TRANSITION_TIMING_FUNCTION ] === easingName;
			style[ TRANSITION_DURATION ] = ( options.duration / 1000 ) + 's';

			setTimeout( function () {
				var i = changedProperties.length;
				var hash;
				var originalValue = null;
				var index;
				var propertiesToTransitionInJs = [];
				var prop;
				var suffix;
				var interpolator;

				while ( i-- ) {
					prop = changedProperties[i];
					hash = hashPrefix + prop;

					if ( cssTiming && CSS_TRANSITIONS_ENABLED && !cannotUseCssTransitions[ hash ] ) {
						var initial = style[ prop ];
						style[ prop ] = to[ prop ];

						// If we're not sure if CSS transitions are supported for
						// this tag/property combo, find out now
						if ( !( hash in canUseCssTransitions ) ) {
							originalValue = t.getStyle( prop );

							// if this property is transitionable in this browser,
							// the current style will be different from the target style
							canUseCssTransitions[ hash ] = ( t.getStyle( prop ) != to[ prop ] );
							cannotUseCssTransitions[ hash ] = !canUseCssTransitions[ hash ];

							// Reset, if we're going to use timers after all
							if ( cannotUseCssTransitions[ hash ] ) {
								style[ prop ] = initial;
							}
						}
					}

					if ( !cssTiming || !CSS_TRANSITIONS_ENABLED || cannotUseCssTransitions[ hash ] ) {
						// we need to fall back to timer-based stuff
						if ( originalValue === null ) { originalValue = t.getStyle( prop ); }

						// need to remove this from changedProperties, otherwise transitionEndHandler
						// will get confused
						index = changedProperties.indexOf( prop );
						if ( index === -1 ) {
							warnIfDebug( 'Something very strange happened with transitions. Please raise an issue at https://github.com/ractivejs/ractive/issues - thanks!', { node: t.node });
						} else {
							changedProperties.splice( index, 1 );
						}

						// TODO Determine whether this property is animatable at all

						suffix = /[^\d]*$/.exec( originalValue )[0];
						interpolator = interpolate( parseFloat( originalValue ), parseFloat( to[ prop ] ) );

						// ...then kick off a timer-based transition
						if ( interpolator ) {
							propertiesToTransitionInJs.push({
								name: prop,
								interpolator: interpolator,
								suffix: suffix
							});
						} else {
							style[ prop ] = to[ prop ];
						}

						originalValue = null;
					}
				}

				// javascript transitions
				if ( propertiesToTransitionInJs.length ) {
					var easing;

					if ( typeof options.easing === 'string' ) {
						easing = t.ractive.easing[ options.easing ];

						if ( !easing ) {
							warnOnceIfDebug( missingPlugin( options.easing, 'easing' ) );
							easing = linear$1;
						}
					} else if ( typeof options.easing === 'function' ) {
						easing = options.easing;
					} else {
						easing = linear$1;
					}

					new Ticker({
						duration: options.duration,
						easing: easing,
						step: function step ( pos ) {
							var i = propertiesToTransitionInJs.length;
							while ( i-- ) {
								var prop = propertiesToTransitionInJs[i];
								style[ prop.name ] = prop.interpolator( pos ) + prop.suffix;
							}
						},
						complete: function complete () {
							jsTransitionsComplete = true;
							checkComplete();
						}
					});
				} else {
					jsTransitionsComplete = true;
				}

				if ( changedProperties.length ) {
					style[ TRANSITION_PROPERTY ] = changedProperties.join( ',' );
				} else {
					style[ TRANSITION_PROPERTY ] = 'none';

					// We need to cancel the transitionEndHandler, and deal with
					// the fact that it will never fire
					t.node.removeEventListener( TRANSITIONEND, transitionEndHandler, false );
					cssTransitionsComplete = true;
					checkComplete();
				}
			}, 0 );
		}, options.delay || 0 );
	};
}

var createTransitions$1 = createTransitions;

var getComputedStyle = win && win.getComputedStyle;
var resolved = Promise.resolve();

var names = {
	t0: 'intro-outro',
	t1: 'intro',
	t2: 'outro'
};

var Transition = function Transition ( options ) {
	this.owner = options.owner || options.parentFragment.owner || findElement( options.parentFragment );
	this.element = this.owner.attributeByName ? this.owner : findElement( options.parentFragment );
	this.ractive = this.owner.ractive;
	this.template = options.template;
	this.parentFragment = options.parentFragment;
	this.options = options;
	this.onComplete = [];
};

Transition.prototype.animateStyle = function animateStyle ( style, value, options ) {
		var this$1 = this;

	if ( arguments.length === 4 ) {
		throw new Error( 't.animateStyle() returns a promise - use .then() instead of passing a callback' );
	}

	// Special case - page isn't visible. Don't animate anything, because
	// that way you'll never get CSS transitionend events
	if ( !visible ) {
		this.setStyle( style, value );
		return resolved;
	}

	var to;

	if ( typeof style === 'string' ) {
		to = {};
		to[ style ] = value;
	} else {
		to = style;

		// shuffle arguments
		options = value;
	}

	return new Promise( function (fulfil) {
		// Edge case - if duration is zero, set style synchronously and complete
		if ( !options.duration ) {
			this$1.setStyle( to );
			fulfil();
			return;
		}

		// Get a list of the properties we're animating
		var propertyNames = Object.keys( to );
		var changedProperties = [];

		// Store the current styles
		var computedStyle = getComputedStyle( this$1.node );

		var i = propertyNames.length;
		while ( i-- ) {
			var prop = propertyNames[i];
			var name = prefix$1( prop );

			var current = computedStyle[ prefix$1( prop ) ];

			// record the starting points
			var init = this$1.node.style[name];
			if ( !( name in this$1.originals ) ) { this$1.originals[ name ] = this$1.node.style[ name ]; }
			this$1.node.style[ name ] = to[ prop ];
			this$1.targets[ name ] = this$1.node.style[ name ];
			this$1.node.style[ name ] = init;

			// we need to know if we're actually changing anything
			if ( current != to[ prop ] ) { // use != instead of !==, so we can compare strings with numbers
				changedProperties.push( name );

				// if we happened to prefix, make sure there is a properly prefixed value
				to[ name ] = to[ prop ];

				// make the computed style explicit, so we can animate where
				// e.g. height='auto'
				this$1.node.style[ name ] = current;
			}
		}

		// If we're not actually changing anything, the transitionend event
		// will never fire! So we complete early
		if ( !changedProperties.length ) {
			fulfil();
			return;
		}

		createTransitions$1( this$1, to, options, changedProperties, fulfil );
	});
};

Transition.prototype.bind = function bind () {
	var options = this.options;
	var type = options.template && options.template.v;
	if ( type ) {
		if ( type === 't0' || type === 't1' ) { this.element.intro = this; }
		if ( type === 't0' || type === 't2' ) { this.element.outro = this; }
		this.eventName = names[ type ];
	}

	var ractive = this.owner.ractive;

	this.name = options.name || options.template.n;

	if ( options.params ) {
		this.params = options.params;
	}

	if ( typeof this.name === 'function' ) {
		this._fn = this.name;
		this.name = this._fn.name;
	} else {
		this._fn = findInViewHierarchy( 'transitions', ractive, this.name );
	}

	if ( !this._fn ) {
		warnOnceIfDebug( missingPlugin( this.name, 'transition' ), { ractive: ractive });
	}

	setupArgsFn( this, options.template );
};

Transition.prototype.getParams = function getParams () {
	if ( this.params ) { return this.params; }

	// get expression args if supplied
	if ( this.fn ) {
		var values = resolveArgs( this, this.template, this.parentFragment ).map( function (model) {
			if ( !model ) { return undefined; }

			return model.get();
		});
		return this.fn.apply( this.ractive, values );
	}
};

Transition.prototype.getStyle = function getStyle ( props ) {
	var computedStyle = getComputedStyle( this.node );

	if ( typeof props === 'string' ) {
		return computedStyle[ prefix$1( props ) ];
	}

	if ( !Array.isArray( props ) ) {
		throw new Error( 'Transition$getStyle must be passed a string, or an array of strings representing CSS properties' );
	}

	var styles = {};

	var i = props.length;
	while ( i-- ) {
		var prop = props[i];
		var value = computedStyle[ prefix$1( prop ) ];

		if ( value === '0px' ) { value = 0; }
		styles[ prop ] = value;
	}

	return styles;
};

Transition.prototype.processParams = function processParams ( params, defaults ) {
	if ( typeof params === 'number' ) {
		params = { duration: params };
	}

	else if ( typeof params === 'string' ) {
		if ( params === 'slow' ) {
			params = { duration: 600 };
		} else if ( params === 'fast' ) {
			params = { duration: 200 };
		} else {
			params = { duration: 400 };
		}
	} else if ( !params ) {
		params = {};
	}

	return Object.assign( {}, defaults, params );
};

Transition.prototype.registerCompleteHandler = function registerCompleteHandler ( fn ) {
	addToArray( this.onComplete, fn );
};

Transition.prototype.setStyle = function setStyle ( style, value ) {
		var this$1 = this;

	if ( typeof style === 'string' ) {
		var name = prefix$1(  style );
		if ( !this.originals.hasOwnProperty( name ) ) { this.originals[ name ] = this.node.style[ name ]; }
		this.node.style[ name ] = value;
		this.targets[ name ] = this.node.style[ name ];
	}

	else {
		var prop;
		for ( prop in style ) {
			if ( style.hasOwnProperty( prop ) ) {
				this$1.setStyle( prop, style[ prop ] );
			}
		}
	}

	return this;
};

Transition.prototype.shouldFire = function shouldFire ( type ) {
	if ( !this.ractive.transitionsEnabled ) { return false; }

	// check for noIntro and noOutro cases, which only apply when the owner ractive is rendering and unrendering, respectively
	if ( type === 'intro' && this.ractive.rendering && nearestProp( 'noIntro', this.ractive, true ) ) { return false; }
	if ( type === 'outro' && this.ractive.unrendering && nearestProp( 'noOutro', this.ractive, false ) ) { return false; }

	var params = this.getParams(); // this is an array, the params object should be the first member
	// if there's not a parent element, this can't be nested, so roll on
	if ( !this.element.parent ) { return true; }

	// if there is a local param, it takes precedent
	if ( params && params[0] && 'nested' in params[0] ) {
		if ( params[0].nested !== false ) { return true; }
	} else { // use the nearest instance setting
		// find the nearest instance that actually has a nested setting
		if ( nearestProp( 'nestedTransitions', this.ractive ) !== false ) { return true; }
	}

	// check to see if this is actually a nested transition
	var el = this.element.parent;
	while ( el ) {
		if ( el[type] && el[type].starting ) { return false; }
		el = el.parent;
	}

	return true;
};

Transition.prototype.start = function start () {
		var this$1 = this;

	var node = this.node = this.element.node;
	var originals = this.originals = {};  //= node.getAttribute( 'style' );
	var targets = this.targets = {};

	var completed;
	var args = this.getParams();

	// create t.complete() - we don't want this on the prototype,
	// because we don't want `this` silliness when passing it as
	// an argument
	this.complete = function (noReset) {
		this$1.starting = false;
		if ( completed ) {
			return;
		}

		this$1.onComplete.forEach( function (fn) { return fn(); } );
		if ( !noReset && this$1.isIntro ) {
			for ( var k in targets ) {
				if ( node.style[ k ] === targets[ k ] ) { node.style[ k ] = originals[ k ]; }
			}
		}

		this$1._manager.remove( this$1 );

		completed = true;
	};

	// If the transition function doesn't exist, abort
	if ( !this._fn ) {
		this.complete();
		return;
	}

	var promise = this._fn.apply( this.ractive, [ this ].concat( args ) );
	if ( promise ) { promise.then( this.complete ); }
};

Transition.prototype.toString = function toString () { return ''; };

Transition.prototype.unbind = function unbind () {
	if ( !this.element.attributes.unbinding ) {
		var type = this.options && this.options.template && this.options.template.v;
		if ( type === 't0' || type === 't1' ) { this.element.intro = null; }
		if ( type === 't0' || type === 't2' ) { this.element.outro = null; }
	}
};

Transition.prototype.unregisterCompleteHandler = function unregisterCompleteHandler ( fn ) {
	removeFromArray( this.onComplete, fn );
};

var proto$5 = Transition.prototype;
proto$5.destroyed = proto$5.render = proto$5.unrender = proto$5.update = noop;

function nearestProp ( prop, ractive, rendering ) {
	var instance = ractive;
	while ( instance ) {
		if ( instance.hasOwnProperty( prop ) && ( rendering === undefined || rendering ? instance.rendering : instance.unrendering ) ) { return instance[ prop ]; }
		instance = instance.component && instance.component.ractive;
	}

	return ractive[ prop ];
}

var elementCache = {};

var ieBug;
var ieBlacklist;

try {
	createElement( 'table' ).innerHTML = 'foo';
} catch ( err ) {
	ieBug = true;

	ieBlacklist = {
		TABLE:  [ '<table class="x">', '</table>' ],
		THEAD:  [ '<table><thead class="x">', '</thead></table>' ],
		TBODY:  [ '<table><tbody class="x">', '</tbody></table>' ],
		TR:     [ '<table><tr class="x">', '</tr></table>' ],
		SELECT: [ '<select class="x">', '</select>' ]
	};
}

var insertHtml = function ( html$$1, node ) {
	var nodes = [];

	// render 0 and false
	if ( html$$1 == null || html$$1 === '' ) { return nodes; }

	var container;
	var wrapper;
	var selectedOption;

	if ( ieBug && ( wrapper = ieBlacklist[ node.tagName ] ) ) {
		container = element( 'DIV' );
		container.innerHTML = wrapper[0] + html$$1 + wrapper[1];
		container = container.querySelector( '.x' );

		if ( container.tagName === 'SELECT' ) {
			selectedOption = container.options[ container.selectedIndex ];
		}
	}

	else if ( node.namespaceURI === svg$1 ) {
		container = element( 'DIV' );
		container.innerHTML = '<svg class="x">' + html$$1 + '</svg>';
		container = container.querySelector( '.x' );
	}

	else if ( node.tagName === 'TEXTAREA' ) {
		container = createElement( 'div' );

		if ( typeof container.textContent !== 'undefined' ) {
			container.textContent = html$$1;
		} else {
			container.innerHTML = html$$1;
		}
	}

	else {
		container = element( node.tagName );
		container.innerHTML = html$$1;

		if ( container.tagName === 'SELECT' ) {
			selectedOption = container.options[ container.selectedIndex ];
		}
	}

	var child;
	while ( child = container.firstChild ) {
		nodes.push( child );
		container.removeChild( child );
	}

	// This is really annoying. Extracting <option> nodes from the
	// temporary container <select> causes the remaining ones to
	// become selected. So now we have to deselect them. IE8, you
	// amaze me. You really do
	// ...and now Chrome too
	var i;
	if ( node.tagName === 'SELECT' ) {
		i = nodes.length;
		while ( i-- ) {
			if ( nodes[i] !== selectedOption ) {
				nodes[i].selected = false;
			}
		}
	}

	return nodes;
};

function element ( tagName ) {
	return elementCache[ tagName ] || ( elementCache[ tagName ] = createElement( tagName ) );
}

var Triple = (function (Mustache$$1) {
	function Triple ( options ) {
		Mustache$$1.call( this, options );
	}

	if ( Mustache$$1 ) Triple.__proto__ = Mustache$$1;
	Triple.prototype = Object.create( Mustache$$1 && Mustache$$1.prototype );
	Triple.prototype.constructor = Triple;

	Triple.prototype.detach = function detach () {
		var docFrag = createDocumentFragment();
		if ( this.nodes ) { this.nodes.forEach( function (node) { return docFrag.appendChild( node ); } ); }
		return docFrag;
	};

	Triple.prototype.find = function find ( selector ) {
		var this$1 = this;

		var len = this.nodes.length;
		var i;

		for ( i = 0; i < len; i += 1 ) {
			var node = this$1.nodes[i];

			if ( node.nodeType !== 1 ) { continue; }

			if ( matches( node, selector ) ) { return node; }

			var queryResult = node.querySelector( selector );
			if ( queryResult ) { return queryResult; }
		}

		return null;
	};

	Triple.prototype.findAll = function findAll ( selector, options ) {
		var this$1 = this;

		var result = options.result;
		var len = this.nodes.length;
		var i;

		for ( i = 0; i < len; i += 1 ) {
			var node = this$1.nodes[i];

			if ( node.nodeType !== 1 ) { continue; }

			if ( matches( node, selector ) ) { result.push( node ); }

			var queryAllResult = node.querySelectorAll( selector );
			if ( queryAllResult ) {
				result.push.apply( result, queryAllResult );
			}
		}
	};

	Triple.prototype.findComponent = function findComponent () {
		return null;
	};

	Triple.prototype.firstNode = function firstNode () {
		return this.rendered && this.nodes[0];
	};

	Triple.prototype.render = function render ( target, occupants ) {
		var this$1 = this;

		var parentNode = this.parentFragment.findParentNode();

		if ( !this.nodes ) {
			var html = this.model ? this.model.get() : '';
			this.nodes = insertHtml( html, this.parentFragment.findParentNode(), target );
		}

		var nodes = this.nodes;
		var anchor = this.parentFragment.findNextNode( this );

		// progressive enhancement
		if ( occupants ) {
			var i = -1;
			var next;

			// start with the first node that should be rendered
			while ( occupants.length && ( next = this.nodes[ i + 1 ] ) ) {
				var n = (void 0);
				// look through the occupants until a matching node is found
				while ( n = occupants.shift() ) {
					var t = n.nodeType;

					if ( t === next.nodeType && ( ( t === 1 && n.outerHTML === next.outerHTML ) || ( ( t === 3 || t === 8 ) && n.nodeValue === next.nodeValue ) ) ) {
						this$1.nodes.splice( ++i, 1, n ); // replace the generated node with the existing one
						break;
					} else {
						target.removeChild( n ); // remove the non-matching existing node
					}
				}
			}

			if ( i >= 0 ) {
				// update the list of remaining nodes to attach, excluding any that were replaced by existing nodes
				nodes = this.nodes.slice( i );
			}

			// update the anchor to be the next occupant
			if ( occupants.length ) { anchor = occupants[0]; }
		}

		// attach any remainging nodes to the parent
		if ( nodes.length ) {
			var frag = createDocumentFragment();
			nodes.forEach( function (n) { return frag.appendChild( n ); } );

			if ( anchor ) {
				anchor.parentNode.insertBefore( frag, anchor );
			} else {
				parentNode.appendChild( frag );
			}
		}

		this.rendered = true;
	};

	Triple.prototype.toString = function toString () {
		var value = this.model && this.model.get();
		value = value != null ? '' + value : '';

		return inAttribute() ? decodeCharacterReferences( value ) : value;
	};

	Triple.prototype.unrender = function unrender () {
		if ( this.nodes ) { this.nodes.forEach( function (node) { return detachNode( node ); } ); }
		this.rendered = false;
		this.nodes = null;
	};

	Triple.prototype.update = function update () {
		if ( this.rendered && this.dirty ) {
			this.dirty = false;

			this.unrender();
			this.render();
		} else {
			// make sure to reset the dirty flag even if not rendered
			this.dirty = false;
		}
	};

	return Triple;
}(Mustache));

// finds the component constructor in the registry or view hierarchy registries
function getComponentConstructor ( ractive, name ) {
	var instance = findInstance( 'components', ractive, name );
	var Component;

	if ( instance ) {
		Component = instance.components[ name ];

		// best test we have for not Ractive.extend
		if ( Component && !Component.Parent ) {
			// function option, execute and store for reset
			var fn = Component.bind( instance );
			fn.isOwner = instance.components.hasOwnProperty( name );
			Component = fn();

			if ( !Component ) {
				warnIfDebug( noRegistryFunctionReturn, name, 'component', 'component', { ractive: ractive });
				return;
			}

			if ( typeof Component === 'string' ) {
				// allow string lookup
				Component = getComponentConstructor( ractive, Component );
			}

			Component._fn = fn;
			instance.components[ name ] = Component;
		}
	}

	return Component;
}

//import Yielder from './Yielder';
var constructors = {};
constructors[ ALIAS ] = Alias;
constructors[ ANCHOR ] = Component;
constructors[ DOCTYPE ] = Doctype;
constructors[ INTERPOLATOR ] = Interpolator;
constructors[ PARTIAL ] = Partial;
constructors[ SECTION ] = Section;
constructors[ TRIPLE ] = Triple;
constructors[ YIELDER ] = Partial;

constructors[ ATTRIBUTE ] = Attribute;
constructors[ BINDING_FLAG ] = BindingFlag;
constructors[ DECORATOR ] = Decorator;
constructors[ EVENT ] = EventDirective;
constructors[ TRANSITION ] = Transition;

var specialElements = {
	doctype: Doctype,
	form: Form,
	input: Input,
	option: Option,
	select: Select,
	textarea: Textarea
};

function createItem ( options ) {
	if ( typeof options.template === 'string' ) {
		return new Text( options );
	}

	if ( options.template.t === ELEMENT ) {
		// could be component or element
		var ComponentConstructor = getComponentConstructor( options.parentFragment.ractive, options.template.e );
		if ( ComponentConstructor ) {
			return new Component( options, ComponentConstructor );
		}

		var tagName = options.template.e.toLowerCase();

		var ElementConstructor = specialElements[ tagName ] || Element;
		return new ElementConstructor( options );
	}

	var Item;

	// component mappings are a special case of attribute
	if ( options.template.t === ATTRIBUTE ) {
		var el = options.owner;
		if ( !el || ( el.type !== ANCHOR && el.type !== COMPONENT && el.type !== ELEMENT ) ) {
			el = findElement( options.parentFragment );
		}
		options.element = el;

		Item = el.type === COMPONENT || el.type === ANCHOR ? Mapping : Attribute;
	} else {
		Item = constructors[ options.template.t ];
	}

	if ( !Item ) { throw new Error( ("Unrecognised item type " + (options.template.t)) ); }

	return new Item( options );
}

// TODO all this code needs to die
function processItems ( items, values, guid, counter ) {
	if ( counter === void 0 ) counter = 0;

	return items.map( function (item) {
		if ( item.type === TEXT ) {
			return item.template;
		}

		if ( item.fragment ) {
			if ( item.fragment.iterations ) {
				return item.fragment.iterations.map( function (fragment) {
					return processItems( fragment.items, values, guid, counter );
				}).join( '' );
			} else {
				return processItems( item.fragment.items, values, guid, counter );
			}
		}

		var placeholderId = guid + "-" + (counter++);
		var model = item.model || item.newModel;

		values[ placeholderId ] = model ?
			model.wrapper ?
				model.wrapperValue :
				model.get() :
			undefined;

		return '${' + placeholderId + '}';
	}).join( '' );
}

function unrenderAndDestroy$1 ( item ) {
	item.unrender( true );
}

var Fragment = function Fragment ( options ) {
	this.owner = options.owner; // The item that owns this fragment - an element, section, partial, or attribute

	this.isRoot = !options.owner.parentFragment;
	this.parent = this.isRoot ? null : this.owner.parentFragment;
	this.ractive = options.ractive || ( this.isRoot ? options.owner : this.parent.ractive );

	this.componentParent = ( this.isRoot && this.ractive.component ) ? this.ractive.component.parentFragment : null;
	this.delegate = ( this.parent ? this.parent.delegate : ( this.componentParent && this.componentParent.delegate ) ) ||
		( this.owner.containerFragment && this.owner.containerFragment.delegate );

	this.context = null;
	this.rendered = false;

	// encapsulated styles should be inherited until they get applied by an element
	this.cssIds = 'cssIds' in options ? options.cssIds : ( this.parent ? this.parent.cssIds : null );

	this.dirty = false;
	this.dirtyValue = true; // used for attribute values

	this.template = options.template || [];
	this.createItems();
};

Fragment.prototype.bind = function bind$1 ( context ) {
	this.context = context;
	this.items.forEach( bind );
	this.bound = true;

	// in rare cases, a forced resolution (or similar) will cause the
	// fragment to be dirty before it's even finished binding. In those
	// cases we update immediately
	if ( this.dirty ) { this.update(); }

	return this;
};

Fragment.prototype.bubble = function bubble () {
	this.dirtyValue = true;

	if ( !this.dirty ) {
		this.dirty = true;

		if ( this.isRoot ) { // TODO encapsulate 'is component root, but not overall root' check?
			if ( this.ractive.component ) {
				this.ractive.component.bubble();
			} else if ( this.bound ) {
				runloop.addFragment( this );
			}
		} else {
			this.owner.bubble( this.index );
		}
	}
};

Fragment.prototype.createItems = function createItems () {
		var this$1 = this;

	// this is a hot code path
	var max = this.template.length;
	this.items = [];
	for ( var i = 0; i < max; i++ ) {
		this$1.items[i] = createItem({ parentFragment: this$1, template: this$1.template[i], index: i });
	}
};

Fragment.prototype.destroyed = function destroyed$1 () {
	this.items.forEach( destroyed );
};

Fragment.prototype.detach = function detach () {
	var docFrag = createDocumentFragment();
	var xs = this.items;
	var len = xs.length;
	for ( var i = 0; i < len; i++ ) {
		docFrag.appendChild( xs[i].detach() );
	}
	return docFrag;
};

Fragment.prototype.find = function find ( selector, options ) {
	return findMap( this.items, function (i) { return i.find( selector, options ); } );
};

Fragment.prototype.findAll = function findAll ( selector, options ) {
	if ( this.items ) {
		this.items.forEach( function (i) { return i.findAll && i.findAll( selector, options ); } );
	}
};

Fragment.prototype.findComponent = function findComponent ( name, options ) {
	return findMap( this.items, function (i) { return i.findComponent( name, options ); } );
};

Fragment.prototype.findAllComponents = function findAllComponents ( name, options ) {
	if ( this.items ) {
		this.items.forEach( function (i) { return i.findAllComponents && i.findAllComponents( name, options ); } );
	}
};

Fragment.prototype.findContext = function findContext () {
	var fragment = this;
	while ( fragment && !fragment.context ) { fragment = fragment.parent; }
	if ( !fragment ) { return this.ractive.viewmodel; }
	else { return fragment.context; }
};

Fragment.prototype.findNextNode = function findNextNode ( item ) {
		var this$1 = this;

	// search for the next node going forward
	if ( item ) {
		for ( var i = item.index + 1; i < this.items.length; i++ ) {
			if ( !this$1.items[ i ] ) { continue; }

			var node = this$1.items[ i ].firstNode( true );
			if ( node ) { return node; }
		}
	}

	// if this is the root fragment, and there are no more items,
	// it means we're at the end...
	if ( this.isRoot ) {
		if ( this.ractive.component ) {
			return this.ractive.component.parentFragment.findNextNode( this.ractive.component );
		}

		// TODO possible edge case with other content
		// appended to this.ractive.el?
		return null;
	}

	if ( this.parent ) { return this.owner.findNextNode( this ); } // the argument is in case the parent is a RepeatedFragment
};

Fragment.prototype.findParentNode = function findParentNode () {
	var fragment = this;

	do {
		if ( fragment.owner.type === ELEMENT ) {
			return fragment.owner.node;
		}

		if ( fragment.isRoot && !fragment.ractive.component ) { // TODO encapsulate check
			return fragment.ractive.el;
		}

		if ( fragment.owner.type === YIELDER ) {
			fragment = fragment.owner.containerFragment;
		} else {
			fragment = fragment.componentParent || fragment.parent; // TODO ugh
		}
	} while ( fragment );

	throw new Error( 'Could not find parent node' ); // TODO link to issue tracker
};

Fragment.prototype.findRepeatingFragment = function findRepeatingFragment () {
	var fragment = this;
	// TODO better check than fragment.parent.iterations
	while ( ( fragment.parent || fragment.componentParent ) && !fragment.isIteration ) {
		fragment = fragment.parent || fragment.componentParent;
	}

	return fragment;
};

Fragment.prototype.firstNode = function firstNode ( skipParent ) {
	var node = findMap( this.items, function (i) { return i.firstNode( true ); } );
	if ( node ) { return node; }
	if ( skipParent ) { return null; }

	return this.parent.findNextNode( this.owner );
};

Fragment.prototype.rebind = function rebind ( next ) {
	this.context = next;
};

Fragment.prototype.render = function render$$1 ( target, occupants ) {
	if ( this.rendered ) { throw new Error( 'Fragment is already rendered!' ); }
	this.rendered = true;

	var xs = this.items;
	var len = xs.length;
	for ( var i = 0; i < len; i++ ) {
		xs[i].render( target, occupants );
	}
};

Fragment.prototype.resetTemplate = function resetTemplate ( template ) {
	var wasBound = this.bound;
	var wasRendered = this.rendered;

	// TODO ensure transitions are disabled globally during reset

	if ( wasBound ) {
		if ( wasRendered ) { this.unrender( true ); }
		this.unbind();
	}

	this.template = template;
	this.createItems();

	if ( wasBound ) {
		this.bind( this.context );

		if ( wasRendered ) {
			var parentNode = this.findParentNode();
			var anchor = this.findNextNode();

			if ( anchor ) {
				var docFrag = createDocumentFragment();
				this.render( docFrag );
				parentNode.insertBefore( docFrag, anchor );
			} else {
				this.render( parentNode );
			}
		}
	}
};

Fragment.prototype.shuffled = function shuffled$1 () {
	this.items.forEach( shuffled );
};

Fragment.prototype.toString = function toString$1$$1 ( escape ) {
	return this.items.map( escape ? toEscapedString : toString$1 ).join( '' );
};

Fragment.prototype.unbind = function unbind$1 () {
	this.context = null;
	this.items.forEach( unbind );
	this.bound = false;

	return this;
};

Fragment.prototype.unrender = function unrender$1 ( shouldDestroy ) {
	this.items.forEach( shouldDestroy ? unrenderAndDestroy$1 : unrender );
	this.rendered = false;
};

Fragment.prototype.update = function update$1 () {
	if ( this.dirty ) {
		if ( !this.updating ) {
			this.dirty = false;
			this.updating = true;
			this.items.forEach( update );
			this.updating = false;
		} else if ( this.isRoot ) {
			runloop.addFragmentToRoot( this );
		}
	}
};

Fragment.prototype.valueOf = function valueOf () {
	if ( this.items.length === 1 ) {
		return this.items[0].valueOf();
	}

	if ( this.dirtyValue ) {
		var values = {};
		var source = processItems( this.items, values, this.ractive._guid );
		var parsed = parseJSON( source, values );

		this.value = parsed ?
			parsed.value :
			this.toString();

		this.dirtyValue = false;
	}

	return this.value;
};

Fragment.prototype.getContext = getContext;

function getChildQueue ( queue, ractive ) {
	return queue[ ractive._guid ] || ( queue[ ractive._guid ] = [] );
}

function fire ( hookQueue, ractive ) {
	var childQueue = getChildQueue( hookQueue.queue, ractive );

	hookQueue.hook.fire( ractive );

	// queue is "live" because components can end up being
	// added while hooks fire on parents that modify data values.
	while ( childQueue.length ) {
		fire( hookQueue, childQueue.shift() );
	}

	delete hookQueue.queue[ ractive._guid ];
}

var HookQueue = function HookQueue ( event ) {
	this.hook = new Hook( event );
	this.inProcess = {};
	this.queue = {};
};

HookQueue.prototype.begin = function begin ( ractive ) {
	this.inProcess[ ractive._guid ] = true;
};

HookQueue.prototype.end = function end ( ractive ) {
	var parent = ractive.parent;

	// If this is *isn't* a child of a component that's in process,
	// it should call methods or fire at this point
	if ( !parent || !this.inProcess[ parent._guid ] ) {
		fire( this, ractive );
	}
	// elsewise, handoff to parent to fire when ready
	else {
		getChildQueue( this.queue, parent ).push( ractive );
	}

	delete this.inProcess[ ractive._guid ];
};

var configHook = new Hook( 'config' );
var initHook = new HookQueue( 'init' );

function initialise ( ractive, userOptions, options ) {
	Object.keys( ractive.viewmodel.computations ).forEach( function (key) {
		var computation = ractive.viewmodel.computations[ key ];

		if ( ractive.viewmodel.value.hasOwnProperty( key ) ) {
			computation.set( ractive.viewmodel.value[ key ] );
		}
	});

	// set up event subscribers
	subscribe( ractive, userOptions, 'on' );

	// init config from Parent and options
	config.init( ractive.constructor, ractive, userOptions );

	configHook.fire( ractive );

	// general config done, set up observers
	subscribe( ractive, userOptions, 'observe' );

	initHook.begin( ractive );

	var fragment = ractive.fragment = createFragment( ractive, options );
	if ( fragment ) { fragment.bind( ractive.viewmodel ); }

	initHook.end( ractive );

	if ( fragment ) {
		// render automatically ( if `el` is specified )
		var el = getElement( ractive.el || ractive.target );
		if ( el ) {
			var promise = ractive.render( el, ractive.append );

			if ( Ractive.DEBUG_PROMISES ) {
				promise.catch( function (err) {
					warnOnceIfDebug( 'Promise debugging is enabled, to help solve errors that happen asynchronously. Some browsers will log unhandled promise rejections, in which case you can safely disable promise debugging:\n  Ractive.DEBUG_PROMISES = false;' );
					warnIfDebug( 'An error happened during rendering', { ractive: ractive });
					logIfDebug( err );

					throw err;
				});
			}
		}
	}
}

function createFragment ( ractive, options ) {
	if ( options === void 0 ) options = {};

	if ( ractive.template ) {
		var cssIds;

		if ( options.cssIds || ractive.cssId ) {
			cssIds = options.cssIds ? options.cssIds.slice() : [];

			if ( ractive.cssId ) {
				cssIds.push( ractive.cssId );
			}
		}

		return new Fragment({
			owner: ractive,
			template: ractive.template,
			cssIds: cssIds
		});
	}
}

function subscribe ( instance, options, type ) {
	var subs = ( instance.constructor[ ("_" + type) ] || [] ).concat( toPairs( options[ type ] || [] ) );
	var single = type === 'on' ? 'once' : (type + "Once");

	subs.forEach( function (ref) {
		var target = ref[0];
		var config$$1 = ref[1];

		if ( typeof config$$1 === 'function' ) {
			instance[type]( target, config$$1 );
		} else if ( typeof config$$1 === 'object' && typeof config$$1.handler === 'function' ) {
			instance[ config$$1.once ? single : type ]( target, config$$1.handler, config$$1 );
		}
	});
}

var renderHook = new Hook( 'render' );
var completeHook = new Hook( 'complete' );

function render$1 ( ractive, target, anchor, occupants ) {
	// set a flag to let any transitions know that this instance is currently rendering
	ractive.rendering = true;

	var promise = runloop.start( ractive, true );
	runloop.scheduleTask( function () { return renderHook.fire( ractive ); }, true );

	if ( ractive.fragment.rendered ) {
		throw new Error( 'You cannot call ractive.render() on an already rendered instance! Call ractive.unrender() first' );
	}

	if ( ractive.destroyed ) {
		ractive.destroyed = false;
		ractive.fragment = createFragment( ractive ).bind( ractive.viewmodel );
	}

	anchor = getElement( anchor ) || ractive.anchor;

	ractive.el = ractive.target = target;
	ractive.anchor = anchor;

	// ensure encapsulated CSS is up-to-date
	if ( ractive.cssId ) { applyCSS(); }

	if ( target ) {
		( target.__ractive_instances__ || ( target.__ractive_instances__ = [] ) ).push( ractive );

		if ( anchor ) {
			var docFrag = doc.createDocumentFragment();
			ractive.fragment.render( docFrag );
			target.insertBefore( docFrag, anchor );
		} else {
			ractive.fragment.render( target, occupants );
		}
	}

	runloop.end();
	ractive.rendering = false;

	return promise.then( function () {
		if (ractive.torndown) { return; }

		completeHook.fire( ractive );
	});
}

function Ractive$render ( target, anchor ) {
	if ( this.torndown ) {
		warnIfDebug( 'ractive.render() was called on a Ractive instance that was already torn down' );
		return Promise.resolve();
	}

	target = getElement( target ) || this.el;

	if ( !this.append && target ) {
		// Teardown any existing instances *before* trying to set up the new one -
		// avoids certain weird bugs
		var others = target.__ractive_instances__;
		if ( others ) { others.forEach( teardown ); }

		// make sure we are the only occupants
		if ( !this.enhance ) {
			target.innerHTML = ''; // TODO is this quicker than removeChild? Initial research inconclusive
		}
	}

	var occupants = this.enhance ? toArray( target.childNodes ) : null;
	var promise = render$1( this, target, anchor, occupants );

	if ( occupants ) {
		while ( occupants.length ) { target.removeChild( occupants.pop() ); }
	}

	return promise;
}

var shouldRerender = [ 'template', 'partials', 'components', 'decorators', 'events' ];

var completeHook$1 = new Hook( 'complete' );
var resetHook = new Hook( 'reset' );
var renderHook$1 = new Hook( 'render' );
var unrenderHook = new Hook( 'unrender' );

function Ractive$reset ( data ) {
	data = data || {};

	if ( typeof data !== 'object' ) {
		throw new Error( 'The reset method takes either no arguments, or an object containing new data' );
	}

	// TEMP need to tidy this up
	data = dataConfigurator.init( this.constructor, this, { data: data });

	var promise = runloop.start( this, true );

	// If the root object is wrapped, try and use the wrapper's reset value
	var wrapper = this.viewmodel.wrapper;
	if ( wrapper && wrapper.reset ) {
		if ( wrapper.reset( data ) === false ) {
			// reset was rejected, we need to replace the object
			this.viewmodel.set( data );
		}
	} else {
		this.viewmodel.set( data );
	}

	// reset config items and track if need to rerender
	var changes = config.reset( this );
	var rerender;

	var i = changes.length;
	while ( i-- ) {
		if ( shouldRerender.indexOf( changes[i] ) > -1 ) {
			rerender = true;
			break;
		}
	}

	if ( rerender ) {
		unrenderHook.fire( this );
		this.fragment.resetTemplate( this.template );
		renderHook$1.fire( this );
		completeHook$1.fire( this );
	}

	runloop.end();

	resetHook.fire( this, data );

	return promise;
}

function collect( source, name, attr, dest ) {
	source.forEach( function (item) {
		// queue to rerender if the item is a partial and the current name matches
		if ( item.type === PARTIAL && ( item.refName ===  name || item.name === name ) ) {
			item.inAttribute = attr;
			dest.push( item );
			return; // go no further
		}

		// if it has a fragment, process its items
		if ( item.fragment ) {
			collect( item.fragment.iterations || item.fragment.items, name, attr, dest );
		}

		// or if it is itself a fragment, process its items
		else if ( Array.isArray( item.items ) ) {
			collect( item.items, name, attr, dest );
		}

		// or if it is a component, step in and process its items
		else if ( item.type === COMPONENT && item.instance ) {
			// ...unless the partial is shadowed
			if ( item.instance.partials[ name ] ) { return; }
			collect( item.instance.fragment.items, name, attr, dest );
		}

		// if the item is an element, process its attributes too
		if ( item.type === ELEMENT ) {
			if ( Array.isArray( item.attributes ) ) {
				collect( item.attributes, name, true, dest );
			}
		}
	});
}

function forceResetTemplate ( partial ) {
	partial.forceResetTemplate();
}

var resetPartial = function ( name, partial ) {
	var collection = [];
	collect( this.fragment.items, name, false, collection );

	var promise = runloop.start( this, true );

	this.partials[ name ] = partial;
	collection.forEach( forceResetTemplate );

	runloop.end();

	return promise;
};

// TODO should resetTemplate be asynchronous? i.e. should it be a case
// of outro, update template, intro? I reckon probably not, since that
// could be achieved with unrender-resetTemplate-render. Also, it should
// conceptually be similar to resetPartial, which couldn't be async

function Ractive$resetTemplate ( template ) {
	templateConfigurator.init( null, this, { template: template });

	var transitionsEnabled = this.transitionsEnabled;
	this.transitionsEnabled = false;

	// Is this is a component, we need to set the `shouldDestroy`
	// flag, otherwise it will assume by default that a parent node
	// will be detached, and therefore it doesn't need to bother
	// detaching its own nodes
	var component = this.component;
	if ( component ) { component.shouldDestroy = true; }
	this.unrender();
	if ( component ) { component.shouldDestroy = false; }

	var promise = runloop.start();

	// remove existing fragment and create new one
	this.fragment.unbind().unrender( true );

	this.fragment = new Fragment({
		template: this.template,
		root: this,
		owner: this
	});

	var docFrag = createDocumentFragment();
	this.fragment.bind( this.viewmodel ).render( docFrag );

	// if this is a component, its el may not be valid, so find a
	// target based on the component container
	if ( component && !component.external ) {
		this.fragment.findParentNode().insertBefore( docFrag, component.findNextNode() );
	} else {
		this.el.insertBefore( docFrag, this.anchor );
	}

	runloop.end();

	this.transitionsEnabled = transitionsEnabled;

	return promise;
}

var reverse = makeArrayMethod( 'reverse' ).path;

function Ractive$set ( keypath, value, options ) {
	var ractive = this;

	var opts = typeof keypath === 'object' ? value : options;

	return set( ractive, build( ractive, keypath, value, opts && opts.isolated ), opts );
}

var shift = makeArrayMethod( 'shift' ).path;

var sort = makeArrayMethod( 'sort' ).path;

var splice = makeArrayMethod( 'splice' ).path;

function Ractive$subtract ( keypath, d, options ) {
	var num = typeof d === 'number' ? -d : -1;
	var opts = typeof d === 'object' ? d : options;
	return add( this, keypath, num, opts );
}

function Ractive$toggle ( keypath, options ) {
	if ( typeof keypath !== 'string' ) {
		throw new TypeError( badArguments );
	}

	return set( this, gather( this, keypath, null, options && options.isolated ).map( function (m) { return [ m, !m.get() ]; } ), options );
}

function Ractive$toCSS() {
	var cssIds = [ this.cssId ].concat( this.findAllComponents().map( function (c) { return c.cssId; } ) );
	var uniqueCssIds = Object.keys(cssIds.reduce( function ( ids, id ) { return (ids[id] = true, ids); }, {}));
	return getCSS( uniqueCssIds );
}

function Ractive$toHTML () {
	return this.fragment.toString( true );
}

function toText () {
	return this.fragment.toString( false );
}

function Ractive$transition ( name, node, params ) {

	if ( node instanceof HTMLElement ) {
		// good to go
	}
	else if ( isObject( node ) ) {
		// omitted, use event node
		params = node;
	}

	// if we allow query selector, then it won't work
	// simple params like "fast"

	// else if ( typeof node === 'string' ) {
	// 	// query selector
	// 	node = this.find( node )
	// }

	node = node || this.event.node;

	if ( !node || !node._ractive ) {
		fatal( ("No node was supplied for transition " + name) );
	}

	params = params || {};
	var owner = node._ractive.proxy;
	var transition = new Transition({ owner: owner, parentFragment: owner.parentFragment, name: name, params: params });
	transition.bind();

	var promise = runloop.start( this, true );
	runloop.registerTransition( transition );
	runloop.end();

	promise.then( function () { return transition.unbind(); } );
	return promise;
}

function unlink( here ) {
	var promise = runloop.start();
	this.viewmodel.joinAll( splitKeypath( here ), { lastLink: false } ).unlink();
	runloop.end();
	return promise;
}

var unrenderHook$1 = new Hook( 'unrender' );

function Ractive$unrender () {
	if ( !this.fragment.rendered ) {
		warnIfDebug( 'ractive.unrender() was called on a Ractive instance that was not rendered' );
		return Promise.resolve();
	}

	this.unrendering = true;
	var promise = runloop.start( this, true );

	// If this is a component, and the component isn't marked for destruction,
	// don't detach nodes from the DOM unnecessarily
	var shouldDestroy = !this.component || ( this.component.anchor || {} ).shouldDestroy || this.component.shouldDestroy || this.shouldDestroy;
	this.fragment.unrender( shouldDestroy );
	if ( shouldDestroy ) { this.destroyed = true; }

	removeFromArray( this.el.__ractive_instances__, this );

	unrenderHook$1.fire( this );

	runloop.end();
	this.unrendering = false;

	return promise;
}

var unshift = makeArrayMethod( 'unshift' ).path;

function Ractive$updateModel ( keypath, cascade ) {
	var promise = runloop.start( this, true );

	if ( !keypath ) {
		this.viewmodel.updateFromBindings( true );
	} else {
		this.viewmodel.joinAll( splitKeypath( keypath ) ).updateFromBindings( cascade !== false );
	}

	runloop.end();

	return promise;
}

var proto = {
	add: Ractive$add,
	animate: Ractive$animate,
	attachChild: attachChild,
	detach: Ractive$detach,
	detachChild: detachChild,
	find: Ractive$find,
	findAll: Ractive$findAll,
	findAllComponents: Ractive$findAllComponents,
	findComponent: Ractive$findComponent,
	findContainer: Ractive$findContainer,
	findParent: Ractive$findParent,
	fire: Ractive$fire,
	get: Ractive$get,
	getContext: getContext$1,
	getNodeInfo: getNodeInfo$$1,
	insert: Ractive$insert,
	link: link,
	observe: observe,
	observeOnce: observeOnce,
	off: Ractive$off,
	on: Ractive$on,
	once: Ractive$once,
	pop: pop,
	push: push,
	readLink: readLink,
	render: Ractive$render,
	reset: Ractive$reset,
	resetPartial: resetPartial,
	resetTemplate: Ractive$resetTemplate,
	reverse: reverse,
	set: Ractive$set,
	shift: shift,
	sort: sort,
	splice: splice,
	subtract: Ractive$subtract,
	teardown: Ractive$teardown,
	toggle: Ractive$toggle,
	toCSS: Ractive$toCSS,
	toCss: Ractive$toCSS,
	toHTML: Ractive$toHTML,
	toHtml: Ractive$toHTML,
	toText: toText,
	transition: Ractive$transition,
	unlink: unlink,
	unrender: Ractive$unrender,
	unshift: unshift,
	update: Ractive$update,
	updateModel: Ractive$updateModel
};

Object.defineProperty( proto, 'target', {
	get: function get() { return this.el; }
});

function isInstance ( object ) {
	return object && object instanceof this;
}

var callsSuper = /super\s*\(|\.call\s*\(\s*this/;

function extend () {
	var options = [], len = arguments.length;
	while ( len-- ) options[ len ] = arguments[ len ];

	if( !options.length ) {
		return extendOne( this );
	} else {
		return options.reduce( extendOne, this );
	}
}

function extendWith ( Class, options ) {
	if ( options === void 0 ) options = {};

	return extendOne( this, options, Class );
}

function extendOne ( Parent, options, Target ) {
	if ( options === void 0 ) options = {};

	var proto;
	var Child = typeof Target === 'function' && Target;

	if ( options.prototype instanceof Ractive ) {
		throw new Error( "Ractive no longer supports multiple inheritance." );
	}

	if ( Child ) {
		if ( !( Child.prototype instanceof Parent ) ) {
			throw new Error( "Only classes that inherit the appropriate prototype may be used with extend" );
		}
		if ( !callsSuper.test( Child.toString() ) ) {
			throw new Error( "Only classes that call super in their constructor may be used with extend" );
		}

		proto = Child.prototype;
	} else {
		Child = function ( options ) {
			if ( !( this instanceof Child ) ) { return new Child( options ); }

			construct( this, options || {} );
			initialise( this, options || {}, {} );
		};

		proto = Object.create( Parent.prototype );
		proto.constructor = Child;

		Child.prototype = proto;
	}

	// Static properties
	Object.defineProperties( Child, {
		// alias prototype as defaults
		defaults: { value: proto },

		// extendable
		extend: { value: extend, writable: true, configurable: true },
		extendClass: { value: extendWith, writable: true, configurable: true },

		Parent: { value: Parent },
		Ractive: { value: Ractive },

		isInstance: { value: isInstance }
	});

	// extend configuration
	config.extend( Parent, proto, options );

	// store event and observer registries on the constructor when extending
	Child._on = ( Parent._on || [] ).concat( toPairs( options.on ) );
	Child._observe = ( Parent._observe || [] ).concat( toPairs( options.observe ) );

	// attribute defs are not inherited, but they need to be stored
	if ( options.attributes ) {
		var attrs;

		// allow an array of optional props or an object with arrays for optional and required props
		if ( Array.isArray( options.attributes ) ) {
			attrs = { optional: options.attributes, required: [] };
		} else {
			attrs = options.attributes;
		}

		// make sure the requisite keys actually store arrays
		if ( !Array.isArray( attrs.required ) ) { attrs.required = []; }
		if ( !Array.isArray( attrs.optional ) ) { attrs.optional = []; }

		Child.attributes = attrs;
	}

	dataConfigurator.extend( Parent, proto, options );

	if ( options.computed ) {
		proto.computed = Object.assign( Object.create( Parent.prototype.computed ), options.computed );
	}

	return Child;
}

function joinKeys () {
	var keys = [], len = arguments.length;
	while ( len-- ) keys[ len ] = arguments[ len ];

	return keys.map( escapeKey ).join( '.' );
}

function splitKeypath$1 ( keypath ) {
	return splitKeypath( keypath ).map( unescapeKey );
}

function findPlugin(name, type, instance) {
	return findInViewHierarchy(type, instance, name);
}

function Ractive ( options ) {
	if ( !( this instanceof Ractive ) ) { return new Ractive( options ); }

	construct( this, options || {} );
	initialise( this, options || {}, {} );
}

// check to see if we're being asked to force Ractive as a global for some weird environments
if ( win && !win.Ractive ) {
	var opts = '';
	var script = document.currentScript || document.querySelector( 'script[data-ractive-options]' );

	if ( script ) { opts = script.getAttribute( 'data-ractive-options' ) || ''; }

	if ( ~opts.indexOf( 'ForceGlobal' ) ) { win.Ractive = Ractive; }
}

Object.assign( Ractive.prototype, proto, defaults );
Ractive.prototype.constructor = Ractive;

// alias prototype as `defaults`
Ractive.defaults = Ractive.prototype;

// share defaults with the parser
shared.defaults = Ractive.defaults;
shared.Ractive = Ractive;

// static properties
Object.defineProperties( Ractive, {

	// debug flag
	DEBUG:            { writable: true, value: true },
	DEBUG_PROMISES:   { writable: true, value: true },

	// static methods:
	extend:           { value: extend },
	extendWith:       { value: extendWith },
	escapeKey:        { value: escapeKey },
	getContext:       { value: getContext$2 },
	getNodeInfo:      { value: getNodeInfo$1 },
	isInstance:       { value: isInstance },
	joinKeys:         { value: joinKeys },
	parse:            { value: parse },
	splitKeypath:     { value: splitKeypath$1 },
	unescapeKey:      { value: unescapeKey },
	getCSS:           { value: getCSS },
	normaliseKeypath: { value: normalise },
	findPlugin:       { value: findPlugin },
	evalObjectString: { value: parseJSON },

	// support
	enhance:          { writable: true, value: false },
	svg:              { value: svg },

	// version
	VERSION:          { value: '0.9.2' },

	// plugins
	adaptors:         { writable: true, value: {} },
	components:       { writable: true, value: {} },
	decorators:       { writable: true, value: {} },
	easing:           { writable: true, value: easing },
	events:           { writable: true, value: {} },
	interpolators:    { writable: true, value: interpolators },
	partials:         { writable: true, value: {} },
	transitions:      { writable: true, value: {} },

	// for getting the source Ractive lib from a constructor
	Ractive:          { value: Ractive }
});

return Ractive;

})));


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],42:[function(require,module,exports){
'use strict';
module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};

},{}],43:[function(require,module,exports){
module.exports = function denodeify(fn) {
	return function() {
		var self = this
		var args = Array.prototype.slice.call(arguments)
		return new Promise(function(resolve, reject) {
			args.push(function(err, res) {
				if (err) {
					reject(err)
				} else {
					resolve(res)
				}
			})

			var res = fn.apply(self, args)

			var isPromise = res
				&& (typeof res === 'object' || typeof res === 'function')
				&& typeof res.then === 'function'

			if (isPromise) {
				resolve(res)
			}
		})
	}
}

},{}],44:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[4]);
