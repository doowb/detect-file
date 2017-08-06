'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var detect = require('./');
var isLinux = process.platform === 'linux';

describe('detect', function() {
  it('should export a function', function() {
    assert.equal(typeof detect, 'function');
  });

  it('should be truthy a file exists', function() {
    assert(detect('README.md'));
    assert(detect('LICENSE'));
  });

  it('should not be case sensitive', function() {
    assert(detect('readme.md', {nocase: isLinux}));
    assert(detect('license', {nocase: isLinux}));
  });

  it('should return filepath when a file exists', function() {
    assert.equal(detect('README.md'), path.resolve('README.md'));
    assert.equal(detect('LICENSE'), path.resolve('LICENSE'));
  });

  it('should handle case sensitive names on linux', function() {
    assert.equal(detect('readme.md', {nocase: true}), path.resolve(isLinux ? 'README.md' : 'readme.md'));
    assert.equal(detect('license', {nocase: true}), path.resolve(isLinux ? 'LICENSE' : 'license'));

    if (isLinux) {
      assert(!detect('readme.md'), 'expected null when not using the sensitive flag on linux');
      assert(!detect('license'), 'expected null when not using the sensitive flag on linux');
    }
  });

  it('should handle case sensitive full filepaths on linux', function() {
    var fp = path.resolve('fixtures/a/B/aBc/DeF/mixedcasefile.txt');
    assert.equal(detect(fp, {nocase: true}), path.resolve(isLinux ? 'fixtures/a/B/aBc/DeF/MixedCaseFile.txt' : 'fixtures/a/B/aBc/DeF/mixedcasefile.txt'));

    if (isLinux) {
      assert(!detect(fp), 'expected null when not using the sensitive flag on linux');
    }
  });

  it('should return resolve filepath for directories', function() {
    assert(detect('.'));
    assert(detect('fixtures'));
    assert(detect(process.cwd()));
  });

  it('should return null when a file does not exist', function() {
    assert(!detect());
    assert(!detect(''));
    assert(!detect('foofofo'));
    assert(!detect('foofofo.txt'));
    assert(!detect(path.resolve('fixtures/a/b/c/missing-file.txt'), {nocase: true}));
  });

  it('should return null when a directory does not exist', function() {
    assert(!detect('lib/'));
    assert(!detect('whatever/'));
  });
});
