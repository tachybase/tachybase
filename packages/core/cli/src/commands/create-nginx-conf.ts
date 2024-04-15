import { resolve } from 'path';
import { Command } from 'commander';
import { readFileSync, writeFileSync } from 'fs';
import { URL } from 'url';

const __dirname = new URL('.', import.meta.url).pathname;

export default (cli: Command) => {
  cli.command('create-nginx-conf').action(async (name, options) => {
    const file = resolve(__dirname, '../../nocobase.conf.tpl');
    const data = readFileSync(file, 'utf-8');
    const replaced = data
      .replace(/\{\{cwd\}\}/g, '/app/nocobase')
      .replace(/\{\{publicPath\}\}/g, process.env.APP_PUBLIC_PATH!)
      .replace(/\{\{apiPort\}\}/g, process.env.APP_PORT!);

    const targetFile = resolve(process.cwd(), 'storage', 'nocobase.conf');
    writeFileSync(targetFile, replaced);
  });
};
