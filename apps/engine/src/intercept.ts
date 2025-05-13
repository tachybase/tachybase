import { Module } from 'node:module';
import { isAbsolute } from 'node:path';

// @ts-ignore
const originalLoad = Module._load;
const appRoot = __dirname;
const isBuiltin = (name) => require('module').builtinModules.includes(name);

// 判断是否是裸模块名（例如 'lodash'、'react'）
function isBareModule(name: string) {
  return !name.startsWith('.') && !name.startsWith('/') && !isAbsolute(name);
}

// @ts-ignore
Module._load = function (request: string, parent, isMain) {
  try {
    // 内置模块不拦截
    if (isBuiltin(request)) {
      return originalLoad(request, parent, isMain);
    }

    // 对裸模块名才尝试优先主程序路径加载
    if (isBareModule(request)) {
      const resolvedFromApp = require.resolve(request, { paths: [appRoot] });
      // if (request.includes('tachybase/utils')) {
      //   console.log('🚀 ~ request:', request);
      //   console.log('🚀 ~ request:', request, { paths: [appRoot] })
      //   console.log('🚀 ~ request: ~ resolvedFromApp', resolvedFromApp)
      // }
      return originalLoad(resolvedFromApp, parent, isMain);
    }

    // 相对路径、绝对路径不动
    return originalLoad(request, parent, isMain);
  } catch (e) {
    // fallback：尽量兜底
    return originalLoad(request, parent, isMain);
  }
};
