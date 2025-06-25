import { resolve } from 'node:path';

import { Command } from 'commander';

import { build } from '../build';
import { isPackageValid, nodeCheck, run } from '../util';

export default (cli: Command) => {
  cli
    .command('tar')
    .allowUnknownOption()
    .argument('[packages...]')
    .action(async (pkgs, options) => {
      nodeCheck();
      build(pkgs);
      await run('tachybase-build', [...pkgs, '--only-tar', options.version ? '--version' : '']);
    });
};
