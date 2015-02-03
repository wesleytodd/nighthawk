module.exports = function(req, res) {
	console.log('index');
	history.pushState({
		path: req.url
	}, 'Index', req.url);
};
