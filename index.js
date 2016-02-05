// Expose the Router constructor
module.exports = require('./lib/application');

// Expose the base router for express compat
module.exports.Router = require('router');

// Expose request and response
module.exports.Request = require('./lib/request');
module.exports.Response = require('./lib/response');
