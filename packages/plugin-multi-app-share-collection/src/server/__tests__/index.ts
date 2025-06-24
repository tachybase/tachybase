import { createMockServer } from '@tachybase/test';

export async function createApp(options = {}) {
  const app = await createMockServer({
    acl: false,
    ...options,
    plugins: ['users', 'error-handler', 'collection-manager', 'multi-app', 'multi-app-share-collection'],
  });

  return app;
}
