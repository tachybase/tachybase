'use strict';

const fs = require('node:fs');
const { nodesets } = require('node-opcua-nodesets');
const a = fs.readFileSync(nodesets.adi);
console.log(a.length);
