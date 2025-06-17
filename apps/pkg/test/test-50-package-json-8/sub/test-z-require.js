'use strict';

var fs = require('node:fs');
var dataPath = '../test-z-data.css';
var data = fs.readFileSync(require.resolve(dataPath), 'utf8');
console.log(data);
