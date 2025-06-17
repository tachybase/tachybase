#!/usr/bin/env node

'use strict';

const path = require('node:path');
const assert = require('node:assert');
const utils = require('../utils.js');
const standard = 'stdout';

assert(!module.parent);
assert(__dirname === process.cwd());

const target = process.argv[2] || 'host';
const output = './test-output.exe';

let left, right;
utils.mkdirp.sync(path.dirname(output));

left = utils.spawn.sync('node', ['test-x-index.js']);

const inspect =
  standard === 'stdout'
    ? ['inherit', 'pipe', 'inherit']
    : ['inherit', 'inherit', 'pipe'];

const log = utils.pkg.sync(
  ['--target', target, '--output', output, '.', '--debug'],
  inspect,
);

assert(
  log.indexOf('useless.c due to top level config ignore pattern') > 0,
  'useless.c file is not ignored',
);
assert(
  log.indexOf(
    'needed.c is added to queue',
    'needed.c file is not added to queue',
  ),
);

right = utils.spawn.sync('./' + path.basename(output), [], {
  cwd: path.dirname(output),
});

assert.strictEqual(left, right);
utils.vacuum.sync(output);
