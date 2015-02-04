var foo = require('./handlers/foo');

module.exports = function(router) {
	router.get('/', function(req, res) {
		console.log('index');
		res.redirect('/foo');
	});
	router.get('/foo', foo);
};
