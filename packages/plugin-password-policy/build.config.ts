import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from '@tachybase/devkit';

export default defineConfig({
  afterBuild: async (log) => {
    const dir = path.resolve(__dirname, './dist/node_modules/ipaddr.js');
    if (existsSync(dir)) {
      await fs.rm(dir, { recursive: true });
    }

    log(`coping `);

    const src = path.resolve(__dirname, './node_modules/ipaddr.js');
    const stat = await fs.lstat(src);
    let realSrc = src;

    if (stat.isSymbolicLink()) {
      const resolved = await fs.readlink(src);
      // 如果是相对路径的链接，要转换成绝对路径
      realSrc = path.resolve(path.dirname(src), resolved);
    }

    await fs.cp(realSrc, dir, {
      recursive: true,
      force: true,
    });
  },
});
