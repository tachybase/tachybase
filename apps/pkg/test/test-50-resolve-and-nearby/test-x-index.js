'use strict';

var fs = require('node:fs');
var path = require('node:path');

console.log(
  [
    require('test-y-fish'), // both should have same names
    fs.readFileSync(path.join(__dirname, 'test-y-fish')),
  ].join('\n'),
);
