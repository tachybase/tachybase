import { Command } from 'commander';
import { run, isDev } from '../util';

export default (cli: Command) => {
  const { APP_PACKAGE_ROOT } = process.env;
  cli
    .command('umi')
    .allowUnknownOption()
    .action(() => {
      if (!isDev()) {
        return;
      }
      run('umi', process.argv.slice(3), {
        env: {
          APP_ROOT: `${APP_PACKAGE_ROOT}/client`,
        },
      });
    });
};
