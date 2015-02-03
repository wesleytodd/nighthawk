var express = require('express'),
	app = express(),
	appbase = express(),
	static = require('serve-static'),
	ejs = require('consolidate').ejs,
	routes = require('./routes');

app.engine('html', ejs);
app.set('view engine', 'html');
app.set('views', 'templates');

// Register routes on child app
routes(app);

// Serve static assets on base app
appbase.use('/static', static('.'));

// Mount child app on base app
appbase.use('/base', app);

// Start server
appbase.listen('1234');
