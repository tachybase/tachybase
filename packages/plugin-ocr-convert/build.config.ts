import path from 'node:path';
import { defineConfig } from '@tachybase/devkit';

import ncc from '@vercel/ncc';
import fs from 'fs-extra';

export default defineConfig({
  afterBuild: async (log) => {
    const dep = require.resolve('tencentcloud-sdk-nodejs', { paths: [__dirname] }).split('?')[0];
    const mainFile = require
      .resolve('tencentcloud-sdk-nodejs/tencentcloud/services/ocr/v20181119/ocr_client', {
        paths: [path.join(__dirname, 'dist')],
      })
      .split('?')[0];
    const nccConfig = { minify: true, target: 'es5', quiet: true, externals: {} };
    await ncc(dep, nccConfig).then(
      ({ code, assets }: { code: string; assets: Record<string, { source: string; permissions: number }> }) => {
        // emit dist file
        fs.writeFileSync(mainFile, code, 'utf-8');
      },
    );
  },
});
