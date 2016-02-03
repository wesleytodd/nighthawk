var setPrototypeOf = require('setprototypeof');
var mixin = require('merge-descriptors');
var EventEmitter = require('events').EventEmitter;
var Settings = require('store-settings');
var interceptClicks = require('intercept-link-clicks');
var querystring = require('querystring');
var qs = require('qs');
var flatten = require('array-flatten');
var Router = require('router');
var methods = require('methods');
var supported = require('./supports-push-state');
var Request = require('./request');
var Response = require('./response');

var Application = module.exports = function Application (options) {
	if (!(this instanceof Application)) {
		return new Application(options);
	}

	// Optional
	options = options || {};

	// The actual route handler
	var app = function (req, res, next) {
		app.handle(req, res, next);
	};

	// Keep the currently matched location
	app.currentLocation = null;

	// Add request and response to app
	app.request = { app: app };
	setPrototypeOf(app.request, Request.prototype);
	app.response = { app: app };
	setPrototypeOf(app.response, Response.prototype);

	// Lazily create the router
	var router = null;
	Object.defineProperty(app, 'router', {
		configurable: true,
		enumerable: true,
		get: function getrouter () {
			if (router === null) {
				router = new Router({
					caseSensitive: this.enabled('case sensitive routing'),
					strict: this.enabled('strict routing')
				});
			}
			return router;
		}
	});

	// Add prototype and event emitter to app
	setPrototypeOf(app, this);

	// Add settings stuff to app
	Settings.call(app, {
		setters: {
			'query parser': function (val) {
				this.set('query parser fn', compileQueryParser(val));
			}
		}
	});

	// Setup default configuration
	app.defaultConfiguration();

	return app;
};
mixin(Application.prototype, EventEmitter.prototype, false);
mixin(Application.prototype, Settings.prototype, false);

Application.prototype.defaultConfiguration = function () {
	this.set('env', process.env.NODE_ENV || 'development');
	this.set('query parser', 'extended');
	this.on('mount', function (parent) {
		setPrototypeOf(this.settings, parent.settings);
	});

	this.locals = Object.create(null);
	this.mountpath = '/';
};

Application.prototype.listen = function (options) {
	// Default options
	options = options || {};

	// Watch for popstate?
	if (supported && options.popstate !== false) {
		bindPopstate(this);
	}

	// Intercept all clicks?
	if (supported && options.interceptClicks !== false) {
		bindClick(this, options.interceptClickElement);
	}

	// Dispatch at start?
	if (options.dispatch !== false) {
		processRouteChange(this, {
			pathname: window.location.pathname,
			search: window.location.search,
			hash: window.location.hash
		}, true);
	}
};

Application.prototype.handle = function (req, res, done) {
	// setup locals
	if (!res.locals) {
		res.locals = Object.create(null);
	}

	this.router.handle(req, res, done);
};

Application.prototype.use = function (fn) {
	var offset = 0;
	var path = '/';

	// default path to '/'
	// disambiguate app.use([fn])
	if (typeof fn !== 'function') {
		var arg = fn;

		while (Array.isArray(arg) && arg.length !== 0) {
			arg = arg[0];
		}

		// first arg is the path
		if (typeof arg !== 'function') {
			offset = 1;
			path = fn;
		}
	}

	var fns = flatten(Array.prototype.slice.call(arguments, offset));

	if (fns.length === 0) {
		throw new TypeError('app.use() requires middleware functions');
	}

	// get router
	var router = this.router;

	fns.forEach(function (fn) {
		// non-express app
		if (!fn || !fn.handle || !fn.set) {
			return router.use(path, fn);
		}

		fn.mountpath = path;
		fn.parent = this;

		// restore .app property on req and res
		router.use(path, function mountedApp (req, res, next) {
			var orig = req.app;
			fn.handle(req, res, function (err) {
				setPrototypeOf(req, orig.request);
				setPrototypeOf(res, orig.response);
				next(err);
			});
		});

		// mounted an app
		fn.emit('mount', this);
	}, this);

	return this;
};

Application.prototype.route = function (path) {
	return this.router.route(path);
};

