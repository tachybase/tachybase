#!/usr/bin/env node

'use strict';

var spawnSync = require('node:child_process').spawnSync;

var child = spawnSync(
  process.execPath,
  [require.resolve('./test-spawnSync-child.js'), 'argvx', '--argvy'],
  { stdio: 'inherit' },
);

console.log('Child exited with code', child.status);
