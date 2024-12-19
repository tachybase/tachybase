import { Plugin } from '@tachybase/client';

import { NAMESPACE } from '../../../common/constants';
import { NotificationProviders } from './NotificationProviders';

const NAME_NOTIFICATION_PROVIDERS = 'notification-providers';

export class KitNotificationProviders extends Plugin {
  async load() {
    this.app.systemSettingsManager.add(`system-services.${NAME_NOTIFICATION_PROVIDERS}`, {
      icon: 'CheckCircleOutlined',
      title: `{{t("Notification providers", { ns: "${NAMESPACE}" })}}`,
      aclSnippet: 'pm.message.providers',
      Component: NotificationProviders,
    });
  }
}
