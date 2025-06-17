import fs from 'node:fs';
import path from 'node:path';

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
  'hera', // FIXME: refactor later
  'multi-app',
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

function initEnv(name: string) {
  const envPath = path.resolve(process.cwd(), name, '.env');

  if (!fs.existsSync(envPath)) {
    const content = `
################# TACHYBASE APPLICATION #################
APP_ENV=development
APP_PORT=3000
APP_KEY=test-key

# experimental support
EXTENSION_UI_BASE_PATH=/adapters/

API_BASE_PATH=/api/
API_BASE_URL=

# console | file | dailyRotateFile
LOGGER_TRANSPORT=
LOGGER_BASE_PATH=storage/logs
# error | warn | info | debug
LOGGER_LEVEL=
# If LOGGER_TRANSPORT is dailyRotateFile and using days, add 'd' as the suffix.
LOGGER_MAX_FILES=
# add 'k', 'm', 'g' as the suffix.
LOGGER_MAX_SIZE=
# json | splitter, split by '|' character
LOGGER_FORMAT=

################# DATABASE #################

DB_DIALECT=sqlite
DB_STORAGE=storage/db/tachybase.sqlite
DB_TABLE_PREFIX=
# DB_HOST=localhost
# DB_PORT=5432
# DB_DATABASE=postgres
# DB_USER=tachybase
# DB_PASSWORD=tachybase
# DB_LOGGING=on
# DB_UNDERSCORED=false

#== SSL CONFIG ==#
# DB_DIALECT_OPTIONS_SSL_CA=
# DB_DIALECT_OPTIONS_SSL_KEY=
# DB_DIALECT_OPTIONS_SSL_CERT=
# DB_DIALECT_OPTIONS_SSL_REJECT_UNAUTHORIZED=true

################# CACHE #################
CACHE_DEFAULT_STORE=memory
# max number of items in memory cache
CACHE_MEMORY_MAX=2000
# CACHE_REDIS_URL=

################# STORAGE (Initialization only) #################

INIT_APP_LANG=zh-CN
INIT_ROOT_EMAIL=admin@tachybase.com
INIT_ROOT_PASSWORD=!Admin123.
INIT_ROOT_NICKNAME=Super Admin
INIT_ROOT_USERNAME=tachybase

################# ENCRYPTION FIELD #################

ENCRYPTION_FIELD_KEY=

##### PRESETS #####

# 单写名称：添加指定插件且默认启用 名称前加!：移除指定插件 名称前加|：添加指定插件但默认禁用
# PRESETS_CORE_PLUGINS=api-doc,api-keys,!messages
PRESETS_LOCAL_PLUGINS=!adapter-bullmq,!adapter-red-node,!adapter-remix,!api-keys,!audit-logs,!auth-cas,!auth-dingtalk,!auth-lark,!auth-oidc,!auth-saml,!auth-sms,!auth-wechat,!auth-wecom,!block-comments,!block-map,!block-step-form,!data-source-common,!demos-game-runesweeper,!devtools,!field-markdown-vditor,!field-snapshot,!hera,!i18n-editor,!multi-app,!multi-app-share-collection,!online-user,!simple-cms,!sub-accounts,!theme-editor,!workflow-approval,!ai-chat,!department,!workflow-analysis,!api-logs,!ocr-convert

# 主应用工作线程默认数量
WORKER_COUNT=0
# WORKER_TIMEOUT=1800
# 主应用工作线程最大数量
WORKER_COUNT_MAX=8
# WORKER_ERROR_RETRY=3
# 子应用工作线程默认数量
WORKER_COUNT_SUB=0
# 子应用工作线程最大数量
WORKER_COUNT_MAX_SUB=1

# export config, max length of export data to use main thread and page size in worker thread
# EXPORT_LENGTH_MAX=2000
# EXPORT_WORKER_PAGESIZE=1000

# 开发环境测试locale 强制使用 cache
#FORCE_LOCALE_CACHE=1

# 禁止子应用装载的插件，多个用逗号分隔
# FORBID_SUB_APP_PLUGINS=multi-app,manual-notification,multi-app-share-collection


# 工作线程最大内存，单位为MB
# WORKER_MAX_MEMORY=4096
`.trimStart();

    fs.writeFileSync(envPath, content, 'utf8');
    console.log('.env file created.');
  } else {
    console.log('.env file already exists.');
  }
}

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
      if (fs.existsSync(name)) {
        console.log(`project folder ${name} already exists, exit now.`);
        return;
      }
      fs.mkdirSync(name);
      initEnv(name);

      const prefix = `${name}/plugins/node_modules`;
      // 安装前端代码
      console.log('🚀 ~ start download ~ front end files');
      const spinner = yoctoSpinner({ text: `Loading @tachybase/app-web` }).start();
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
      const pluginNames = (options.plugins ? options.plugins : plugins).map(
        (pluginName: string) => `@tachybase/plugin-${pluginName}`,
      );
      for (const pluginName of pluginNames) {
        const spinner = yoctoSpinner({ text: `[${index++}/${pluginNames.length}] Loading ${pluginName}` }).start();
        await downloadTar(pluginName, `${prefix}/${pluginName}`);
        spinner.success();
      }
      console.log();
    });
};
