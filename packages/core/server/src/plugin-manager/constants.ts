export const APP_NAME = 'tachybase';
export const DEFAULT_PLUGIN_STORAGE_PATH = 'storage/plugins';
export const DEFAULT_PLUGIN_PATH = 'packages/plugins/';
export const pluginPrefix = (
  process.env.PLUGIN_PACKAGE_PREFIX || '@nocobase/plugin-,@tachybase/preset-,@nocobase/plugin-pro-,@hera/plugin-'
).split(',');
export const requireRegex = /require\s*\(['"`](.*?)['"`]\)/g;
export const importRegex = /^import(?:['"\s]*([\w*${}\s,]+)from\s*)?['"\s]['"\s](.*[@\w_-]+)['"\s].*/gm;
export const EXTERNAL = [
  // nocobase
  '@nocobase/acl',
  '@nocobase/actions',
  '@nocobase/auth',
  '@nocobase/cache',
  '@nocobase/client',
  '@nocobase/database',
  '@nocobase/evaluators',
  '@nocobase/logger',
  '@nocobase/resourcer',
  '@nocobase/sdk',
  '@nocobase/server',
  '@nocobase/test',
  '@nocobase/utils',

  // @nocobase/auth
  'jsonwebtoken',

  // @nocobase/cache
  'cache-manager',

  // @nocobase/database
  'sequelize',
  'umzug',
  'async-mutex',

  // @nocobase/evaluators
  '@formulajs/formulajs',
  'mathjs',

  // @nocobase/logger
  'winston',
  'winston-daily-rotate-file',

  // koa
  'koa',
  '@koa/cors',
  '@koa/router',
  'multer',
  '@koa/multer',
  'koa-bodyparser',
  'koa-static',
  'koa-send',

  // react
  'react',
  'react-dom',
  'react/jsx-runtime',

  // react-router
  'react-router',
  'react-router-dom',

  // antd
  'antd',
  'antd-style',
  '@ant-design/icons',
  '@ant-design/cssinjs',

  // i18next
  'i18next',
  'react-i18next',

  // dnd-kit 相关
  '@dnd-kit/accessibility',
  '@dnd-kit/core',
  '@dnd-kit/modifiers',
  '@dnd-kit/sortable',
  '@dnd-kit/utilities',

  // formily 相关
  '@formily/antd-v5',
  '@formily/core',
  '@formily/react',
  '@formily/json-schema',
  '@formily/path',
  '@formily/validator',
  '@formily/shared',
  '@formily/reactive',
  '@formily/reactive-react',

  // utils
  'dayjs',
  'mysql2',
  'pg',
  'pg-hstore',
  'sqlite3',
  'supertest',
  'axios',
  '@emotion/css',
  'ahooks',
  'lodash',
  'china-division',
];
