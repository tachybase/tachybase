#!/usr/bin/env node

'use strict';

const assert = require('assert');
const utils = require('../utils.js');

// sea is not supported on Node.js < 20
if (utils.getNodeMajorVersion() < 20) {
  return;
}

assert(__dirname === process.cwd());

utils.exec.sync('npm install --no-package-lock --no-save', {
  stdio: 'inherit',
});

const input = './test-hybrid.js';

const newcomers = [
  'test-hybrid-linux',
  'test-hybrid-macos',
  'test-hybrid-win.exe',
];

const before = utils.filesBefore(newcomers);

utils.pkg.sync([input, '--options', 'experimental-require-module'], {
  stdio: 'inherit',
});

console.log('pkg end');

try {
  console.log('test-hybrid-linux');
  // try to spawn one file based on the platform
  if (process.platform === 'linux') {
    assert.equal(
      utils.spawn.sync('./test-hybrid-linux', []),
      '8005553535\n',
      'Output matches',
    );
  } else if (process.platform === 'darwin') {
    assert.equal(
      utils.spawn.sync('./test-hybrid-macos', []),
      '8005553535\n',
      'Output matches',
    );
  } else if (process.platform === 'win32') {
    assert.equal(
      utils.spawn.sync('./test-hybrid-win.exe', []),
      '8005553535\n',
      'Output matches',
    );
  }
} finally {
  utils.filesAfter(before, newcomers);
}
