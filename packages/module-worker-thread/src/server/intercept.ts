import { Module } from 'node:module';
import { isMainThread } from 'node:worker_threads';
import TachybaseGlobal from '@tachybase/globals';
import { defineLoader } from '@tachybase/loader';

declare module 'node:module' {
  // 扩展 NodeJS.Module 静态属性
  export function _load(request: string, parent: NodeModule | null, isMain: boolean): any;
}

const paths = process.env.NODE_MODULES_PATH.split(',');
TachybaseGlobal.getInstance().set('PLUGIN_PATHS', paths);

// 只有引擎运行模式下非主线程才加载
if (!isMainThread && process.env.RUN_MODE === 'engine') {
  const lookingPaths = process.env.TACHYBASE_WORKER_PATHS.split(',');
  const whitelists = new Set<string>(process.env.TACHYBASE_WORKER_MODULES.split(','));
  const originalLoad = Module._load;

  // 整个加载过程允许报错，保持和默认加载器一样的行为
  Module._load = defineLoader(whitelists, originalLoad, lookingPaths);
}
