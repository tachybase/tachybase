#!/usr/bin/env node

'use strict';

const path = require('path');
const assert = require('assert');
const utils = require('../utils.js');

assert(!module.parent);
assert(__dirname === process.cwd());

const host = 'node' + utils.getNodeMajorVersion();
const target = process.argv[2] || host;
const input = './test-x-index.js';
const output = './test-output.exe';

if (/^(node|v)?0/.test(target)) return;
if (/^(node|v)?4/.test(target)) return;
if (/^(node|v)?6/.test(target)) return;
if (/^(node|v)?8/.test(target)) return;

let right;

utils.pkg.sync(['--target', target, '--output', output, input]);

right = utils.spawn.sync('./' + path.basename(output), [], {
  cwd: path.dirname(output),
});

assert.strictEqual(right, '1\n2\n3\n4\n5\n');
utils.vacuum.sync(output);
