import { fileURLToPath, URL } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: [
      { find: '@tachybase/client', replacement: fileURLToPath(new URL('../../packages/client/src', import.meta.url)) },
      {
        find: '@tachybase/utils/client',
        replacement: fileURLToPath(new URL('../../packages/utils/src/client.ts', import.meta.url)),
      },
      { find: '@tachybase/schema', replacement: fileURLToPath(new URL('../../packages/schema/src', import.meta.url)) },
      { find: '@tachybase/sdk', replacement: fileURLToPath(new URL('../../packages/sdk/src', import.meta.url)) },
      {
        find: '@tachybase/components',
        replacement: fileURLToPath(new URL('../../packages/components/src', import.meta.url)),
      },
      {
        find: '@tachybase/evaluators',
        replacement: fileURLToPath(new URL('../../packages/evaluators/src', import.meta.url)),
      },
    ],
  },
});
