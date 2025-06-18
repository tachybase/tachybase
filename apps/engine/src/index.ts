import './preload';

import { performance } from 'node:perf_hooks';
import process from 'node:process';
import { Gateway } from '@tachybase/server';

import { getConfig } from './config';
import { guessServePath, initEnv } from './utils';

// 初始化环境变量
initEnv();

if (!process.env.SERVE_PATH) {
  const servePath = guessServePath();
  if (!servePath) {
    throw new Error('SERVE_PATH not found');
  }
  process.env.SERVE_PATH = servePath;
}

const run = async () => {
  console.log(`Engine loaded at ${performance.now().toFixed(2)} ms`);
  await Gateway.getInstance().run({
    mainAppOptions: (await getConfig()) as any,
  });
};

run();
