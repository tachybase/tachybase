'use strict';

const assert = require('node:assert');
const path = require('node:path');
const rimraf = require('rimraf');
const { globSync } = require('tinyglobby');
const { execSync, spawnSync } = require('node:child_process');
const {
  existsSync,
  statSync,
  copyFileSync,
  mkdirSync,
  readdirSync,
} = require('node:fs');
const stableStringify = require('json-stable-stringify');

/** Create a directory and if it doesn't exists */
module.exports.mkdirp = {
  sync(p) {
    return mkdirSync(p, { recursive: true });
  },
};

/** Pause execution for a number of seconds */
module.exports.pause = function (seconds) {
  spawnSync('ping', [
    '127.0.0.1',
    process.platform === 'win32' ? '-n' : '-c',
    (seconds + 1).toString(),
  ]);
};

/** Copy a file or directory recursively */
module.exports.copyRecursiveSync = function (origin, dest) {
  const stats = statSync(origin);
  if (stats.isDirectory()) {
    mkdirSync(dest, { recursive: true });
    const files = readdirSync(origin);
    for (const file of files) {
      module.exports.copyRecursiveSync(
        path.join(origin, file),
        path.join(dest, file),
      );
    }
  } else {
    copyFileSync(origin, dest);
  }
};

module.exports.vacuum = function () {
  throw new Error('Async vacuum not implemented');
};

/** Remove a file or directory recursively */
module.exports.vacuum.sync = function (p) {
  const limit = 5;
  let hasError;
  for (let i = 0; i < limit; i += 1) {
    hasError = null;
    try {
      rimraf.sync(p);
    } catch (error) {
      hasError = error;
    }
    if (!hasError) break;
    if (i < limit - 1) {
      module.exports.pause(5);
    }
  }
  if (hasError) {
    throw hasError;
  }
};

module.exports.exec = function () {
  throw new Error('Async exec not implemented');
};

/** Execute a command */
module.exports.exec.sync = function (command, opts) {
  const child = execSync(command, opts);
  return (child || '').toString();
};

module.exports.spawn = function () {
  throw new Error('Async spawn not implemented');
};

/**
 * Spawn a command with some utility options
 * @param {string} command
 * @param {string[]} args
 * @param {import('child_process').SpawnSyncOptionsWithBufferEncoding & { expect?: number }} opts
 */
module.exports.spawn.sync = function (command, args, opts) {
  if (!opts) opts = {};
  opts = Object.assign({}, opts); // change own copy

  const d = opts.stdio;
  if (!d) {
    opts.stdio = ['pipe', 'pipe', 'inherit'];
  } else if (typeof d === 'string') {
    opts.stdio = [d, d, d];
  }

  let expect = opts.expect === undefined ? 0 : opts.expect;
  delete opts.expect; // to avoid passing to spawnSync
  const opts2 = Object.assign({}, opts); // 0.12.x mutates
  const child = spawnSync(command, args, opts2);
  let s = child.status;
  // conform old node vers to https://github.com/nodejs/node/pull/11288
  if (child.signal) s = null;

  if (child.error || s !== expect) {
    if (opts.stdio[1] === 'pipe' && child.stdout) {
      process.stdout.write(child.stdout);
    } else if (opts.stdio[2] === 'pipe' && child.stderr) {
      process.stdout.write(child.stderr);
    }
    console.log('> ' + command + ' ' + args.join(' '));
  }

  if (child.error) {
    throw child.error;
  }
  if (s !== expect) {
    if (s === null) s = 'null';
    if (expect === null) expect = 'null';
    throw new Error(
      'Status ' + s.toString() + ', expected ' + expect.toString(),
    );
  }

  if (opts.stdio[1] === 'pipe' && opts.stdio[2] === 'pipe') {
    return {
      stdout: child.stdout.toString(),
      stderr: child.stderr.toString(),
    };
  } else if (opts.stdio[1] === 'pipe') {
    return child.stdout.toString();
  } else if (opts.stdio[2] === 'pipe') {
    return child.stderr.toString();
  } else {
    return '';
  }
};

module.exports.pkg = function () {
  throw new Error('Async pkg not implemented');
};

const es5path = path.resolve(__dirname, '../lib-es5/bin.js');
const tsPath = path.resolve(__dirname, '../lib/bin.ts');

