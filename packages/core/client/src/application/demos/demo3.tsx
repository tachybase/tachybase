import { Application, NocoBaseBuildInPlugin } from '@tachybase/client';

export const app = new Application({
  apiClient: {
    baseURL: process.env.API_BASE_URL,
  },
  plugins: [NocoBaseBuildInPlugin],
});

export default app.getRootComponent();
