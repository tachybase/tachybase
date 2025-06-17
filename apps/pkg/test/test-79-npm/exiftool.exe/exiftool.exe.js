'use strict';

var fs = require('node:fs');
var exiftool = require('exiftool.exe');

if (fs.existsSync(exiftool)) {
  console.log('ok');
} else {
  console.log('Unable to open file:', exiftool);
}
