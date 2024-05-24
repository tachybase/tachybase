import { Application, BuildinPlugin } from '@tachybase/client';

export const app = new Application({
  apiClient: {
    baseURL: process.env.API_BASE_URL,
  },
  plugins: [BuildinPlugin],
});

export default app.getRootComponent();
