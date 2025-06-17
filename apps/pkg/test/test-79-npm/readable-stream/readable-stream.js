'use strict';

var fs = require('node:fs');
var path = require('node:path');
var fst = fs.createReadStream(path.join(__dirname, 'readable-stream.js'));
var Readable = require('readable-stream');
var rst = new Readable();
rst.wrap(fst);

setTimeout(function () {
  var test = "'use strict';";
  var c = rst.read(test.length);
  if (c.toString() === test) {
    console.log('ok');
  }
}, 100);
