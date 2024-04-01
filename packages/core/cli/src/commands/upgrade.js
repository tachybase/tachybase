const chalk = require('chalk');
const { Command } = require('commander');
const { resolve } = require('path');
const { run, promptForTs, runAppCommand, hasCorePackages, updateJsonFile, hasTsNode } = require('../util');
const { existsSync, rmSync } = require('fs');

/**
 *
 * @param {Command} cli
 */
module.exports = (cli) => {
  const { APP_PACKAGE_ROOT } = process.env;
  cli
    .command('upgrade')
    .allowUnknownOption()
    .option('--raw')
    .option('-S|--skip-code-update')
    .action(async (options) => {
      if (hasTsNode()) promptForTs();
      if (hasCorePackages()) {
        // await run('pnpm', ['install']);
        await runAppCommand('upgrade');
        return;
      }
      if (options.skipCodeUpdate) {
        await runAppCommand('upgrade');
        return;
      }
      // await runAppCommand('upgrade');
      if (!hasTsNode()) {
        await runAppCommand('upgrade');
        return;
      }
      // If ts-node is not installed, do not do the following
      const appDevDir = resolve(process.cwd(), './storage/.app-dev');
      if (existsSync(appDevDir)) {
        rmSync(appDevDir, { recursive: true, force: true });
      }
      await run('pnpm', ['add', '@nocobase/cli', '@nocobase/devtools', '-W']);
      await run('pnpm', ['install']);
      await runAppCommand('upgrade');
    });
};
