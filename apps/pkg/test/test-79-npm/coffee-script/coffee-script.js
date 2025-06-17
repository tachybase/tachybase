'use strict';

var path = require('node:path');
process.argv.push(path.join(__dirname, 'coffee-script-example.coffee'));
require('coffee-script/bin/coffee');
