var polyfills = require('../polyfills'),
	router = require('../')(),
	routes = require('./routes');

routes(router);
router.listen()
