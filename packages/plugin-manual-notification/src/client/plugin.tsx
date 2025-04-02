import { Plugin } from '@tachybase/client';

import { lang } from './locale';
import { NotificationConfigPane } from './NotificationConfigPane';

class PluginManualNotificationClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.systemSettingsManager.add('system-services.manual-notification', {
      icon: 'SettingOutlined',
      title: lang('Manual Notification'),
      Component: NotificationConfigPane,
      aclSnippet: 'pm.system-services.manual-notification',
    });
  }
}

export default PluginManualNotificationClient;
