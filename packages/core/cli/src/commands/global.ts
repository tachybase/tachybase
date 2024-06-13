import { Command } from 'commander';

import { isDev, isProd, promptForTs, run } from '../util';

export default (cli: Command) => {
  const { APP_PACKAGE_ROOT, SERVER_TSCONFIG_PATH } = process.env;
  cli
    .allowUnknownOption()
    .option('-h, --help')
    .option('--ts-node-dev')
    .action((options) => {
      if (isDev()) {
        promptForTs();
        run('tsx', [
          '--tsconfig',
          SERVER_TSCONFIG_PATH ?? '',
          '-r',
          'tsconfig-paths/register',
          `${APP_PACKAGE_ROOT}/src/index.ts`,
          ...process.argv.slice(2),
        ]);
      } else if (isProd()) {
        run('node', [`${APP_PACKAGE_ROOT}/lib/index.js`, ...process.argv.slice(2)]);
      }
    });
};
