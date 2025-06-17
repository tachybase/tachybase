#!/usr/bin/env node

'use strict';

var assert = require('node:assert');
var cluster = require('node:cluster');

assert(!process.send);
assert(!cluster.worker);

console.log('Hello from spawn-d-child!');
console.log('Args', JSON.stringify(process.argv.slice(2)));
