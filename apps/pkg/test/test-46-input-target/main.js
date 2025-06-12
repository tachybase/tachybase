#!/usr/bin/env node

'use strict';

const assert = require('assert');
const utils = require('../utils.js');

assert(!module.parent);
assert(__dirname === process.cwd());

const target = process.argv[2] || 'latest';
const input = './test-x-index';
const exe = {
  win32: '.exe',
  linux: '-linux',
  darwin: '-macos',
  freebsd: '-freebsd',
}[process.platform];
const newcomers = ['test-x-index' + exe];
const before = utils.filesBefore(newcomers);

utils.pkg.sync(['--target', target, input]);

utils.filesAfter(before, newcomers);
