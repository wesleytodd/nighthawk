var browserify = require('browserify-middleware');
var express = require('express');
var app = express();
var appbase = express();

appbase.use('/static/client.js', browserify(__dirname + '/client.js'));

// Register routes on child app
require('./routes')(app);

// Mount child app on base app
appbase.use('/base', app);

// Start server
appbase.listen('1234');
