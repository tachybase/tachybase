import { Command } from 'commander';
import { run, postCheck, promptForTs } from '../util';
import { existsSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';
import _ from 'lodash';

export default (cli: Command) => {
  const { APP_PACKAGE_ROOT, NODE_ARGS } = process.env;
  cli
    .command('start')
    .option('-p, --port [port]')
    .option('-d, --daemon')
    .option('-i, --instances [number]')
    .option('--db-sync')
    .option('--quickstart')
    .allowUnknownOption()
    .action(async (opts) => {
      if (opts.port) {
        process.env.APP_PORT = opts.port;
      }
      if (process.argv.includes('-h') || process.argv.includes('--help')) {
        promptForTs();
        run('ts-node', [
          '-P',
          process.env.SERVER_TSCONFIG_PATH ?? '',
          '-r',
          'tsconfig-paths/register',
          `${APP_PACKAGE_ROOT}/src/index.ts`,
          ...process.argv.slice(2),
        ]);
        return;
      }
      if (!existsSync(resolve(process.cwd(), `${APP_PACKAGE_ROOT}/lib/index.js`))) {
        console.log('The code is not compiled, please execute it first');
        console.log(chalk.yellow('$ pnpm build'));
        console.log('If you want to run in development mode, please execute');
        console.log(chalk.yellow('$ pnpm dev'));
        return;
      }
      await postCheck(opts);
      if (opts.daemon) {
        run('pm2', ['start', `${APP_PACKAGE_ROOT}/lib/index.js`, '--', ...process.argv.slice(2)]);
      } else {
        run(
          'pm2-runtime',
          // @ts-ignore
          [
            'start',
            '-i',
            _.toNumber(opts.instances || 1),
            `${APP_PACKAGE_ROOT}/lib/index.js`,
            NODE_ARGS ? `--node-args="${NODE_ARGS}"` : undefined,
            '--',
            ...process.argv.slice(2),
          ].filter(Boolean),
        );
      }
    });
};
