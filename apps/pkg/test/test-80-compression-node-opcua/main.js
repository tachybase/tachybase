#!/usr/bin/env node

'use strict';

/*
 * A test with a large number of modules with symlinks
 * (installed with npm) and compress
 *
 */

const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');
const utils = require('../utils.js');
const pkgJson = require('./package.json');

// FIXME: this test takes a long time to run (from 5min on linux up to 10 minuntes on windows)
// run only on linux to save time on CI
if (process.platform !== 'linux') {
  return;
}

const isWindows = process.platform === 'win32';
const buildDir = 'build';

assert(!module.parent);
assert(__dirname === process.cwd());

if (utils.shouldSkipPnpm()) {
  return;
}

function clean() {
  utils.vacuum.sync(buildDir);
  utils.vacuum.sync('node_modules');
  utils.vacuum.sync('./pnpm-lock.yaml');
}

// remove any possible left-over
clean();

const npmlog = utils.exec.sync('npm install -g pnpm@8');
console.log('npm log :', npmlog);

// launch `pnpm install`
const pnpmlog = utils.spawn.sync(
  path.join(path.dirname(process.argv[0]), 'npx' + (isWindows ? '.cmd' : '')),
  ['pnpm', 'install'],
  { cwd: path.dirname(__filename), expect: 0, shell: isWindows },
);
console.log('pnpm log :', pnpmlog);

// verify that we have the .pnpm folder and a symlinks module in node_modules
assert(fs.lstatSync(path.join(__dirname, 'node_modules/.pnpm')).isDirectory());
assert(
  fs
    .lstatSync(path.join(__dirname, 'node_modules/node-opcua-address-space'))
    .isSymbolicLink(),
);

/* eslint-disable no-unused-vars */
const input = 'package.json';
const target = process.argv[2] || 'host';
const ext = isWindows ? '.exe' : '';
const outputRef = path.join(buildDir, 'test-output-empty' + ext);
const outputNone = path.join(buildDir, 'test-output-None' + ext);
const outputGZip = path.join(buildDir, 'test-output-GZip' + ext);
const outputBrotli = path.join(buildDir, 'test-output-Brotli' + ext);
const outputBrotliDebug = path.join(buildDir, 'test-output-Brotli-debug' + ext);

const inspect = ['ignore', 'ignore', 'pipe'];

console.log(' compiling  empty ');
const logPkg0 = utils.pkg.sync(
  [
    '--target',
    target,
    '--compress',
    'None',
    '--output',
    outputRef,
    './test-empty.js',
  ],
  { stdio: inspect, expect: 0 },
);
const sizeReference = fs.statSync(outputRef).size;

function pkgCompress(compressMode, output) {
  console.log(` compiling compression ${compressMode} `);
  const logPkg1 = utils.pkg.sync(
    ['--target', target, '--compress', compressMode, '--output', output, input],
    { stdio: inspect, expect: 0 },
  );
  // check that produced executable is running and produce the expected output.
  const log = utils.spawn.sync(path.join(__dirname, output), [], {
    cwd: path.join(__dirname, buildDir),
    expect: 0,
  });
  assert(log === '42\n');
  return fs.statSync(output).size;
}

function esbuildBuild(entryPoint) {
  const log = utils.spawn.sync(
    path.join(path.dirname(process.argv[0]), 'npx' + (isWindows ? '.cmd' : '')),
    [
      'esbuild',
      entryPoint,
      '--bundle',
      '--outfile=' + path.join(buildDir, pkgJson.main),
      '--platform=node',
    ],
    { cwd: __dirname, expect: 0, shell: isWindows },
  );

  console.log(log);

  // copy folder 'node_modules/node-opcua-nodesets' to build folder
  utils.copyRecursiveSync(
    'node_modules/node-opcua-nodesets/nodesets',
    path.join(buildDir, 'nodesets'),
  );
}

esbuildBuild(pkgJson.main);

const sizeNoneFull = pkgCompress('None', outputNone);
const sizeGZipFull = pkgCompress('GZip', outputGZip);
const sizeBrotliFull = pkgCompress('Brotli', outputBrotli);

const sizeNone = sizeNoneFull - sizeReference;
const sizeBrotli = sizeBrotliFull - sizeReference;
const sizeGZip = sizeGZipFull - sizeReference;

console.log('empty           = ', sizeReference);
console.log('no compression  = ', sizeNoneFull, sizeNone);
console.log('Brotli          = ', sizeBrotliFull, sizeBrotli);
console.log('GZip            = ', sizeGZipFull, sizeGZip);

console.log(
  '        Δ GZip = ',
  sizeGZip - sizeNone,
  '(',
  (((sizeGZip - sizeNone) / sizeNone) * 100).toFixed(0),
  '%)',
);
console.log(
  '      Δ Brotli = ',
  sizeBrotli - sizeNone,
  '(',
  (((sizeBrotli - sizeNone) / sizeNone) * 100).toFixed(0),
  '%)',
);

assert(sizeNone > sizeGZip);
assert(sizeGZip > sizeBrotli);

const logPkg5 = utils.pkg.sync(
  ['--target', target, '--compress', 'Crap', '--output', outputBrotli, input],
  { expect: 2 },
);

assert(logPkg5.match(/Invalid compression algorithm/g));

clean();

console.log('OK');
