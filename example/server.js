var app = require('express')(),
	static = require('serve-static'),
	ejs = require('consolidate').ejs,
	routes = require('./routes');

app.engine('html', ejs);
app.set('view engine', 'html');
app.set('views', 'templates');

// Register routes
routes(app);

// Serve static assets
app.use('/static', static('.'));

// Start server
app.listen('1234');
