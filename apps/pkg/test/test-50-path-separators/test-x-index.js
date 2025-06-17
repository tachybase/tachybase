'use strict';

var fs = require('node:fs');
var path = require('node:path');

console.log(
  fs.readdirSync(path.join(__dirname, 'sub')),
  fs.readdirSync(path.join(__dirname, 'sub/')),
  fs.readdirSync(path.join(__dirname, 'sub//')),
);
