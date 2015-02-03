var BaseRouter = require('router'),
	util = require('util'),
	supported = require('./supports-push-state');

var Router = module.exports = function Router(options) {
	if (!(this instanceof Router)) {
		return new Router(options)
	}

	this._base = null;

	return BaseRouter.call(this, options);
};
util.inherits(Router, BaseRouter);

Router.prototype.base = function(path) {
	this._base = path;
};

Router.prototype.listen = function(options) {
	// Don't do anything when pushState is not supported
	if (!supported) {
		return;
	}

	// Default options
	options = options || {};

	// Watch for popstate?
	if (options.popstate !== false) {
		window.addEventListener('popstate', this.onPopstate.bind(this), false);
	}
	
	// Intercept all clicks?
	if (options.interceptClicks !== false) {
		window.addEventListener('click', this.onClick.bind(this), false);
	}

	// Dispatch at start?
	if (options.dispatch !== false) {
		this._processRequest(window.location.pathname);
	}
};

Router.prototype.onPopstate = function(E) {
};

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
    if (el.pathname === window.location.pathname && (el.hash || link === '#')) {
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

Router.prototype._processRequest = function(url) {
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
var isInternal = new RegExp('^(?:(?:http[s]?:\/\/)?' + window.location.host.replace(/\./g, '\\.') + ')?\/', 'i');
function sameOrigin(url) {
	return !!isInternal.test(url);
}
