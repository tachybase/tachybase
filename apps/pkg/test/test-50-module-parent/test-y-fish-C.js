'use strict';

var path = require('node:path');
var mpfn = module.parent.filename;
module.exports = mpfn.split(path.sep).slice(-2).join(path.sep);
