#!/usr/bin/env node

'use strict';

var path = require('node:path');
var spawn = require('node:child_process').spawn;

if (process.send) {
  require('./test-spawn-a-child.js');
  return;
}

var child = spawn(
  process.argv[0],
  [path.join(process.cwd(), path.basename(__filename)), 'argvx', '--argvy'],
  { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] },
);

child.on('message', function (value) {
  console.log(value.toString());
  child.send(value);
});

child.send(2);

child.on('exit', function (code) {
  console.log('Child exited with code', code);
});
