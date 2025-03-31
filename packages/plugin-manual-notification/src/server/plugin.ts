import { Plugin } from '@tachybase/server';

export class PluginManualNotificationServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.acl.registerSnippet({
      name: `pm.system-services.manual-notification`,
      actions: ['notificationConfigs:*'],
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginManualNotificationServer;
