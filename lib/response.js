'use strict';
/**
 * @file response.js
 * @author Wes Todd
 * @module nighthawk
 */

var EventEmitter = require('events');
var inherits = require('inherits');
var url = require('url');
var noop = function noop () {};

/**
 * Response
 *
 * @constructor Response
 * @memberof module:nighthawk
 */
var Response = module.exports = function Response () {
	this.app = null;
	this.locals = Object.create(null);
	this.headersSent = false;
	this.statusCode = null;
	this.statusMessage = '';
	this.finished = false;
	this.headersSent = false;
	this.sendDate = false;
};
inherits(Response, EventEmitter);

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

Response.prototype.status = function (code) {
	this.statusCode = code;
	return this;
};

// Noops for parity with backend request object
Response.prototype.links =
Response.prototype.send =
Response.prototype.json =
Response.prototype.jsonp =
Response.prototype.sendStatus =
Response.prototype.sendFile =
Response.prototype.download =
Response.prototype.contentType =
Response.prototype.type =
Response.prototype.format =
Response.prototype.attachment =
Response.prototype.append =
Response.prototype.set =
Response.prototype.header =
Response.prototype.get =
Response.prototype.clearCookie =
Response.prototype.cookie =
Response.prototype.location =
Response.prototype.vary =
Response.prototype.render =
Response.prototype.addTrailers =
Response.prototype.end =
Response.prototype.getHeader =
Response.prototype.getHeaderNames =
Response.prototype.getHeaders =
Response.prototype.hasHeader =
Response.prototype.removeHeader =
Response.prototype.setHeader =
Response.prototype.setTimeout =
Response.prototype.write =
Response.prototype.writeContinue =
Response.prototype.writeHead =
noop;
