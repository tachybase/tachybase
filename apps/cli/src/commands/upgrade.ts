import { existsSync, rmSync } from 'fs';
import { resolve } from 'path';

import { Command } from 'commander';

import { hasCorePackages, hasTsNode, promptForTs, run, runAppCommand } from '../util';

export default (cli: Command) => {
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
      const appClientDir = resolve(process.cwd(), './storage/.app-client-dev');
      const appServerDir = resolve(process.cwd(), './storage/.app-dev');
      if (existsSync(appServerDir)) {
        rmSync(appClientDir, { recursive: true, force: true });
        rmSync(appServerDir, { recursive: true, force: true });
      }
      await run('pnpm', ['add', '@tachybase/cli', '@tachybase/devtools', '-w']);
      await run('pnpm', ['install']);
      await runAppCommand('upgrade');
    });
};