Application.prototype.param = function param (name, fn) {
	if (Array.isArray(name)) {
		for (var i = 0; i < name.length; i++) {
			this.param(name[i], fn);
		}
		return this;
	}
	this.router.param(name, fn);
	return this;
};

Application.prototype.path = function path () {
	return this.parent
		? this.parent.path() + this.mountpath
		: '';
};

Application.prototype.all = function (path) {
	var route = this.route(path);
	var args = Array.prototype.call(arguments, 1);

	for (var i = 0; i < methods.length; i++) {
		route[methods[i]].apply(route, args);
	}

	return this;
};

methods.forEach(function (method) {
	Application.prototype[method] = function (path) {
		if (method === 'get' && arguments.length === 1) {
			// app.get(setting)
			return Settings.prototype.get.call(this, path);
		}

		var route = this.route(path);
		route[method].apply(route, Array.prototype.slice.call(arguments, 1));
		return this;
	};
});

Application.prototype.destroy = function () {
	this.emit('destroy');
};

/**
 * Helper Methods
 */

var _apps = false;
var _popStateBound = false;
function bindPopstate (app) {
	if (!_popStateBound) {
		_popStateBound = true;
		window.addEventListener('popstate', onPopstate, false);
		app.on('destroy', function () {
			_apps.splice(_apps.indexOf(app), 1);

			if (_apps.length === 0) {
				_popStateBound = false;
				window.removeEventListener('popstate', onPopstate, false);
			}
		});
	}
	_apps.push(app);
}
function onPopstate (e) {
	_apps.forEach(function (app) {
		processRouteChange(app, e.state || {
			pathname: window.location.pathname,
			search: window.location.search,
			hash: window.location.hash
		}, true);
	});
}

function bindClick (app, el) {
	el = el || window;
	app.on('destroy', interceptClicks(el, function (e, el) {
		// Make sure the base is present if set
		if (app.mountpath && el.pathname.indexOf(app.mountpath) !== 0) {
			return;
		}

		// We are all good to parse the route,
		// so cancel the default navigation
		e.preventDefault();

		// Run the route matching
		processRouteChange(app, {
			pathname: el.pathname,
			search: el.search,
			hash: el.hash
		});
	}));
}

function processRouteChange (app, url, replace) {
	// Normalize the url object
	url.search = url.search || '';
	url.hash = url.hash || '';

	// Strip the base off before routing
	var path = url.pathname;
	if (this.mountpath) {
		path = path.replace(this.mountpath, '');
	}

	// Build next url
	var nextLocation = (path === '' ? '/' : path) + url.search;

	// If processing to the same url, just return
	if (app.currentLocation === nextLocation) {
		return;
	}
	app.currentLocation = nextLocation;

	// Create the request
	var req = Object.create(app.request, {
		method: propertyDescriptor('GET'),
		originalUrl: propertyDescriptor(url.pathname + url.search + url.hash),
		baseUrl: propertyDescriptor(app.mountpath),
		path: propertyDescriptor(url.pathname),
		url: propertyDescriptor(app.currentLocation + url.hash)
	});

	// Create the response
	var res = Object.create(app.response);

	// Push the state
	if (supported) {
		window.history[replace ? 'replaceState' : 'pushState'](url, null, req.originalUrl);
	}

	app.handle(req, res, function (e) {
		if (e) {
			app.emit('error', e);
		}
	});
}

function propertyDescriptor (val) {
	return {
		writable: true,
		configurable: true,
		value: val
	};
}

function compileQueryParser (val) {
	var fn;

	if (typeof val === 'function') {
		return val;
	}

	switch (val) {
	case true:
		fn = querystring.parse;
		break;
	case false:
		break;
	case 'extended':
		fn = parseExtendedQueryString;
		break;
	case 'simple':
		fn = querystring.parse;
		break;
	default:
		throw new TypeError('unknown value for query parser function: ' + val);
	}

	return fn;
}

function parseExtendedQueryString (str) {
	return qs.parse(str, {
		allowDots: false,
		allowPrototypes: true
	});
}
