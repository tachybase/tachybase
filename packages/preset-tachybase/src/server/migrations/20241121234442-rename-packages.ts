import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'beforeLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.43';

  async up() {
    // coding
    const transaction = await this.db.sequelize.transaction();
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-auth-saml',
      },
      transaction,
      values: {
        name: 'auth-saml',
        packageName: '@tachybase/plugin-auth-saml',
      },
    });
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-cas',
      },
      transaction,
      values: {
        name: 'auth-cas',
        packageName: '@tachybase/plugin-auth-cas',
      },
    });
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-dingtalk',
      },
      transaction,
      values: {
        name: 'auth-dingtalk',
        packageName: '@tachybase/plugin-auth-dingtalk',
      },
    });
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-oidc',
      },
      transaction,
      values: {
        name: 'auth-oidc',
        packageName: '@tachybase/plugin-auth-oidc',
      },
    });
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-saml',
      },
      transaction,
      values: {
        name: 'auth-saml',
        packageName: '@tachybase/plugin-auth-saml',
      },
    });
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-sms-auth',
      },
      transaction,
      values: {
        name: 'auth-sms',
        packageName: '@tachybase/plugin-auth-sms',
      },
    });
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-work-wechat',
      },
      transaction,
      values: {
        name: 'auth-wecom',
        packageName: '@tachybase/plugin-auth-wecom',
      },
    });
    await this.pm.repository.update({
      filter: {
        packageName: '@tachybase/plugin-wechat-auth',
      },
      transaction,
      values: {
        name: 'auth-wechat',
        packageName: '@tachybase/plugin-auth-wechat',
      },
    });
    await transaction.commit();
  }
}
