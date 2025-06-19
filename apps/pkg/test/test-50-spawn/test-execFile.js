#!/usr/bin/env node

'use strict';

var execFile = require('child_process').execFile;

var child = execFile(
  process.execPath,
  [require.resolve('./test-execFile-child.js'), 'argvx', '--argvy'],
  function (error) {
    if (error) return console.error(error);
    console.log('execFile done');
  },
);

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

child.on('exit', function (code) {
  setTimeout(function () {
    console.log('Child exited with code', code);
  }, 100);
});
