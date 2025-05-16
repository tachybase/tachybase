import { Plugin } from '@tachybase/client';
import { autorun } from '@tachybase/schema';

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

    autorun(async () => {
      try {
        const { data } = await this.app.apiClient.request({
          resource: 'notificationConfigs',
          action: 'getRecent',
          params: {},
        });
        if (!data?.data?.length) {
          return;
        }
        const list = data.data;
        const { notifyType, title, content, level, duration } = list[0];
        this.app.noticeManager[notifyType](title, content, level, duration, duration);
      } catch (error) {
        console.error('Failed to fetch recent notifications:', error);
      }
    });
  }
}

export default PluginManualNotificationClient;
