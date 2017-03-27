'use strict';
/**
 * @file response.js
 * @author Wes Todd
 * @module nighthawk
 */

// Requirements
var url = require('url');

/**
 * Response
 *
 * @constructor Response
 * @memberof module:nighthawk
 */
var Response = module.exports = function Response () {
	this.app = null;
	this.locals = {};
};

/**
 * Redirect to a different route
 *
 * @function redirect
 * @memberof module:nighthawk.Response
 * @instance
 * @param {String} u - The new url
 */
Response.prototype.redirect = function (u) {
	// In a timeout because page.js did it, but I believe it is better
	// to let the current route handler finish its stuff before starting
	// another round of routing, otherwise we could get some weird behavior.
	setTimeout(function () {
		// Convert the url string into an object
		// before passing it along to the router
		u = url.parse(u);
		this.app._processRequest(u, true);
	}.bind(this), 0);
};
