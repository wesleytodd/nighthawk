/* global describe, beforeEach, it */
var Router = require('../lib/router');
var assert = require('assert');

describe('Router', function () {
	var router, evt;
	beforeEach(function () {
		if (router) {
			window.history.pushState('/', null, '/');
			router.destroy();
		}
		router = new Router();

		evt = {
			which: 1,
			preventDefault: function () {}
		};
	});

	it('should set the base path', function () {
		var p = '/test';
		router.base(p);
		assert.equal(router.base(), p, 'Did not set and get base path');
	});

	it('should correctly set path with a base path', function (done) {
		router.base('/test');
		router.use(function (req, res) {
			assert.equal(req.path, '/foo', 'Failed to set req.path with a base path');
			done();
		});
		router.listen({dispatch: false});
		router.changeRoute('/test/foo');
	});

	it('should start register routes like the base router', function () {
		router.use(function () {});
		router.get('/', function () {});
	});

	it('BROWSER: should start listening to changes', function (done) {
		router.get('/', function (req, res) {
			assert.equal(req.path, '/', 'Did not match route path correctly');
			done();
		});

		assert.doesNotThrow(function () {
			router.listen();
		});
	});

	it('BROWSER: should process route on popstate', function (done) {
		router.get('/', function (req, res) {
			done();
		});

		assert.doesNotThrow(function () {
			router.listen();
			window.history.pushState(null, null, '/foo');
			window.history.back();
		});
	});

	it('should not intercept clicks when the link does not start with the base url', function () {
		router._processRequest = function () {
			throw new Error('Should not have been called!!');
		};
		router.base('/base');

		evt.target = document.createElement('a');
		evt.target.setAttribute('href', '/foo');

		router.onClick(evt, evt.target);
	});

	it('should intercept clicks', function (done) {
		router.get('/foo', function (req, res) {
			done();
		});

		evt.target = document.createElement('a');
		evt.target.setAttribute('href', '/foo');

		// A workaround for IE not adding the leading slash when
		// the anchor is not added to the dom
		if (typeof window !== 'undefined') {
			window.document.body.appendChild(evt.target);
		}

		assert.doesNotThrow(function () {
			router.onClick(evt, evt.target);
		});
	});

	it('should call process request with the right link parts', function () {
		router._processRequest = function (url) {
			assert.equal(url.pathname, '/foo', 'Incorrect pathname');
			assert.equal(url.search, '?bar=bar', 'Incorrect search');
			assert.equal(url.hash, '#baz', 'Incorrect hash');
		};

		evt.target = document.createElement('a');
		evt.target.setAttribute('href', '/foo?bar=bar#baz');

		// A workaround for IE not adding the leading slash when
		// the anchor is not added to the dom
		if (typeof window !== 'undefined') {
			window.document.body.appendChild(evt.target);
		}

		router.onClick(evt, evt.target);
	});

	it('should change the route', function () {
		router._processRequest = function (url) {
			assert.equal(url.pathname, '/foo', 'Incorrect pathname');
			assert.equal(url.search, '?bar=bar', 'Incorrect search');
			assert.equal(url.hash, '#baz', 'Incorrect hash');
		};

		router.changeRoute('/foo?bar=bar#baz');
	});

	it('should parse the query string', function (done) {
		router = new Router({
			parseQuerystring: true
		});

		router.use(function (req, res) {
			assert.equal(req.query.foo, 'bar');
			done();
		});
		router.changeRoute('/test?foo=bar');
	});
});
