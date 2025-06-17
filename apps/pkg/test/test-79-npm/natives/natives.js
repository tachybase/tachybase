'use strict';

var natives = require('natives');
var fsCopy = natives.require('fs');
if (fsCopy !== require('node:fs')) {
  console.log('ok');
}
