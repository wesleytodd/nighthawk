require('../../lib/polyfills');
var router = require('../../')({base: '/base'});
var routes = require('./routes');

routes(router);
router.listen();
