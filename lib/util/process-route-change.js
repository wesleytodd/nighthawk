var supported = require('./supports-push-state');

module.exports = function processRouteChange (app, url, replace) {
	// Normalize the url object
	url.search = url.search || '';
	url.hash = url.hash || '';

	// Strip the base off before routing
	var path = url.pathname;
	if (app.mountpath && app.mountpath !== '/') {
		path = path.replace(app.mountpath, '');
	}

	// Build next url
	var nextLocation = (path === '' ? '/' : path) + url.search;

	// If processing to the same url, just return
	if (app.currentLocation === nextLocation) {
		return;
	}
	app.currentLocation = nextLocation;

	// Create the request
	var req = Object.create(app.request, {
		method: propertyDescriptor('GET'),
		originalUrl: propertyDescriptor(url.pathname + url.search + url.hash),
		baseUrl: propertyDescriptor(app.mountpath),
		path: propertyDescriptor(url.pathname),
		url: propertyDescriptor(app.currentLocation + url.hash)
	});

	// Create the response
	var res = Object.create(app.response);

	// Push the state
	if (supported) {
		window.history[replace ? 'replaceState' : 'pushState'](url, null, req.originalUrl);
	}

	app.handle(req, res, function (e) {
		if (e) {
			app.emit('error', e);
		}
	});
};

function propertyDescriptor (val) {
	return {
		writable: true,
		configurable: true,
		value: val
	};
}
