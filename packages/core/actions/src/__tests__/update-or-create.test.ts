import { mockServer } from './index';
import { registerActions } from '@tachybase/actions';
import { Collection } from '@tachybase/database';

describe('update or create', () => {
  let app;

  let Post: Collection;

  beforeEach(async () => {
    app = mockServer();
    await app.db.clean({ drop: true });
    registerActions(app);

    Post = app.collection({
      name: 'posts',
      fields: [{ type: 'string', name: 'title' }],
    });

    await app.db.sync();
  });

  afterEach(async () => {
    await app.destroy();
  });

  test('update or create resource', async () => {
    expect(await Post.repository.findOne()).toBeNull();
    const response = await app
      .agent()
      .resource('posts')
      .updateOrCreate({
        values: {
          title: 't1',
        },
        filterKeys: ['title'],
      });

    expect(response.statusCode).toEqual(200);
    const post = await Post.repository.findOne();
    expect(post).not.toBeNull();
    expect(post['title']).toEqual('t1');
  });
});
