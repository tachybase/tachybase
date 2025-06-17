import { isBuiltin, Module } from 'node:module';
import { isAbsolute } from 'node:path';
import { isMainThread } from 'node:worker_threads';

// 只有引擎运行模式下非主线程才加载
if (!isMainThread && process.env.RUN_MODE === 'engine') {
  const lookingPaths = process.env.TACHYBASE_WORKER_PATHS.split(',');
  // @ts-ignore
  const originalLoad = Module._load;

  // 判断是否是裸模块名（例如 'lodash'、'react'）
  function isBareModule(name: string) {
    return !name.startsWith('.') && !name.startsWith('/') && !isAbsolute(name);
  }

  // 带给子进程加载路径
  process.env.TACHYBASE_WORKER_PATHS = lookingPaths.join(',');

  // @ts-ignore
  Module._load = function (request: string, parent, isMain) {
    // 内置模块不拦截
    if (isBuiltin(request)) {
      return originalLoad(request, parent, isMain);
    }

    // 对裸模块名 尝试优先主程序路径加载、再从指定路径加载
    if (isBareModule(request)) {
      try {
        const resolvedFromApp = require.resolve(request, { paths: lookingPaths });
        return originalLoad(resolvedFromApp, parent, isMain);
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
          return originalLoad(request, parent, isMain);
        }
      }
    }

    // 相对路径、绝对路径不动
    return originalLoad(request, parent, isMain);
  };
}
