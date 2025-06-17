#!/usr/bin/env node

'use strict';

const path = require('node:path');
const assert = require('node:assert');
const utils = require('../utils.js');

assert(require.main.filename === __filename);
assert(__dirname === process.cwd());

// test symlinks on unix only // TODO junction
if (process.platform === 'win32') return;

const target = process.argv[2] || 'host';
const input = './test-x-index.js';
const output = './test-output.exe';

utils.pkg.sync(['--target', target, '--output', output, input]);

const result = utils.spawn.sync('./' + path.basename(output), [], {
  cwd: path.dirname(output),
});

assert.strictEqual(result, '42\n');
utils.vacuum.sync(output);
