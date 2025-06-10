#!/usr/bin/env node

'use strict';

const path = require('path');
const assert = require('assert');
const utils = require('../utils.js');

assert(!module.parent);
assert(__dirname === process.cwd());

const target = process.argv[2] || 'host';
const input = './test-x-index.js';
const output = './test-output.exe';

let right;
utils.mkdirp.sync(path.dirname(output));

// calling twice
require('../../index.js')
  .exec(['--target', target, '--output', output, input])
  .then(function () {
    return require('../../index.js')
      .exec(['--target', target, '--output', output, input])
      .then(function () {
        right = utils.spawn.sync(output, [], {});

        assert.strictEqual(right, '42\n');
        utils.vacuum.sync(output);
      });
  })
  .catch(function (error) {
    console.error(error);
    process.exit(2);
  });
