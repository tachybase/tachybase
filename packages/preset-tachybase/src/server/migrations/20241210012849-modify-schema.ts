import { Repository } from '@tachybase/database';
import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.65';

  async up() {
    const uiSchemas = this.db.getRepository<Repository & { insert }>('uiSchemas');
    const exists = await uiSchemas.count({
      filter: {
        'x-uid': 'default-admin-mobile',
      },
    });
    if (exists) {
      return;
    }

    await uiSchemas.insert({
      type: 'void',
      'x-uid': 'default-admin-mobile',
      'x-component': 'MContainer',
      'x-designer': 'MContainer.Designer',
      'x-component-props': {},
      properties: {
        page: {
          type: 'void',
          'x-component': 'MPage',
          'x-designer': 'MPage.Designer',
          'x-component-props': {},
          properties: {
            grid: {
              type: 'void',
              'x-component': 'Grid',
              'x-initializer': 'mobilePage:addBlock',
              'x-component-props': {
                showDivider: false,
              },
            },
          },
        },
      },
    });
  }
}
