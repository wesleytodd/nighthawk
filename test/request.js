/* global describe, it */
var Request = require('../lib/request');
var assert = require('assert');

describe('Request', function () {
	it('should have the correct protocol', function () {
		var r = new Request();
		assert.equal(r.protocol, 'http');
	});
});
