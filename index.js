'use strict';

// Expose the Router constructor
module.exports = require('./lib/router');

// Expose request and response
module.exports.Request = require('./lib/request');
module.exports.Response = require('./lib/response');

// Is the History API supported?
module.exports.pushStateSupported = require('./lib/supports-push-state');
