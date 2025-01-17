import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.23.37';

  async up() {
    const uiSchemasRepo = this.db.getRepository('uiSchemas');

    const xUid = 'default-admin-menu';
    await uiSchemasRepo.update({
      filter: {
        'x-uid': xUid,
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
    // 清理缓存中的数据
    await this.app.cache.del(`p_${xUid}`);
    await this.app.cache.del(`s_${xUid}`);
    this.app.logger.info(`collection [uiSchemas] update ${1} rows`);
  }
}
