import { isBuiltin, Module } from 'node:module';
import { isAbsolute } from 'node:path';

// @ts-ignore
const originalLoad = Module._load;
const appRoot = __dirname;

// 判断是否是裸模块名（例如 'lodash'、'react'）
function isBareModule(name: string) {
  return !name.startsWith('.') && !name.startsWith('/') && !isAbsolute(name);
}

// 统计路径加载情况
const count = {
  total: 0,
  builtin: 0,
  main: 0,
  path: 0,
  fallback: 0,
};

// 使用加载白名单的机制
// TODO 在服务器端、worker 和这里进行同步
const whitelists = new Set([
  '@koa/cors',
  '@koa/multer',
  '@tachybase/acl',
  '@tachybase/actions',
  '@tachybase/auth',
  '@tachybase/cache',
  '@tachybase/data-source',
  '@tachybase/database',
  '@tachybase/evaluators',
  '@tachybase/logger',
  '@tachybase/resourcer',
  '@tachybase/schema',
  '@tachybase/server',
  '@tachybase/utils',
  'async-mutex',
  'axios',
  'cache-manager',
  'dayjs',
  'dotenv',
  'i18next',
  'jsonwebtoken',
  'koa',
  'koa-bodyparser',
  'lodash',
  'mathjs',
  'multer',
  'mysql2',
  'pg',
  'react',
  'react-dom',
  'sequelize',
  'sqlite3',
  'umzug',
  'winston',
  'winston-daily-rotate-file',
]);

const lookingPaths = process.env.NODE_MODULES_PATH ? [appRoot, process.env.NODE_MODULES_PATH] : [appRoot];

// 带给子进程加载路径
process.env.TACHYBASE_WORKER_PATHS = lookingPaths.join(',');

// @ts-ignore
Module._load = function (request: string, parent, isMain) {
  count.total++;
  // 内置模块不拦截
  if (isBuiltin(request)) {
    count.builtin++;
    return originalLoad(request, parent, isMain);
  }

  // 在白名单中的进行处理
  // TODO 增加环境变量
  if (isBareModule(request) && (whitelists.has(request) || request.startsWith('@tachybase/'))) {
    try {
      const resolvedFromApp = require.resolve(request, { paths: lookingPaths });
      count.main++;
      return originalLoad(resolvedFromApp, parent, isMain);
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        count.fallback++;
        return originalLoad(request, parent, isMain);
      }
    }
  }

  // 相对路径、绝对路径不动
  count.path++;
  return originalLoad(request, parent, isMain);
};
