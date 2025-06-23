import { createRequire, Module } from 'node:module';
import { resolve } from 'node:path';
import TachybaseGlobal from '@tachybase/globals';

// improve error stack
Error.stackTraceLimit = process.env.ERROR_STACK_TRACE_LIMIT ? +process.env.ERROR_STACK_TRACE_LIMIT : 10;

// 默认 NODE_MODULES_PATH 搜索路径
if (!process.env.NODE_MODULES_PATH) {
  process.env.NODE_MODULES_PATH = [
    // 开发包
    resolve('storage', '.packages'),
    // 引擎初始化下载的插件
    resolve('plugins'),
    // 下载插件
    resolve('storage', '.plugins'),
  ].join(',');
}

// 解析 process.env.NODE_MODULES_PATH
// TODO 我们马上切换到配置文件的形式，而不是环境变量
const paths = process.env.NODE_MODULES_PATH.split(',');
TachybaseGlobal.getInstance().set('PLUGIN_PATHS', paths);

declare module 'node:module' {
  // 扩展 NodeJS.Module 静态属性
  export function _load(request: string, parent: NodeModule | null, isMain: boolean): any;
}

const originalLoad = Module._load;
const appRoot = __dirname;

// 使用加载白名单的机制
// TODO 考虑服务端校验的版本也和这个保持同步（服务端要求的版本要和这里以及引擎的 package.json 一致）
const defaultWhitelists = [
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
];

const whitelists = new Set(defaultWhitelists);

// 允许环境变量设置模块
// 额外添加的模块会被放在指定目录 NODE_MODULES_PATH 中
if (process.env.ENGINE_MODULES) {
  process.env.ENGINE_MODULES.split(',').forEach((item: string) => {
    whitelists.add(item);
  });
}

// 加载路径包含两个，一个是引擎的启动目录，另一个是指定的插件目录
const lookingPaths = [appRoot, ...TachybaseGlobal.getInstance().get('PLUGIN_PATHS')];

// 带给子进程加载路径
process.env.TACHYBASE_WORKER_PATHS = lookingPaths.join(',');
process.env.TACHYBASE_WORKER_MODULES = [...whitelists].join(',');

// 整个加载过程允许报错，保持和默认加载器一样的行为
Module._load = function (request: string, parent: NodeModule | null, isMain: boolean) {
  // 使用白名单拦截，以及所有符合 '@tachybase/' 前缀的包
  if (whitelists.has(request) || request.startsWith('@tachybase/')) {
    try {
      const resolvedFromApp = require.resolve(request, { paths: lookingPaths });
      return originalLoad(resolvedFromApp, parent, isMain);
    } catch (err) {
      for (const basePath of lookingPaths) {
        // 支持非 node_modules 的加载
        try {
          const pluginRoot = resolve(basePath, request);
          const fakeRequire = createRequire(pluginRoot + '/index.js');
          const resolved = fakeRequire.resolve(pluginRoot);
          return originalLoad(resolved, parent, isMain);
        } catch {}
      }
      // 这里不应该发生，但是我们依旧提供回退的机制，使用默认行为来加载模块
      if (err.code === 'MODULE_NOT_FOUND') {
        return originalLoad(request, parent, isMain);
      }
    }
  }

  // 相对路径、绝对路径不动
  return originalLoad(request, parent, isMain);
};
