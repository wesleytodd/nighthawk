var isBrowser = require('is-browser');

module.exports = function (req, res) {
	if (isBrowser) {
		console.log('index');
	} else {
		res.render('index');
	}
};
