var interceptClicks = require('intercept-link-clicks');
var processRouteChange = require('./process-route-change');

module.exports = function bindClick (app, el) {
	el = el || window;
	app.on('destroy', interceptClicks(el, function (e, el) {
		// Make sure the base is present if set
		if (app.mountpath && el.pathname.indexOf(app.mountpath) !== 0) {
			return;
		}

		// We are all good to parse the route,
		// so cancel the default navigation
		e.preventDefault();

		// Run the route matching
		processRouteChange(app, {
			pathname: el.pathname,
			search: el.search,
			hash: el.hash
		});
	}));
};
