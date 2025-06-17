#!/usr/bin/env node

'use strict';

const path = require('node:path');
const assert = require('node:assert');
const utils = require('../utils.js');
const fetch = require('@yao-pkg/pkg-fetch');

assert(!module.parent);
assert(__dirname === process.cwd());

const host = 'node' + utils.getNodeMajorVersion();
const target = process.argv[2] || host;

let right;

fetch
  .need({
    nodeRange: target,
    platform: fetch.system.hostPlatform,
    arch: fetch.system.hostArch,
  })
  .then(function (needed) {
    if (process.platform === 'darwin') {
      utils.spawn.sync(
        'codesign',
        ['-fds', '-', './' + path.basename(needed)],
        { cwd: path.dirname(needed) },
      );
    }

    right = utils.spawn.sync(
      './' + path.basename(needed),
      ['--expose-gc', '-e', 'if (global.gc) console.log("ok");'],
      { cwd: path.dirname(needed), env: { PKG_EXECPATH: 'PKG_INVOKE_NODEJS' } },
    );

    assert.strictEqual(right, 'ok\n');
  })
  .catch(function (error) {
    console.error(`> ${error.message}`);
    process.exit(2);
  });
