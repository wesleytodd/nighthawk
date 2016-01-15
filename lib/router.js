/**
 * @file router.js
 * @author Wes Todd
 * @version 1.0
 * @module nighthawk
 */

// Requirements
var BaseRouter = require('router'),
	util = require('util'),
	qs = require('querystring'),
	Request = require('./request'),
	Response = require('./response'),
	supported = require('./supports-push-state'),
	interceptClicks = require('intercept-link-clicks');

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
var Router = module.exports = function Router(options) {
	if (!(this instanceof Router)) {
		return new Router(options);
	}

	// Options is optional
	options = options || {};

	// Set the base path
	this.base(options.base || null);

	// Keep the currently matched location
	this.currentLocation = null;

	// Call parent constructor
	var r =  BaseRouter.call(this, options);

	// Parse query string
	if (options.parseQuerystring) {
		r.use(function(req, res, next) {
			req.query = qs.parse(req._parsedUrl.query);
			next();
		});
	}

	// A couple of internal vars
	this._stopInterceptingClicks = null;

	return r;
};
util.inherits(Router, BaseRouter);

/**
 * Set the base path for this router
 *
 * @function base
 * @memberof module:nighthawk.Router
 * @instance
 * @param {String} path - The new base path
 */
Router.prototype.base = function(path) {
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
Router.prototype.listen = function(options) {
	// Default options
	options = options || {};

	// Pre-bind the listeners so we can properly remove them later
	this.onPopstate = this.onPopstate.bind(this);
	this.onClick = this.onClick.bind(this);

	// Watch for popstate?
	if (supported && options.popstate !== false) {
		window.addEventListener('popstate', this.onPopstate, false);
	}
	
	// Intercept all clicks?
	if (supported && options.interceptClicks !== false) {
		this._stopInterceptingClicks = interceptClicks(this.onClick);
	}

	// Dispatch at start?
	if (options.dispatch !== false) {
		this._processRequest({
			pathname: location.pathname,
			search: location.search,
			hash: location.hash
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
Router.prototype.onPopstate = function(e) {
	this._processRequest(e.state || {
		pathname: location.pathname,
		search: location.search,
		hash: location.hash
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
Router.prototype.onClick = function(e, el) {
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
 * Process a url
 *
 * @function onClick
 * @memberof module:nighthawk.Router
 * @instance
 * @private
 * @param {Object} url - The new url for the page
 * @param {String} url.pathname - The path part of the url
 * @param {String} url.search - The search part of the url
 * @param {String} url.hash - The hash part of the url
 * @param {Boolean} replace - Should this replace or push?
 */
Router.prototype._processRequest = function(url, replace) {
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
	req.path = url.pathname; 
	req.url = this.currentLocation + url.hash; 

	// Create the response object
	var res = new Response();
	res.app = this;

	// Push the state
	history[replace ? 'replaceState' : 'pushState'](url, null, req.originalUrl);

	// Run the route matching
	this(req, res, function(e) {
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
Router.prototype.destroy = function() {
	window.removeEventListener('popstate', this.onPopstate, false);
	if (typeof this._stopInterceptingClicks === 'function') {
		this._stopInterceptingClicks();
	}
};

// Is this element a link?
function isLink(el) {
	while (el && 'A' !== el.nodeName) {
		el = el.parentNode;
	}
	if (!el || 'A' !== el.nodeName) {
		return;
	}
	return el;
}

// Get the button
function which(e) {
	return e.which === null ? e.button : e.which;
}

// Internal request
var isInternal = new RegExp('^(?:(?:http[s]?:\/\/)?' + location.host.replace(/\./g, '\\.') + ')?\/?[#?]?', 'i');
function sameOrigin(url) {
	return !!isInternal.test(url);
}
