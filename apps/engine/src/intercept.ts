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

  // 对裸模块名 尝试优先主程序路径加载、再从指定路径加载
  if (isBareModule(request)) {
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
