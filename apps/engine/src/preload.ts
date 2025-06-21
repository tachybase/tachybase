import { isBuiltin, Module } from 'node:module';

// improve error stack
Error.stackTraceLimit = process.env.ERROR_STACK_TRACE_LIMIT ? +process.env.ERROR_STACK_TRACE_LIMIT : 10;

declare module 'node:module' {
  // 扩展 NodeJS.Module 静态属性
  export function _load(request: string, parent: NodeModule | null, isMain: boolean): any;
}

const originalLoad = Module._load;
const appRoot = __dirname;

// 使用加载白名单的机制
// TODO 在服务器端、worker 和这里进行同步
const whitelists = new Set([
  '@koa/cors',
  '@koa/multer',
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

// 加载路径包含两个，一个是引擎的启动目录，另一个是指定的插件目录
const lookingPaths = process.env.NODE_MODULES_PATH ? [appRoot, process.env.NODE_MODULES_PATH] : [appRoot];

// 带给子进程加载路径
process.env.TACHYBASE_WORKER_PATHS = lookingPaths.join(',');

// 整个加载过程允许报错，保持和默认加载器一样的行为
Module._load = function (request: string, parent: NodeModule | null, isMain: boolean) {
  // 使用白名单拦截，以及所有符合 '@tachybase/' 前缀的包
  if (whitelists.has(request) || request.startsWith('@tachybase/')) {
    try {
      const resolvedFromApp = require.resolve(request, { paths: lookingPaths });
      return originalLoad(resolvedFromApp, parent, isMain);
    } catch (err) {
      // 这里不应该发生，但是我们依旧提供回退的机制，使用默认行为来加载模块
      if (err.code === 'MODULE_NOT_FOUND') {
        return originalLoad(request, parent, isMain);
      }
    }
  }

  // 相对路径、绝对路径不动
  return originalLoad(request, parent, isMain);
};
