var router = require('nighthawk')({
	base: '/base'
});
var routes = require('./routes');

routes(router);
router.listen();
