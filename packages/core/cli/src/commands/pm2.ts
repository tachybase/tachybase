import { Command } from 'commander';

import { run } from '../util';

export default (cli: Command) => {
  cli
    .command('pm2')
    .allowUnknownOption()
    .action(() => {
      run('pm2', process.argv.slice(3));
    });
  cli
    .command('pm2-restart')
    .allowUnknownOption()
    .action(() => {
      run('pm2', ['restart', 'all']);
    });
  cli
    .command('pm2-stop')
    .allowUnknownOption()
    .action(() => {
      run('pm2', ['stop', 'all']);
    });
};
