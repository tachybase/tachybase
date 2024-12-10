import { Plugin } from '@tachybase/client';
import { autorun } from '@tachybase/schema';

import ModuleMessagesClient from '..';
import { lang } from '../locale';
import { sendNotification } from './tools';
import { WebNotificationProvider } from './WebNotificationProvider';

// 浏览器通知
export class PluginWebNotification extends Plugin {
  async load() {
    this.app.use(WebNotificationProvider);
    this.pm.get(ModuleMessagesClient).registe({
      name: 'browser',
      title: lang('Browser notification'),
    });

    // 建立 websocket 连接
    autorun(() => {
      if (this.app.ws.connected) {
        const data = {
          type: 'signIn',
          payload: {
            token: this.app.apiClient.auth.getToken(),
          },
        };
        this.app.ws.send(JSON.stringify(data));
      }
    });

    // 监听 websocket 消息
    this.app.ws.on('message', sendNotification);
  }
}
