import { isBuiltin, Module } from 'node:module';
import { isAbsolute } from 'node:path';

// @ts-ignore
const originalLoad = Module._load;
const appRoot = __dirname;

// 判断是否是裸模块名（例如 'lodash'、'react'）
function isBareModule(name: string) {
  return !name.startsWith('.') && !name.startsWith('/') && !isAbsolute(name);
}

const count = {
  total: 0,
  builtin: 0,
  main: 0,
  modules: 0,
  path: 0,
  fallback: 0,
  error: 0,
};

const timer = {
  total: 0,
  builtin: 0,
  main: 0,
  modules: 0,
  path: 0,
  error: 0,
};

// 程序退出时打印
process.on('exit', () => {
  console.log(JSON.stringify(count));
  console.log(JSON.stringify(timer));
});

const lookingPaths = process.env.NODE_MODULES_PATH ? [appRoot, process.env.NODE_MODULES_PATH] : [appRoot];

// @ts-ignore
Module._load = function (request: string, parent, isMain) {
  count.total++;
  // 内置模块不拦截
  if (isBuiltin(request)) {
    count.builtin++;
    return originalLoad(request, parent, isMain);
  }

  // 对裸模块名才尝试优先主程序路径加载
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

  count.path++;
  // 相对路径、绝对路径不动
  return originalLoad(request, parent, isMain);
};
