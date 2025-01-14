import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.23.35';

  async up() {
    const UiSchemas = this.db.getModel('uiSchemas');
    await this.db.sequelize.transaction(async (transaction) => {
      await UiSchemas.update(
        {
          schema: JSON.stringify({
            type: 'void',
            'x-designer': 'Menu.Designer',
            'x-initializer': 'menuInitializers:menuItem',
            'x-component': 'Menu',
            'x-component-props': {
              mode: 'mix',
              theme: 'dark',
              onSelect: '{{ onSelect }}',
              sideMenuRefScopeKey: 'sideMenuRef',
              isRootMenu: true,
            },
          }),
        },
        {
          transaction,
          where: {
            'x-uid': 'default-admin-menu',
          },
        },
      );
    });
    console.log('update uiSchemas: default-admin-menu');
  }
}
