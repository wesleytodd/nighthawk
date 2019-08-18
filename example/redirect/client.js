var router = require('nighthawk')()
var routes = require('./routes')

routes(router)
router.listen()
