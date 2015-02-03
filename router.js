/**
 * @file Router.js
 * @author Wes Todd
 * @version 1.0
 * @module netgear
 */

// Requirements
var BaseRouter = require('router'),
	util = require('util'),
	supported = require('./supports-push-state');

/**
 * Router
 *
 * @constructor Router
 * @memberof module:netgear
 * @augments module:router.Router
 * @param {Object} [options]
 * @param {String} [options.base] - The base path for this router to match against
 */
var Router = module.exports = function Router(options) {
	if (!(this instanceof Router)) {
		return new Router(options);
	}

	// Set the base path
	this.base(options.base || null);

	// Call parent constructor
	BaseRouter.call(this, options);
};
util.inherits(Router, BaseRouter);

/**
 * Set the base path for this router
 *
 * @function base
 * @memberof module:netgear.Router
 * @instance
 * @param {String} path - The new base path
 */
Router.prototype.base = function(path) {
	this._base = path;
};

/**
 * Start listening for route chagnes
 *
 * @function listen
 * @memberof module:netgear.Router
 * @instance
 * @param {Object} [options]
 * @param {Boolean} [options.popstate] - Should we bind to the popstate event?
 * @param {Boolean} [options.interceptClicks] - Should we bind to the window's click event?
 * @param {Boolean} [options.dispatch] - Should we dispatch a route right away?
 */
Router.prototype.listen = function(options) {
	// Default options
	options = options || {};

	// Watch for popstate?
	if (supported && options.popstate !== false) {
		window.addEventListener('popstate', this.onPopstate.bind(this), false);
	}
	
	// Intercept all clicks?
	if (supported && options.interceptClicks !== false) {
		window.addEventListener('click', this.onClick.bind(this), false);
	}

	// Dispatch at start?
	if (options.dispatch !== false) {
		this._processRequest(location.pathname + location.search + location.hash, true);
	}
};

/**
 * Handler for the popstate event
 *
 * @function onPopstate
 * @memberof module:netgear.Router
 * @instance
 * @param {Event} e
 */
Router.prototype.onPopstate = function(e) {
	// Process the request
	this._processRequest((e.state && e.state.path) || location.pathname + location.search + location.hash, true);
};

/**
 * Handler for all click events
 *
 * @function onClick
 * @memberof module:netgear.Router
 * @instance
 * @param {Event} e
 */
Router.prototype.onClick = function(e) {
	// Cross browser event
	e = e || window.event;

	// Check we are just a normal click
	if (which(e) !== 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) {
		return;
	}

	// Find link up the dom tree
	var el = isLink(e.target);

	// Not a link
	if (!el) {
		return;
	}

	// Ignore if tag has
	// 1. "download" attribute
	// 2. rel="external" attribute
	// 3. target attribute
	if (el.getAttribute('download') || el.getAttribute('rel') === 'external' || el.target) {
		return;
	}

	// Get the link href
	var link = el.getAttribute('href');

	// ensure this is not a hash for the same path
	if (el.pathname === location.pathname && (el.hash || link === '#')) {
		return;
	}

	// Check for mailto: in the href
	if (link && link.indexOf('mailto:') > -1) {
		return;
	}

	// Only for same origin
	if (!sameOrigin(link)) {
		return;
	}

	// Construct full path
	var path = el.pathname + el.search + (el.hash || '');

	// Make sure the base is present if set
	if (this._base && path.indexOf(this._base) === 0) {
		return;
	}

	// We are all good to parse the route
	e.preventDefault();

	// Run the route matching
	this._processRequest(el.pathname);
};

/**
 * Process a url
 *
 * @function onClick
 * @memberof module:netgear.Router
 * @instance
 * @private
 * @param {String} url - The new url for the page
 * @param {Boolean} replace - Should this replace or push?
 */
Router.prototype._processRequest = function(url, replace) {
	// Push the state
	history[replace ? 'replaceState' : 'pushState']({path: url}, null, url);

	// Run the route matching
	this({
		method: 'GET',
		url: url
	}, {}, function() {
		console.log(404);
	});
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
var isInternal = new RegExp('^(?:(?:http[s]?:\/\/)?' + location.host.replace(/\./g, '\\.') + ')?\/', 'i');
function sameOrigin(url) {
	return !!isInternal.test(url);
}
