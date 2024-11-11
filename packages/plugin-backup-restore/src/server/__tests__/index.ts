import { createMockServer } from '@tachybase/test';

export default async function createApp() {
  const app = await createMockServer({
    plugins: ['tachybase'],
  });
  return app;
}
