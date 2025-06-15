import { Command } from 'commander';
import yoctoSpinner from 'yocto-spinner';

import { downloadTar } from '../util';

const modules = [
  'acl',
  'app-info',
  'auth',
  'backup',
  'cloud-component',
  'collection',
  'cron',
  'data-source',
  'error-handler',
  'event-source',
  'file',
  'message',
  'pdf',
  'ui-schema',
  'user',
  'web',
  'worker-thread',
  'instrumentation',
  'workflow',
  'env-secrets',
];

const plugins = [
  'action-bulk-edit',
  'action-bulk-update',
  'action-custom-request',
  'action-duplicate',
  'action-export',
  'action-import',
  'action-print',
  'block-calendar',
  'block-charts',
  'block-gantt',
  'block-kanban',
  'block-presentation',
  'field-china-region',
  'field-formula',
  'field-sequence',
  'field-encryption',
  'log-viewer',
  'otp',
  'full-text-search',
  'password-policy',
  'auth-pages',
  'manual-notification',
];

export default (cli: Command) => {
  cli
    .command('init')
    .allowUnknownOption()
    .action(async () => {
      const prefix = 'plugins/node_modules';
      // 安装前端代码
      console.log('🚀 ~ start download ~ front end files');
      const spinner = yoctoSpinner({ text: `Loading @tachybase/app-web` }).start();
      // TODO
      await downloadTar('@tachybase/app-web', `${prefix}/@tachybase/app-web`);
      spinner.success();
      console.log();

      console.log('🚀 ~ start download ~ required modules');
      // 安装必须得模块
      const moduleNames = modules.map((moduleName) => `@tachybase/module-${moduleName}`);
      let index = 1;
      for (const moduleName of moduleNames) {
        const spinner = yoctoSpinner({ text: `[${index++}/${moduleNames.length}] Loading ${moduleName}` }).start();
        await downloadTar(moduleName, `${prefix}/${moduleName}`);
        spinner.success();
      }
      console.log();

      console.log('🚀 ~ start download ~ plugins');
      // 安装可选的模块，由参数指定
      index = 1;
      const pluginNames = plugins.map((pluginName) => `@tachybase/plugin-${pluginName}`);
      for (const pluginName of pluginNames) {
        const spinner = yoctoSpinner({ text: `[${index++}/${pluginNames.length}] Loading ${pluginName}` }).start();
        await downloadTar(pluginName, `${prefix}/${pluginName}`);
        spinner.success();
      }
      console.log();
    });
};
