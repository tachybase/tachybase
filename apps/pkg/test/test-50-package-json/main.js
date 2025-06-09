#!/usr/bin/env node

'use strict';

const path = require('path');
const assert = require('assert');
const utils = require('../utils.js');

assert(!module.parent);
assert(__dirname === process.cwd());

const target = process.argv[2] || 'host';
const input = './test-x-index.js';
const output = './run-time/test-output.exe';

let left, right;
utils.mkdirp.sync(path.dirname(output));

left = utils.spawn.sync('node', [path.basename(input)], {
  cwd: path.dirname(input),
});

utils.pkg.sync(['--target', target, '--output', output, '.']);

right = utils.spawn.sync('./' + path.basename(output), [], {
  cwd: path.dirname(output),
});

assert.strictEqual(left, right);
utils.vacuum.sync(path.dirname(output));
