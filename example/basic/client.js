var polyfills = require('../lib/polyfills'),
	router = require('../')(),
	routes = require('./routes');

routes(router);
router.listen()
