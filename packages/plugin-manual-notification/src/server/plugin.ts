import { InjectedPlugin, Plugin } from '@tachybase/server';

import { notificationsController } from './actions/notificationsController';

@InjectedPlugin({
  Controllers: [notificationsController],
})
export class PluginManualNotificationServer extends Plugin {
  async load() {
    this.app.acl.registerSnippet({
      name: `pm.system-services.manual-notification`,
      actions: ['notificationConfigs:*'],
    });
  }
}

export default PluginManualNotificationServer;
