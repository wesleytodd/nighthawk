var browserify = require('browserify-middleware');
var app = require('express')();

// Register routes
require('./routes')(app);

// Serve static assets
app.use('/static/client.js', browserify(__dirname + '/client.js'));

// Start server
app.listen('1234');
