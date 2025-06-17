'use strict';

var promisify = require('node:util').promisify;
if (!promisify) return console.log('ok');

var fs = require('node:fs');
var execAsync = promisify(require('node:child_process').exec);
var existsAsync = promisify(fs.exists);
var readAsync = promisify(fs.read);

execAsync('whoami').then(function (output) {
  console.log(JSON.stringify(output));
  existsAsync('./main.js').then(function (existence) {
    console.log(existence);
    fs.open('./main.js', 'r', function (error, fd) {
      if (error) return;
      readAsync(fd, Buffer.alloc(10), 0, 10, 0).then(function (tuple) {
        console.log(JSON.stringify(tuple));
      });
    });
  });
});
