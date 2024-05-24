import { createMockServer } from '@tachybase/test';

export default async function createApp() {
  const app = await createMockServer({
    plugins: ['nocobase'],
  });
  return app;
}