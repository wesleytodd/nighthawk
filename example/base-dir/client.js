var router = require('../../lib/application')();

// Set mount path
router.mountpath = '/base';

// Register routes
require('./routes')(router);

// Start router listening
router.listen();
