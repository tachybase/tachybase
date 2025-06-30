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
      console.error('❌ This command has been deprecated.');
      console.log('✅ Please use: npx tego init <project-name>');
      process.exit(1);
    });
};
