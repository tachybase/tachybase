#!/usr/bin/env node

import chalk from 'chalk';
import { initEnv, genTsConfigPaths } from './util';
import { Command } from 'commander';
import commands from './commands';
import semver from 'semver';

const cli = new Command();

cli.version((await import('../package.json')).version);

initEnv();
genTsConfigPaths();

await commands(cli);

if (semver.satisfies(process.version, '<20')) {
  console.error(chalk.red('[tachybase cli]: Node.js version must be >= 20'));
  process.exit(1);
}

cli.parse(process.argv);
