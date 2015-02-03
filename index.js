// Expose the Router constructor
module.exports = require('./router');

// Is the History API supported?
module.exports.pushStateSupported = require('./supports-push-state');
