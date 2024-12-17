import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.68';

  async up() {
    // coding
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-users',
      },
      values: {
        packageName: '@tachybase/module-user',
        name: 'user',
      },
    });

    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-system-settings',
      },
      values: {
        packageName: '@tachybase/module-app-info',
        name: 'app-info',
      },
    });

    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-multi-app-manager',
      },
      values: {
        packageName: '@tachybase/module-multi-app',
        name: 'multi-app',
      },
    });

    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-logger',
      },
      values: {
        packageName: '@tachybase/plugin-log-viewer',
        name: 'log-viewer',
        builtin: false,
      },
    });

    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-localization-management',
      },
      values: {
        packageName: '@tachybase/plugin-i18n-editor',
        name: 'i18n-editor',
      },
    });

    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-error-handler',
      },
      values: {
        packageName: '@tachybase/module-error-handler',
        name: 'error-handler',
      },
    });

    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-collection-manager',
      },
      values: {
        packageName: '@tachybase/module-collection',
        name: 'collection',
      },
    });

    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-backup-restore',
      },
      values: {
        packageName: '@tachybase/module-backup',
        name: 'backup',
      },
    });

    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-auth',
      },
      values: {
        packageName: '@tachybase/module-auth',
        name: 'auth',
      },
    });

    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-acl',
      },
      values: {
        packageName: '@tachybase/module-acl',
        name: 'acl',
      },
    });
  }
}
