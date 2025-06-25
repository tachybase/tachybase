import fs from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from '@tachybase/devkit';

const vditor = path.dirname(require.resolve('vditor'));

export default defineConfig({
  afterBuild: async (log) => {
    log('coping vditor dist');
    await fs.cp(vditor, path.resolve(__dirname, 'dist/client/vditor/dist'), {
      recursive: true,
      force: true,
    });
  },
});
