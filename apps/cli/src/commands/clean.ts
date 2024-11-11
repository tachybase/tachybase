import { Command } from 'commander';

import { isDev, run } from '../util';

/**
 *
 * @param {Command} cli
 */
export default (cli: Command) => {
  cli
    .command('clean')
    .option('--all')
    .allowUnknownOption()
    .action((opts) => {
      if (!isDev()) {
        return;
      }
      run('rimraf', ['-rf', './storage/app-dev']);
      if (opts.all) {
        run('rimraf', ['-rf', '{node_modules,.umi,tsconfig.paths.json}']);
      }
      run('rimraf', ['-rf', 'apps/*/{lib,esm,es,dist,node_modules}']);
      run('rimraf', ['-rf', 'packages/*/{lib,esm,es,dist,node_modules}']);
    });
};
