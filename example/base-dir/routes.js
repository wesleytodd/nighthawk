var index = require('./handlers/index'),
	foo = require('./handlers/foo');

module.exports = function(router) {
	router.get('/', index);
	router.get('/foo/:bar', foo);
};
