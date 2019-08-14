/* global describe, it */
var Request = require('../lib/request')
var assert = require('assert')

describe('Request', function () {
  it('should have the correct protocol', function () {
    var r = new Request()
    assert.strictEqual(r.protocol, 'http')
    assert.strictEqual(r.secure, false)
  })
  it('should have the correct hostname', function () {
    var r = new Request()
    assert.strictEqual(r.hostname, window.location.hostname)
  })
})
