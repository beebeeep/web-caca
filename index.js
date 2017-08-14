var StateRouter = require('abstract-state-router')
var Ractive = require('ractive')
var ractiveRenderer = require('ractive-state-router')
var domready = require('domready')
var moment = require('moment');

global.jQuery = require('jquery');

// setup ractive and some helpers 
var stateRouter = StateRouter(ractiveRenderer(Ractive, {
		data: {
			formatTS: function (ts) {
				return moment(ts).fromNow();
			},
			showFiles: function (files) {
				var a = [];
				if (files === undefined) {
					return "";
				}
                for (var i = 0; i < files.length; i++) { 
                    a.push(files[i].name)
                }
				return a.join('; ');
			},
		}
	}), 'body')

stateRouter.setMaxListeners(20)

require('./login/login')(stateRouter)
require('./app/app')(stateRouter)

domready(function() {
	stateRouter.evaluateCurrentRoute('login')
})
