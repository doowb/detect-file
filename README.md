# detect-file [![NPM version](https://img.shields.io/npm/v/detect-file.svg?style=flat)](https://www.npmjs.com/package/detect-file) [![NPM monthly downloads](https://img.shields.io/npm/dm/detect-file.svg?style=flat)](https://npmjs.org/package/detect-file)  [![NPM total downloads](https://img.shields.io/npm/dt/detect-file.svg?style=flat)](https://npmjs.org/package/detect-file) [![Linux Build Status](https://img.shields.io/travis/doowb/detect-file.svg?style=flat&label=Travis)](https://travis-ci.org/doowb/detect-file)

> Detects if a file exists and returns the resolved filepath.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save detect-file
```

Install with [yarn](https://yarnpkg.com):

```sh
$ yarn add detect-file
```

## Usage

```js
var detect = require('detect-file');
```

## API

### [detect](index.js#L33)

Detect the given `filepath` if it exists.

**Params**

* `filepath` **{String}**: filepath to detect.
* `options` **{Object}**: Additional options.
* `options.nocase` **{Boolean}**: Set this to `true` to force case-insensitive filename checks. This is useful on case sensitive file systems.
* `returns` **{String}**: Returns the detected filepath if it exists, otherwise returns `null`.

**Example**

```js
var res = detect('package.json');
console.log(res);
//=> "package.json"

var res = detect('fake-file.json');
console.log(res)
//=> null
```

## Case sensitive file systems

When using the `nocase` option, this library will attempt to detect the filepath with the following methods:

1. Try to read all files in the `filepath` using `fs.readdirSync`. If successful and `filepath` is a directory, return the `filepath`.
2. Try to read all files in the `filepath`'s directory using `fs.readdirSync`. If successful, do case insensitive comparasions of the `filepath` to the files in `filepath`'s directory.
3. Try to build the case-sensitive filepath starting at the root comparing filenames to directory segments.

Needing to fallback to step 3 is faster than trying to use `fs.existsSync` on all possible `filepath` case permutations, but there may be a performance impact if the given `filepath` isn't found with steps 1 or 2 above.

The best approach is to try to make the directory segments in the `filepath` match the actual case on the file system as closely as possible. This should reduce the need for step 3.

## About

### Related projects

[fs-exists-sync](https://www.npmjs.com/package/fs-exists-sync): Drop-in replacement for `fs.existsSync` with zero dependencies. Other libs I found either have crucial differences… [more](https://github.com/jonschlinkert/fs-exists-sync) | [homepage](https://github.com/jonschlinkert/fs-exists-sync "Drop-in replacement for `fs.existsSync` with zero dependencies. Other libs I found either have crucial differences from fs.existsSync, or unnecessary dependencies. See README.md for more info.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Building docs

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

### Running tests

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

### Author

**Brian Woodward**

* [github/doowb](https://github.com/doowb)
* [twitter/doowb](https://twitter.com/doowb)

### License

Copyright © 2017, [Brian Woodward](https://github.com/doowb).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on August 05, 2017._