/**
 *
 * @param {string[]} args
 * @param {(import('child_process').SpawnSyncOptionsWithBufferEncoding & { expect?: number }) | string[]} opts
 * @returns
 */
module.exports.pkg.sync = function (args, opts) {
  args = args.slice();

  if (process.env.DEV === 'true') {
    args.unshift(tsPath);
    args.unshift('-r', 'esbuild-register');
  } else {
    const es5 = existsSync(es5path);
    args.unshift(es5path);
    assert(es5, 'Run `yarn build` first!');
  }

  if (Array.isArray(opts)) opts = { stdio: opts };

  // spawn uses process.env if no opts.env is provided, we need to manually add it if set
  if (!opts) {
    opts = { env: { NO_COLOR: '1', ...process.env } };
  } else if (!opts.env || !opts.env.NO_COLOR) {
    opts.env = { NO_COLOR: '1', ...process.env, ...opts.env };
  }

  try {
    return module.exports.spawn.sync('node', args, opts);
  } catch (error) {
    console.log(`> ${error.message}`);
    process.exit(2);
  }
};

/** Deterministic version of JSON.stringify() so you can get a consistent hash from stringified results. */
module.exports.stringify = function (obj, replacer, space) {
  return stableStringify(obj, { replacer, space });
};

/**
 * Return the list of files to expect after removing the files in `n`
 * @param {string[]} n files to remove
 * @returns
 */
module.exports.filesBefore = function (n) {
  for (const ni of n) {
    module.exports.vacuum.sync(ni);
  }
  return globSync('**/*').sort();
};

/**
 * This is used in pair with `filesBefore` to check the files in a directory
 * after the test are the same as before the test.
 * @param {string[]} before Files that should exist
 * @param {string[]} newComers New files produced by test that should be removed
 */
module.exports.filesAfter = function (before, newComers) {
  // actual files in the directory
  const a = globSync('**/*').sort();

  // check that all files in `b` exist, otherwise fail
  for (const bi of before) {
    if (a.indexOf(bi) < 0) {
      assert(false, `${bi} disappeared!?`);
    }
  }

  // files that should not exist
  const actualNew = [];

  // get all files that are in `a` but not in `b`
  for (const ai of a) {
    if (before.indexOf(ai) < 0) {
      actualNew.push(ai);
    }
  }

  // ensure that the files that should not exist are the same as the files in `n`
  assert(
    actualNew.length === newComers.length,
    JSON.stringify([actualNew, newComers]),
  );
  for (const ni of newComers) {
    assert(actualNew.indexOf(ni) >= 0, JSON.stringify([actualNew, newComers]));
  }

  // remove the files that should not exist
  for (const ni of newComers) {
    module.exports.vacuum.sync(ni);
  }
};

module.exports.getNodeMajorVersion = function () {
  return parseInt(process.version.match(/v([0-9]+)/)[1], 10);
};

module.exports.getNodeMinorVersion = function () {
  return parseInt(process.version.match(/v[0-9]+\.([0-9]+)/)[1], 10);
};

/**
 * Check if the test should be skipped because it requires a newer Node.js version
 * @returns {boolean}
 */
module.exports.shouldSkipPnpm = function () {
  // pnpm 8 requires at least Node.js v16.14
  const REQUIRED_MAJOR_VERSION = 16;
  const REQUIRED_MINOR_VERSION = 14;

  const MAJOR_VERSION = module.exports.getNodeMajorVersion();
  const MINOR_VERSION = module.exports.getNodeMinorVersion();

  const isDisallowedMajor = MAJOR_VERSION < REQUIRED_MAJOR_VERSION;
  const isDisallowedMinor =
    MAJOR_VERSION === REQUIRED_MAJOR_VERSION &&
    MINOR_VERSION < REQUIRED_MINOR_VERSION;
  if (isDisallowedMajor || isDisallowedMinor) {
    const need = `${REQUIRED_MAJOR_VERSION}.${REQUIRED_MINOR_VERSION}`;
    const got = `${MAJOR_VERSION}.${MINOR_VERSION}`;
    console.log(`skiping test as it requires nodejs >= ${need} and got ${got}`);
    return true;
  }

  return false;
};
