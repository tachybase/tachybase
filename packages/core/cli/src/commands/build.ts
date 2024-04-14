import { resolve } from 'path';
import { type Command } from 'commander';
import { run, nodeCheck, isPackageValid, buildIndexHtml } from '../util';

/**
 *
 * @param {Command} cli
 */
export default (cli: Command) => {
  cli
    .command('build')
    .allowUnknownOption()
    .argument('[packages...]')
    .option('-v, --version', 'print version')
    .option('-c, --compile', 'compile the @nocobase/build package')
    .option('-r, --retry', 'retry the last failed package')
    .option('-w, --watch', 'watch compile the @nocobase/build package')
    .option('-s, --sourcemap', 'generate sourcemap')
    .option('--no-dts', 'not generate dts')
    .action(async (pkgs, options) => {
      nodeCheck();
      if (options.compile || options.watch || isPackageValid('@nocobase/build/src/index.ts')) {
        await run('pnpm', ['build', options.watch ? '--watch' : ''], {
          cwd: resolve(process.cwd(), 'packages/core/build'),
        });
        if (options.watch) return;
      }
      process.env['VITE_CJS_IGNORE_WARNING'] = 'true';

      await run('nocobase-build', [
        ...pkgs,
        options.version ? '--version' : '',
        !options.dts ? '--no-dts' : '',
        options.sourcemap ? '--sourcemap' : '',
        options.retry ? '--retry' : '',
      ]);
      buildIndexHtml(true);
    });
};