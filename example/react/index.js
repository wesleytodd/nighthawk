require('babel-register');
var app = require('express')();
var serveStatic = require('serve-static');
var ejs = require('consolidate').ejs;
var routes = require('./routes');

app.engine('html', ejs);
app.set('view engine', 'html');
app.set('views', '.');

// Register routes
routes(app);

// Serve static assets
app.use('/static', serveStatic('.'));

// Start server
app.listen('1234', function () {
	console.log('Listening on 1234');
});
