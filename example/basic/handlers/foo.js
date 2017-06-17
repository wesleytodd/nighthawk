var isBrowser = require('is-browser');

module.exports = function (req, res) {
	if (isBrowser) {
		console.log('foo');
	} else {
		res.render('index');
	}
};
