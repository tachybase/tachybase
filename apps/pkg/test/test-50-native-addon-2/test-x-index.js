/* eslint-disable no-underscore-dangle */

'use strict';

var fs = require('node:fs');
var path = require('node:path');
var Module = require('node:module');
Module._extensions['.node'] = Module._extensions['.js'];
console.log(
  fs.existsSync(path.join(__dirname, 'node_modules/dependency/time.node')),
);
console.log(require('dependency/time.node'));
