import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

import { Command } from 'commander';

import { generatePlaywrightPath, isDev } from '../util';

export default (cli: Command) => {
  cli
    .command('postinstall')
    .allowUnknownOption()
    .action(async () => {
      generatePlaywrightPath(true);
      const utils = await import('@tachybase/utils');
      await utils.createStoragePluginsSymlink();
      if (!isDev()) {
        return;
      }
      await utils.createDevPluginsSymlink();
      const cwd = process.cwd();
      if (!existsSync(resolve(cwd, '.env')) && existsSync(resolve(cwd, '.env.example'))) {
        const content = await readFile(resolve(cwd, '.env.example'), 'utf-8');
        await writeFile(resolve(cwd, '.env'), content, 'utf-8');
      }
      if (!existsSync(resolve(cwd, '.env.test')) && existsSync(resolve(cwd, '.env.test.example'))) {
        const content = await readFile(resolve(cwd, '.env.test.example'), 'utf-8');
        await writeFile(resolve(cwd, '.env.test'), content, 'utf-8');
      }
    });
};
