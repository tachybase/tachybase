import { Module } from 'node:module';
import { isMainThread } from 'node:worker_threads';
import TachybaseGlobal from '@tachybase/globals';

declare module 'node:module' {
  // 扩展 NodeJS.Module 静态属性
  export function _load(request: string, parent: NodeModule | null, isMain: boolean): any;
}

const paths = process.env.NODE_MODULES_PATH.split(',');
TachybaseGlobal.getInstance().set('PLUGIN_PATHS', paths);

// 只有引擎运行模式下非主线程才加载
if (!isMainThread && process.env.RUN_MODE === 'engine') {
  const lookingPaths = process.env.TACHYBASE_WORKER_PATHS.split(',');
  const whitelists = new Set(process.env.TACHYBASE_WORKER_MODULES.split(','));
  const originalLoad = Module._load;

  Module._load = function (request: string, parent: NodeModule | null, isMain: boolean) {
    if (whitelists.has(request) || request.startsWith('@tachybase/')) {
      try {
        const resolvedFromApp = require.resolve(request, { paths: lookingPaths });
        return originalLoad(resolvedFromApp, parent, isMain);
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
          return originalLoad(request, parent, isMain);
        }
      }
    }
    return originalLoad(request, parent, isMain);
  };
}
