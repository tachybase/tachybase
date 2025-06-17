'use strict';

var fs = require('node:fs');
var path = require('node:path');
var phantomjs = require('phantomjs-prebuilt');
var filename = phantomjs.path;
if (
  fs.existsSync(filename) &&
  path.isAbsolute(filename) &&
  filename.indexOf('snapshot') < 0
) {
  console.log('ok');
}
