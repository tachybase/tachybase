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

for (const pub of ['swordsman', 'crusader', '*']) {
  let right;

  utils.pkg.sync([
    '--public-packages=' + pub,
    '--target',
    target,
    '--output',
    output,
    input,
  ]);

  right = utils.spawn.sync('./' + path.basename(output), [], {
    cwd: path.dirname(output),
  });

  if (pub === 'swordsman') {
    assert.strictEqual(right, '');
  } else {
    assert.strictEqual(right, 'ok\n');
  }

  utils.vacuum.sync(output);
}
