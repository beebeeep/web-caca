var StateRouter = require('abstract-state-router')
var Ractive = require('ractive')
var ractiveRenderer = require('ractive-state-router')
var domready = require('domready')
var moment = require('moment');
var filesize = require('filesize');

var model = require('./model.js');

global.jQuery = require('jquery');

// setup ractive and some helpers 
var stateRouter = StateRouter(ractiveRenderer(Ractive, {
		data: {
			formatTS: (ts) => {
				return moment(ts).fromNow();
			},
			showFiles: (files) => {
				var a = [];
				if (files === undefined) {
					return "";
				}
                for (var i = 0; i < files.length; i++) { 
                    a.push(files[i].name)
                }
				return a.join('; ');
			},
			humanizeBytes: (bytes) => {
				return filesize(bytes, {'standard': 'iec'})
			},
			getFullURL: (url) => {
				return model.getCredentials().url + "/" + url;
			}
		}
	}), 'body')

stateRouter.setMaxListeners(20)

require('./login/login')(stateRouter)
require('./app/app')(stateRouter)

domready(function() {
	stateRouter.evaluateCurrentRoute('login')
})
