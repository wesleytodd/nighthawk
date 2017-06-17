var isBrowser = require('is-browser');

module.exports = function (req, res) {
	if (isBrowser) {
		console.log('foo', req.params.bar);
	} else {
		res.render('index');
	}
};
