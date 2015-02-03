// Expose the Router constructor
module.exports = require('./lib/router');

// Is the History API supported?
module.exports.pushStateSupported = require('./lib/supports-push-state');
