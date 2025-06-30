import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import { defineConfig } from '@tego/devkit';

export default defineConfig({
  afterBuild: async (log) => {
    // fix grant & exchange
    for (const key of ['grant', 'exchange']) {
      const src = path.resolve(__dirname, `./dist/node_modules/@node-red/editor-api/${key}`);
      const dest = path.resolve(__dirname, `./dist/node_modules/@node-red/editor-api/lib/${key}`);
      // const dir = path.resolve(__dirname, './dist/node_modules/@node-red');
      if (existsSync(dest)) {
        await fs.rm(dest, { recursive: true });
      }

      await fs.cp(src, dest, {
        recursive: true,
        force: true,
      });
    }
    // fix @node-red/nodes
    const src = path.join(__dirname, './node_modules/@node-red/nodes');
    const dest = path.join(__dirname, `./dist/node_modules/@node-red/nodes`);

    if (existsSync(dest)) {
      await fs.rm(dest, { recursive: true });
    }
    await fs.cp(src, dest, {
      recursive: true,
      force: true,
    });
  },
});
