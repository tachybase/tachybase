import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { defineConfig } from '@tachybase/build';

export default defineConfig({
  afterBuild: async (log) => {
    const dir = path.resolve(__dirname, './dist/node_modules/@node-red');
    if (existsSync(dir)) {
      await fs.rm(dir, { recursive: true });
    }

    await fs.cp(path.resolve(__dirname, './node_modules/@node-red'), dir, {
      recursive: true,
      force: true,
    });
  },
});
