import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.23.35';

  async up() {
    const uiSchemasRepo = this.db.getRepository('uiSchemas');

    await uiSchemasRepo.update({
      filter: {
        'x-uid': 'default-admin-menu',
      },
      values: {
        schema: {
          type: 'void',
          'x-designer': 'Menu.Designer',
          'x-initializer': 'menuInitializers:menuItem',
          'x-component': 'Menu',
          'x-component-props': {
            mode: 'mix',
            theme: 'dark',
            onSelect: '{{ onSelect }}',
            sideMenuRefScopeKey: 'sideMenuRef',
          },
        },
      },
    });
    this.app.logger.info(`collection [uiSchemas] update ${1} rows`);
  }
}
