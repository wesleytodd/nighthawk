var polyfills = require('../../lib/polyfills'),
	router = require('../../')({base: '/base'}),
	routes = require('./routes');

routes(router);
router.listen();
