'use strict';
/**
 * @file request.js
 * @author Wes Todd
 * @module nighthawk
 */

var EventEmitter = require('events');
var inherits = require('inherits');
var _loc = typeof window !== 'undefined' && window.location;
var noop = function noop () {};

/**
 * Request
 *
 * @constructor Request
 * @memberof module:nighthawk
 */
var Request = module.exports = function Request () {
	this.app = null;
	this.url = null;
	this.method = null;
	this.baseUrl = null;
	this.originalUrl = null;
	this.path = null;
	this.hostname = _loc.hostname;
	this.protocol = _loc.protocol.slice(0, _loc.protocol.length - 1);
	this.secure = this.protocol === 'https';

	// This is more basic than the one in express, but I think
	// that is alright for now because that one uses the a method
	// from the c++ portion of the net package
	this.subdomains = this.hostname.split('.').reverse().slice(2);

	// Most of these do not apply on the front-end
	this.socket = null;
	this.httpVersion = '1.1';
	this.rawHeaders = [];
	this.headers = {};
	this.rawTrailers = [];
	this.trailers = {};
	this.ip = '';
	this.ips = [];
	this.fresh = true;
	this.stale = false;
	this.xhr = false;
};
inherits(Request, EventEmitter);

Request.prototype.header =
Request.prototype.get = function (name) {
	if (typeof name !== 'string') {
		throw new TypeError('name must be a string to req.get');
	}
	var lc = name.toLowerCase();
	switch (lc) {
		case 'referer':
		case 'referrer':
			return document.referrer;
		case 'content-type':
			return document.contentType;
	}
};

// Noops for parity with backend request object
Request.prototype.accepts =
Request.prototype.acceptsEncodings =
Request.prototype.acceptsCharsets =
Request.prototype.acceptsLanguages =
Request.prototype.range =
Request.prototype.is =
noop;
