import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { createDevPluginsSymlink, createStoragePluginsSymlink } from '@tachybase/utils/plugin-symlink';

import { Command } from 'commander';

import { generatePlaywrightPath, isDev, isPackageValid, run } from '../util';

export default (cli: Command) => {
  const { APP_PACKAGE_ROOT } = process.env;
  cli
    .command('postinstall')
    .allowUnknownOption()
    .option('--skip-umi')
    .action(async (options) => {
      generatePlaywrightPath(true);
      await createStoragePluginsSymlink();
      if (!isDev()) {
        return;
      }
      await createDevPluginsSymlink();
      const cwd = process.cwd();
      if (!existsSync(resolve(cwd, '.env')) && existsSync(resolve(cwd, '.env.example'))) {
        const content = await readFile(resolve(cwd, '.env.example'), 'utf-8');
        await writeFile(resolve(cwd, '.env'), content, 'utf-8');
      }
      if (!existsSync(resolve(cwd, '.env.test')) && existsSync(resolve(cwd, '.env.test.example'))) {
        const content = await readFile(resolve(cwd, '.env.test.example'), 'utf-8');
        await writeFile(resolve(cwd, '.env.test'), content, 'utf-8');
      }
      if (!isPackageValid('umi')) {
        return;
      }
      if (!options.skipUmi) {
        run('umi', ['generate', 'tmp'], {
          stdio: 'pipe',
          env: {
            APP_ROOT: `${APP_PACKAGE_ROOT}/client`,
          },
        });
      }
    });
};
