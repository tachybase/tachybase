#!/usr/bin/env node

'use strict';

var assert = require('node:assert');
var cp = require('node:child_process');
var child;

assert(!process.send);

try {
  child = cp.fork(require.resolve('./test-cpfork-a-child.js'), [
    'argx',
    '--argvy',
  ]);
} catch (e) {
  console.log(e.message);
}

child.on('message', function (value) {
  console.log(value.toString());
  child.send(value);
});

child.send(2);

child.on('exit', function (code) {
  console.log('Child exited with code', code);
});
