'use strict';

require('mocha');
var assert = require('assert');
var fsResolveFile = require('./');

describe('fs-resolve-file', function() {
  it('should export a function', function() {
    assert.equal(typeof fsResolveFile, 'function');
  });

  it('should export an object', function() {
    assert(fsResolveFile);
    assert.equal(typeof fsResolveFile, 'object');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      fsResolveFile();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected first argument to be a string');
      assert.equal(err.message, 'expected callback to be a function');
      cb();
    }
  });
});
