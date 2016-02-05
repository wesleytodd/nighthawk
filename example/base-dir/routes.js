var index = require('./handlers/index');
var foo = require('./handlers/foo');
var four0four = require('./handlers/404');

module.exports = function (router) {
	router.get('/', index);
	router.get('/foo/:bar', foo);
	router.use(four0four);
};
