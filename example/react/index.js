require('babel-register');
var browserify = require('browserify-middleware');
var app = require('express')();
var ejs = require('consolidate').ejs;

app.engine('html', ejs);
app.set('view engine', 'html');
app.set('views', '.');

// Register routes
require('./routes')(app);

// Serve static assets
app.use('/static/client.js', browserify(__dirname + '/client.js', {
	transform: ['babelify']
}));

// Start server
app.listen('1234', function () {
	console.log('Listening on 1234');
});
