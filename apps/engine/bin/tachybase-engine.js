#!/usr/bin/env node
const { existsSync } = require('node:fs');
const { join } = require('node:path');

const libEntry = join(__dirname, '../lib/index.js');
const srcEntry = join(__dirname, '../src/index.ts');

if (existsSync(libEntry)) {
  // ✅ 有构建产物，走正常入口
  console.log('---');
  require(libEntry);
} else if (existsSync(srcEntry)) {
  console.log('===');
  // ❌ 没有构建产物，走 tsx 注册临时编译执行
  const tsx = require('tsx/cjs/api');
  tsx.register(); // 可选：保存 unregister 用于之后移除
  require(srcEntry);
} else {
  // 打包后用相对路径
  require('../lib');
}
