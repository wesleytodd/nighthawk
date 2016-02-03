/**
 * @file request.js
 * @author Wes Todd
 * @module nighthawk
 */
 var parse = require('parseurl');

/**
 * Request
 *
 * @constructor Request
 * @memberof module:nighthawk
 */
var Request = module.exports = function Request () {
	this.url = '';
	this.method = null;
	this.baseUrl = null;
	this.originalUrl = null;
	this.protocol = window.location.protocol;
	this.path = null;

	Object.defineProperty(this, 'query', {
		configurable: true,
		enumerable: true,
		get: function query () {
			var queryparse = this.app.get('query parser fn');

			if (!queryparse) {
				// parsing is disabled
				return Object.create(null);
			}

			return queryparse(parse(this).query);
		}
	});
};

// Noops for parity with backend request object
Request.prototype.header = function () {};
