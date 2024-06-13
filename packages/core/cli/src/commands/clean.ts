import { Command } from 'commander';

import { isDev, run } from '../util';

/**
 *
 * @param {Command} cli
 */
export default (cli: Command) => {
  cli
    .command('clean')
    .allowUnknownOption()
    .action(() => {
      if (!isDev()) {
        return;
      }
      run('rimraf', ['-rf', './storage/app-dev']);
      run('rimraf', ['-rf', 'packages/*/*/{lib,esm,es,dist,node_modules}']);
      run('rimraf', ['-rf', 'packages/*/@*/*/{lib,esm,es,dist,node_modules}']);
    });
};
