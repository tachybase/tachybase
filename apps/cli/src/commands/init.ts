import { Command } from 'commander';

export default (cli: Command) => {
  cli
    .command('init')
    .option('--plugins <list>', 'Comma-separated list of plugins to install', (value) => {
      return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    })
    .argument('[name]', 'project name', 'my-app')
    .allowUnknownOption()
    .action(async (name: string, options) => {
      console.error('using npx @tachybase/engine init <project-name> to init a project');
    });
};
