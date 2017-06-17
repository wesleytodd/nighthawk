var reactExpressMiddleware = require('react-express-middleware');

module.exports = function routes (router) {
	// Isomorphic react render middleware
	router.use(reactExpressMiddleware());

	router.get('/', require('./handlers/index.jsx'));
	router.get('/foo', require('./handlers/foo.jsx'));
	router.get('/bar', require('./handlers/bar.jsx'));
};
