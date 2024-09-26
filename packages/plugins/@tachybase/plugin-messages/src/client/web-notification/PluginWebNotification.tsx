import { Plugin } from '@tachybase/client';

import PluginMessagesClient from '..';
import { lang } from '../locale';

export class PluginWebNotification extends Plugin {
  async afterLoad() {
    // ‌请求用户授予权限
    if (Notification.permission !== 'denied') {
      await Notification.requestPermission();
    }
  }

  async load() {
    this.pm.get(PluginMessagesClient).registe({
      name: 'browser',
      title: lang('Browser notification'),
    });

    this.app.ws.on('message', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data?.type === 'messages') {
        const message = data.payload.message;
        const notification = new Notification(message.title, {
          body: message.content,
        });
      }
    });
  }
}
