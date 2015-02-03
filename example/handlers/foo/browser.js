module.exports = function(req, res) {
	console.log('foo', req.params.bar);
	history.pushState({
		path: req.url
	}, 'Foo', req.url);
};
