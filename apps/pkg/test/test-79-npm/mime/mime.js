'use strict';

var mime = require('mime');
if (mime.getType('html') === 'text/html') {
  console.log('ok');
}
