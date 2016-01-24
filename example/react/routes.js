var React = require('react');
var ReactDOMServer = require('react-dom/server');
var ReactDOM = require('react-dom');

module.exports = function routes (router) {
	// Isomorphic react render middleware
	router.use(function (options) {
		options = options || {};
		options.template = options.template || 'index';
		options.key = options.key || 'content';

		return function (req, res, next) {
			res.renderReactComponent = function renderReactComponent (Component, store) {
				if (typeof window === 'undefined') {
					var tmplData = {};
					tmplData[options.key] = ReactDOMServer.renderToString(React.createFactory(Component)(...store));
					res.render(options.template, tmplData);
				} else {
					options.element = options.element || window.document.getElementById(options.elementId);
					ReactDOM.render(React.createFactory(Component)(...store), options.element);
				}
			};
			next();
		};
	}({
		// options
		elementId: 'app'
	}));

	router.get('/', require('./handlers/index.jsx'));
	router.get('/foo', require('./handlers/foo.jsx'));
	router.get('/bar', require('./handlers/bar.jsx'));
};
