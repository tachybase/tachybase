'use strict';

var assert = require('node:assert');

if (__dirname.indexOf('snapshot') < 0) {
  console.log(__dirname);
  assert(false);
}

console.log('I am D');
