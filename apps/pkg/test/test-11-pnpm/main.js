#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const utils = require('../utils.js');

if (utils.shouldSkipPnpm()) {
  return;
}

console.log(__dirname, process.cwd());
assert(__dirname === process.cwd());

const isWindows = process.platform === 'win32';
const target = process.argv[2] || 'host';
const input = './test.js';
const output = './test-output.exe';

console.log('target = ', target);

// remove any possible left-over
utils.vacuum.sync('./node_modules');
utils.vacuum.sync('./pnpm-lock.yaml');

const npmlog = utils.exec.sync('npm install -g pnpm@8');
console.log('npm log :', npmlog);

// launch `pnpm install`
const pnpmlog = utils.spawn.sync(
  path.join(path.dirname(process.argv[0]), 'npx' + (isWindows ? '.cmd' : '')),
  ['pnpm', 'install'],
  { cwd: path.dirname(output), expect: 0, shell: isWindows },
);
console.log('pnpm log :', pnpmlog);

// verify that we have the .pnpm folder and a symlinks module in node_modules
assert(fs.lstatSync(path.join(__dirname, 'node_modules/.pnpm')).isDirectory());
assert(
  fs.lstatSync(path.join(__dirname, 'node_modules/bonjour')).isSymbolicLink(),
);

const logPkg = utils.pkg.sync([
  '--target',
  target,
  '--debug',
  '--output',
  output,
  input,
]);
assert(logPkg.match(/adding symlink/g));

// check that produced executable is running and produce the expected output.
const log = utils.spawn.sync(output, [], {
  cwd: path.dirname(output),
  expect: 0,
});
assert(log === '42\n');

// clean up
utils.vacuum.sync(output);
utils.vacuum.sync('./node_modules');
utils.vacuum.sync('./pnpm-lock.yaml');

console.log('OK');
