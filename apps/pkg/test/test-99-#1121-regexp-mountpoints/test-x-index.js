'use strict';

var fs = require('node:fs');
var path = require('node:path');

var myDirectory = path.dirname(process.execPath);

process.pkg.mount(
  /^(.*)regexp_mountpoint_test(.*)$/,
  function (match, group1, group2) {
    return path.join(myDirectory, 'plugins-D-ext', group2);
  },
);

require('./regexp_mountpoint_test/test-y-require-D.js'.slice());

console.log(fs.readdirSync(__dirname).join('\n'));
