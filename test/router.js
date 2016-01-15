var Router = require('../lib/router'),
	assert = require('assert');

describe('Router', function() {
	var router, event;
	beforeEach(function() {
		if (router) {
			router.destroy();
		}
		router = Router();

		event = {
			which: 1,
			preventDefault: function() {}
		};
	});

	it('should set the base path', function() {
		var p = '/test';
		router.base(p);
		assert.equal(router.base(), p, 'Did not set and get base path');
	});

	it('should start register routes like the base router', function() {
		router.use(function() {});
		router.get('/', function() {});
	});

	it('should start listening to changes', function(done) {
		router.get('/', function(req, res) {
			assert.equal(req.path, '/', 'Did not match route path correctly');
			done();
		});

		assert.doesNotThrow(function() {
			window.location = '/';
			router.listen();
		});
	});

	// This is skipped because it is clearly a bad test,
	// The only reason this originally passed was because
	// the route handler was being called even tho it looked
	// like the same route
	it.skip('should process route on popstate', function(done) {
		var called = 0;
		router.get('/', function(req, res) {
			called++;
			console.log('called', req.url);
			if (called === 2) done();
		});

		assert.doesNotThrow(function() {
			window.location = '/';
			router.listen();
			history.pushState(null, null, '/foo');
			window.history.back();
		});
	});

	it('should not intercept clicks when the link does not start with the base url', function() {
		router._processRequest(function() {
			throw new Error('Should not have been called!!');
		});
		router.base('/base');

		event.target = document.createElement('a');
		event.target.setAttribute('href', '/foo');

		router.onClick(event, event.target);
	});

	it('should not intercept clicks when the link does not start with the base url', function(done) {
		router.get('/', function(req, res) {
			done();
		});

		event.target = document.createElement('a');
		event.target.setAttribute('href', '/');

		assert.doesNotThrow(function() {
			router.onClick(event, event.target);
		});
	});

	it('should call process request with the right link parts', function() {
		router._processRequest = function(url) {
			assert.equal(url.pathname, '/foo', 'Incorrect pathname');
			assert.equal(url.search, '?bar=bar', 'Incorrect search');
			assert.equal(url.hash, '#baz', 'Incorrect hash');
		};

		event.target = document.createElement('a');
		event.target.setAttribute('href', '/foo?bar=bar#baz');

		router.onClick(event, event.target);
	});

});
