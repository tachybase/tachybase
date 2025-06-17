'use strict';

const path = require('node:path');
const util = require('node:util');
const fs = require('node:fs');
let fsp;

try {
  fsp = require('node:fs/promises');
} catch (_) {
  fsp = require('node:fs').promises;
}

const filePath = path.join(__dirname, 'files/test.txt');

async function test() {
  for (const key of ['stat', 'lstat']) {
    console.log(key, 'callback');
    const promisified = util.promisify(fs[key]);
    console.log(serialize(await promisified(filePath)));

    console.log(key, 'promise');
    console.log(serialize(await fsp[key](filePath)));
  }
}

function serialize(result) {
  if (!result) return null;
  return `${result.size} ${result.mode}`;
}

test();
