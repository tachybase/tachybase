#!/usr/bin/env node
const { existsSync } = require('node:fs');
const { join } = require('node:path');
const chalk = require('chalk');

const libEntry = join(__dirname, '../lib/index.js');
const srcEntry = join(__dirname, '../src/index.ts');

if (__dirname.startsWith('/snapshot/')) {
  console.log(chalk.green('WAIT: ') + 'Engine is loading...');
}

if (existsSync(libEntry)) {
  require('../lib/index.js');
} else {
  console.log(chalk.green('WAIT: ') + 'TypeScript compiling...');
  const tsx = require('tsx/cjs/api');
  tsx.register();
  require('../src/index.js');
}
