import { Plugin } from '@tachybase/client';

import PluginMessagesClient from '..';
import { lang } from '../locale';
import { WebNotificationProvider } from './WebNotificationProvider';

export class PluginWebNotification extends Plugin {
  async load() {
    this.app.use(WebNotificationProvider);
    this.pm.get(PluginMessagesClient).registe({
      name: 'browser',
      title: lang('Browser notification'),
    });

    this.app.ws.on('message', async (event: MessageEvent) => {
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
