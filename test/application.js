/* global describe, it, beforeEach */
var Application = require('../lib/application');
var assert = require('assert');
var app;

describe('Application', function () {
	beforeEach(function () {
		app = new Application();
	});

	it('should inherit from event emitter', function (done) {
		app.on('foo', done);
		app.emit('foo');
	});

	it('should be callable', function () {
		assert.equal(typeof app, 'function');
	});

	it('should inherit from settings', function () {
		app.set('foo', 'bar');
		assert(app.get('foo'), 'bar');
	});

	describe('.path()', function () {
		it('should return the canonical', function () {
			var blog = Application();
			var blogAdmin = Application();

			app.use('/blog', blog);
			blog.use('/admin', blogAdmin);

			assert.equal(app.path(), '');
			assert.equal(blog.path(), '/blog');
			assert.equal(blogAdmin.path(), '/blog/admin');
		});
	});

	describe('app.parent', function () {
		it('should return the parent when mounted', function () {
			var blog = Application();
			var blogAdmin = Application();

			app.use('/blog', blog);
			blog.use('/admin', blogAdmin);

			assert(!app.parent, 'app.parent');
			assert.equal(blog.parent, app);
			assert.equal(blogAdmin.parent, blog);
		});
	});

	describe('app.mountpath', function () {
		it('should return the mounted path', function () {
			var admin = Application();
			var blog = Application();
			var fallback = Application();

			app.use('/blog', blog);
			app.use(fallback);
			blog.use('/admin', admin);

			assert.equal(admin.mountpath, '/admin');
			assert.equal(app.mountpath, '/');
			assert.equal(blog.mountpath, '/blog');
			assert.equal(fallback.mountpath, '/');
		});
	});
});
