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

	it('should process route on popstate', function(done) {
		var called = 0;
		router.get('/', function(req, res) {
			called++;
			if (called === 2) done();
		});

		assert.doesNotThrow(function() {
			window.location = '/';
			router.listen();
			history.pushState(null, null, '/foo');
			window.history.back();
		});
	});

	it('should not intercept clicks when keys certain modifier keys were pressed or default was prevented', function() {
		router._processRequest(function() {
			throw new Error('Should not have been called!!');
		});

		router.onClick({
			button: 2
		});
		router.onClick({
			metaKey: true
		});
		router.onClick({
			shiftKey: true
		});
		router.onClick({
			defaultPrevented: true
		});
	});

	it('should not intercept clicks when not on a link', function() {
		router._processRequest(function() {
			throw new Error('Should not have been called!!');
		});

		event.target = document.getElementsByTagName('body')[0];

		router.onClick(event);
	});

	it('should not intercept clicks when the element has download', function() {
		router._processRequest(function() {
			throw new Error('Should not have been called!!');
		});

		event.target = document.createElement('a');
		event.target.setAttribute('download');

		router.onClick(event);
	});

	it('should not intercept clicks when the element has rel', function() {
		router._processRequest(function() {
			throw new Error('Should not have been called!!');
		});

		event.target = document.createElement('a');
		event.target.setAttribute('rel', 'nofollow');

		router.onClick(event);
	});

	it('should not intercept clicks when the path is the same but the hash changed', function() {
		router._processRequest(function() {
			throw new Error('Should not have been called!!');
		});

		window.location = '/';

		event.target = document.createElement('a');
		event.target.setAttribute('href', '/#test');

		router.onClick(event);
	});

	it('should not intercept clicks when the path is a mailto link', function() {
		router._processRequest(function() {
			throw new Error('Should not have been called!!');
		});

		event.target = document.createElement('a');
		event.target.setAttribute('href', 'mailto:test@tester.com');

		router.onClick(event);
	});

	it('should not intercept clicks when the link is to a different origin', function() {
		router._processRequest(function() {
			throw new Error('Should not have been called!!');
		});

		event.target = document.createElement('a');

		event.target.setAttribute('href', 'http://tester.com');
		router.onClick(event);

		event.target.setAttribute('href', '//tester.com');
		router.onClick(event);
	});

	it('should not intercept clicks when the link does not start with the base url', function() {
		router._processRequest(function() {
			throw new Error('Should not have been called!!');
		});
		router.base('/base');

		event.target = document.createElement('a');
		event.target.setAttribute('href', '/foo');

		router.onClick(event);
	});

	it('should not intercept clicks when the link does not start with the base url', function(done) {
		router.get('/', function(req, res) {
			done();
		});

		event.target = document.createElement('a');
		event.target.setAttribute('href', '/');

		assert.doesNotThrow(function() {
			router.onClick(event);
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

		router.onClick(event);
	});

});
