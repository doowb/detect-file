/*!
 * detect-file (https://github.com/doowb/detect-file)
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var exists = require('fs-exists-sync');

/**
 * Resolve the given `filepath` if it exists.
 *
 * ```js
 * var res = detect('package.json');
 * console.log(res);
 * //=> "package.json"
 *
 * var res = detect('fake-file.json');
 * console.log(res)
 * //=> null
 * ```
 *
 * @param  {String} `filepath` filepath to detect.
 * @param  {Object} `options` Additional options.
 * @param  {Boolean} `options.nocase` Set this to `true` force case-insensitive filename checks. This is useful on case sensitive file systems.
 * @return {String} Returns the resolved filepath if it exists, otherwise returns `null`.
 * @api public
 */

module.exports = function detect(filepath, options) {
  if (!filepath || (typeof filepath !== 'string')) {
    return null;
  }
  if (exists(filepath)) {
    return path.resolve(filepath);
  }

  options = options || {};
  if (options.nocase === true) {
    return nocase(filepath);
  }
  return null;
};

/**
 * Check if the filepath exists by falling back to reading in the entire directory.
 * Returns the real filepath (for case sensitive file systems) if found.
 *
 * @param  {String} `filepath` filepath to check.
 * @return {String} Returns found filepath if exists, otherwise null.
 */

function nocase(filepath) {
  filepath = path.resolve(filepath);
  var res = tryReaddir(filepath);
  if (res === null) {
    return null;
  }

  // "filepath" is a directory, an error would be
  // thrown if it doesn't exist. if we're here, it exists
  if (res.path === filepath) {
    return res.path;
  }

  // "filepath" is not a directory
  // compare against upper case later
  // see https://nodejs.org/en/docs/guides/working-with-different-filesystems/
  var upper = filepath.toUpperCase();
  var len = res.files.length;
  var idx = -1;

  while (++idx < len) {
    var fp = path.resolve(res.path, res.files[idx]);
    if (filepath === fp || upper === fp) {
      return fp;
    }
    var fpUpper = fp.toUpperCase();
    if (filepath === fpUpper || upper === fpUpper) {
      return fp;
    }
  }

  return null;
}

/**
 * Try to read the filepath as a directory first, then fallback to the filepath's dirname.
 *
 * @param  {String} `filepath` path of the directory to read.
 * @return {Object} Object containing `path` and `files` if succesful. Otherwise, null.
 */

function tryReaddir(filepath) {
  var ctx = { path: filepath, files: [] };
  try {
    ctx.files = fs.readdirSync(filepath);
    return ctx;
  } catch (err) {}
  try {
    ctx.path = path.dirname(filepath);
    ctx.files = fs.readdirSync(ctx.path);
    return ctx;
  } catch (err) {}
  return fuzzyMatch(filepath);
}

/**
 * Given a filepath, try to find the actual case of the directory segments
 * by matching from the root to the file.
 *
 * ```js
 * // when real path is '/Users/doowb/Mixed/cAsEd/path/SEGMENTS/FooFile.js'
 * console.log(fuzzyMatch('/users/doowb/mixed/cased/path/segments/foofile.js'));
 * //=> {
 * //=>   path: '/Users/doowb/Mixed/cAsEd/path/SEGMENTS'
 * //=>   files: ['FooFile.js']
 * //=> }
 * ```
 *
 * @param  {String} `filepath` filepath to search for
 * @return {Object} Object containing `path` and `files` if succesful. Otherwise, null.
 */

function fuzzyMatch(filepath) {
  // split regex from https://github.com/substack/node-resolve/blob/35b2b642d91e9b81e7cc26b6fd19912e18901d55/lib/node-modules-paths.js#L20
  var re = (process.platform === 'win32' ? /[\/\\]/ : /\/+/);
  var segs = filepath.split(re);

  var ctx = { path: filepath, files: [] };
  var dirs = ['/'];

  for(var i = 1; i < segs.length; i++) {
    var seg = segs[i];
    ctx.path = path.join.apply(path.join, dirs);
    try {
      ctx.files = fs.readdirSync(ctx.path);
      for (var j = 0; j < ctx.files.length; j++) {
        var filename = ctx.files[j];
        if (isMatch(filename, seg)) {
          dirs.push(filename);
          continue;
        }
      }
    } catch (err) {
      return null;
    }
  }
  return ctx;
}

/**
 * Check if 2 strings are equal trying different cases.
 *
 * @param  {String} `a` String to match
 * @param  {String} `b` String to match
 * @return {Boolean} true if a match
 */

function isMatch(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  if (a === b) {
    return true;
  }
  var upperA = a.toUpperCase();
  if (upperA === b) {
    return true;
  }
  var upperB = b.toUpperCase();
  return a === upperB || upperA === upperB;
}
