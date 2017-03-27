/**
 * @file request.js
 * @author Wes Todd
 * @module nighthawk
 */

/**
 * Request
 *
 * @constructor Request
 * @memberof module:nighthawk
 */
var Request = module.exports = function Request () {
	this.app = null;
	this.url = '';
	this.method = null;
	this.baseUrl = null;
	this.originalUrl = null;
	this.path = null;

	// Chop off the :
	var _proto = window.location.protocol;
	this.protocol = _proto.slice(0, _proto.length - 1);
};

// Noops for parity with backend request object
Request.prototype.header = function () {};
