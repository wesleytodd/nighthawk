var index = require('./handlers/index');
var foo = require('./handlers/foo');
var bar = require('./handlers/bar');

module.exports = function (router) {
	router.get('/', index);
	router.get('/foo', foo);
	router.get('/foo/:bar', bar);
};
