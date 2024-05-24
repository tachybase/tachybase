import { resolve } from 'path';
import { Plugin } from '@tachybase/server';

export class MobileClientPlugin extends Plugin {
  afterAdd() {}

  async load() {
    this.db.addMigrations({
      namespace: 'client',
      directory: resolve(__dirname, './migrations'),
      context: {
        plugin: this,
      },
    });
  }

  async install() {
    const uiSchemas = this.db.getRepository<any>('uiSchemas');
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

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default MobileClientPlugin;
