var processRouteChange = require('./process-route-change');
var _apps = [];
var _popStateBound = false;

module.exports = function bindPopstate (app) {
	if (!_popStateBound) {
		_popStateBound = true;
		window.addEventListener('popstate', onPopstate, false);
		app.on('destroy', function () {
			_apps.splice(_apps.indexOf(app), 1);

			if (_apps.length === 0) {
				_popStateBound = false;
				window.removeEventListener('popstate', onPopstate, false);
			}
		});
	}
	_apps.push(app);
};

function onPopstate (e) {
	_apps.forEach(function (app) {
		processRouteChange(app, e.state || {
			pathname: window.location.pathname,
			search: window.location.search,
			hash: window.location.hash
		}, true);
	});
}
