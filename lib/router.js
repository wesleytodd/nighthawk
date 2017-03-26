/**
 * @file router.js
 * @author Wes Todd
 * @module nighthawk
 */

// Requirements
var BaseRouter = require('router');
var inherits = require('inherits');
var url = require('url');
var interceptClicks = require('intercept-link-clicks');
var Request = require('./request');
var Response = require('./response');
var supported = require('./supports-push-state');

// Lazy load query string parser
var qs = {};
var _qs;
Object.defineProperty(qs, 'parse', {
	get: function () {
		_qs = _qs || require('q' + 's');
		return _qs.parse;
	}
});

/**
 * Router
 *
 * @constructor Router
 * @memberof module:nighthawk
 * @augments module:router.Router
 * @param {Object} [options]
 * @param {String} [options.base] - The base path for this router to match against
 * @param {String} [options.parseQuerystring] - Should we parse the querysrting
 */
var Router = module.exports = function Router (options) {
	if (!(this instanceof Router)) {
		return new Router(options);
	}

	// Options is optional
	var opts = options || {};

	// Set the base path
	this.base(opts.base || null);

	// Keep the currently matched location
	this.currentLocation = null;

	// Call parent constructor
	var r = BaseRouter.call(this, opts);

	// Parse query string
	if (opts.parseQuerystring) {
		r.use(function (req, res, next) {
			req.query = qs.parse(req._parsedUrl.query);
			next();
		});
	}

	// A couple of internal vars
	this._stopInterceptingClicks = null;

	return r;
};
inherits(Router, BaseRouter);

/**
 * Set the base path for this router
 *
 * @function base
 * @memberof module:nighthawk.Router
 * @instance
 * @param {String} path - The new base path
 */
Router.prototype.base = function (path) {
	if (typeof path === 'undefined') {
		return this._base;
	}
	this._base = path;
};

/**
 * Start listening for route chagnes
 *
 * @function listen
 * @memberof module:nighthawk.Router
 * @instance
 * @param {Object} [options]
 * @param {Boolean} [options.popstate] - Should we bind to the popstate event?
 * @param {Boolean} [options.interceptClicks] - Should we bind to the window's click event?
 * @param {Boolean} [options.dispatch] - Should we dispatch a route right away?
 */
Router.prototype.listen = function (options) {
	// Default options
	var opts = options || {};

	// Watch for popstate?
	if (supported && opts.popstate !== false) {
		// Pre-bind the popstate listener so we can properly remove it later
		this.onPopstate = this.onPopstate.bind(this);

		// Bind the event
		window.addEventListener('popstate', this.onPopstate, false);
	}

	// Intercept all clicks?
	if (supported && opts.interceptClicks !== false) {
		this._stopInterceptingClicks = interceptClicks(this.onClick.bind(this));
	}

	// Dispatch at start?
	if (opts.dispatch !== false) {
		this._processRequest({
			pathname: window.location.pathname,
			search: window.location.search,
			hash: window.location.hash
		}, true);
	}
};

/**
 * Handler for the popstate event
 *
 * @function onPopstate
 * @memberof module:nighthawk.Router
 * @instance
 * @param {Event} e
 */
Router.prototype.onPopstate = function (e) {
	this._processRequest(e.state || {
		pathname: window.location.pathname,
		search: window.location.search,
		hash: window.location.hash
	}, true);
};

/**
 * Handler for all click events
 *
 * @function onClick
 * @memberof module:nighthawk.Router
 * @instance
 * @param {Event} e
 * @param {Element} el - The clicked link element
 */
Router.prototype.onClick = function (e, el) {
	// Make sure the base is present if set
	if (this._base && el.pathname.indexOf(this._base) !== 0) {
		return;
	}

	// We are all good to parse the route
	e.preventDefault();

	// Run the route matching
	this._processRequest({
		pathname: el.pathname,
		search: el.search,
		hash: el.hash
	});
};

/**
 * Change the page route
 *
 * @function onClick
 * @memberof module:nighthawk.Router
 * @instance
 * @param {String} url - The new url for the page
 */
Router.prototype.changeRoute = function (_url) {
	this._processRequest(url.parse(_url));
};

/**
 * Process a url
 *
 * @function _processRequest
 * @memberof module:nighthawk.Router
 * @instance
 * @private
 * @param {Object} url - The new url for the page
 * @param {String} url.pathname - The path part of the url
 * @param {String} url.search - The search part of the url
 * @param {String} url.hash - The hash part of the url
 * @param {Boolean} replace - Should this replace or push?
 */
Router.prototype._processRequest = function (url, replace) {
	// Normalize the url object
	url.search = url.search || '';
	url.hash = url.hash || '';

	// Strip the base off before routing
	var path = url.pathname;
	if (this._base) {
		path = path.replace(this._base, '');
	}

	// Build next url
	var nextLocation = (path === '' ? '/' : path) + url.search;

	// If processing to the same url, just return
	if (this.currentLocation === nextLocation) {
		return;
	}
	this.currentLocation = nextLocation;

	// Create the request object
	var req = new Request();
	req.app = this;
	req.method = 'GET';
	req.originalUrl = url.pathname + url.search + url.hash;
	req.baseUrl = this._base;
	req.path = path;
	req.url = this.currentLocation + url.hash;

	// Create the response object
	var res = new Response();
	res.app = this;

	// Push the state
	if (supported) {
		window.history[replace ? 'replaceState' : 'pushState'](url, null, req.originalUrl);
	}

	// Run the route matching
	this(req, res, function (e) {
		if (e) {
			throw e;
		}
	});
};

/**
 * Stops listening on the window events
 *
 * @function destroy
 * @memberof module:nighthawk.Router
 * @instance
 */
Router.prototype.destroy = function () {
	window.removeEventListener('popstate', this.onPopstate, false);
	if (typeof this._stopInterceptingClicks === 'function') {
		this._stopInterceptingClicks();
	}
};
