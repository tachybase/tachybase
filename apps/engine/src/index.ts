import './preload';

import { performance } from 'node:perf_hooks';
import { Gateway } from '@tachybase/server';

import { Command } from 'commander';

import { getConfig } from './config';
import { parseEnvironment, prepare } from './utils';

// 解析环境变量
parseEnvironment();

const program = new Command();
program.name('tachybase-engine').version(require('../package.json').version);

const run = async () => {
  console.log(`Engine loaded at ${performance.now().toFixed(2)} ms`);
  await Gateway.getInstance().run({
    mainAppOptions: (await getConfig()) as any,
  });
};

// default action
program.allowUnknownOption().action(async () => {
  await run();
});

program
  .command('prepare')
  .description('prepare plugins')
  .option('--plugins <list>', 'Comma-separated list of plugins to install', (value) => {
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  })
  .argument('[name]', 'project name or path', 'my-app')
  .action(async (name, options) => {
    await prepare(name, options.plugins);
  });

program.parse();
