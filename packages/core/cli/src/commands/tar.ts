import { resolve } from 'path';
import { Command } from 'commander';
import { run, nodeCheck, isPackageValid } from '../util';

export default (cli: Command) => {
  cli
    .command('tar')
    .allowUnknownOption()
    .argument('[packages...]')
    .option('-v, --version', 'print version')
    .option('-c, --compile', 'compile the @tachybase/build package')
    .option('-w, --watch', 'watch compile the @tachybase/build package')
    .action(async (pkgs, options) => {
      nodeCheck();
      if (options.compile || options.watch || isPackageValid('@tachybase/build/src/index.ts')) {
        await run('pnpm', ['build', options.watch ? '--watch' : ''], {
          cwd: resolve(process.cwd(), 'packages/core/build'),
        });
        if (options.watch) return;
      }
      await run('tachybase-build', [...pkgs, '--only-tar', options.version ? '--version' : '']);
    });
};
