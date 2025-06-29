import { Module } from 'node:module';
import { isMainThread, workerData } from 'node:worker_threads';
import TachybaseGlobal from '@tachybase/globals';
import { defineLoader } from '@tachybase/loader';

declare module 'node:module' {
  // 扩展 NodeJS.Module 静态属性
  export function _load(request: string, parent: NodeModule | null, isMain: boolean): any;
}

// 只有引擎运行模式下非主线程才加载
if (!isMainThread) {
  const globals = TachybaseGlobal.getInstance(workerData.initData);
  const lookingPaths = globals.get('WORKER_PATHS');
  const whitelists = new Set<string>(globals.get('WORKER_MODULES'));
  const originalLoad = Module._load;

  // 整个加载过程允许报错，保持和默认加载器一样的行为
  Module._load = defineLoader(whitelists, originalLoad, lookingPaths);
}
