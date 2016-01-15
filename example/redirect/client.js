require('../../lib/polyfills');
var router = require('../../')();
var routes = require('./routes');

routes(router);
router.listen();
