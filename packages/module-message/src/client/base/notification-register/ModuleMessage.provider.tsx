import { useEffect } from 'react';
import { useApp, useCompile, useCurrentUserContext } from '@tachybase/client';
import { autorun } from '@tachybase/schema';

import { useAsyncEffect } from 'ahooks';

import { sendNotification } from './tools';

const isSupported = () => 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;

export const ModuleMessageProvider = ({ children }) => {
  const compile = useCompile();
  const app = useApp();
  const currentUser = useCurrentUserContext();

  const sendSiteNotify = ({ title, content }) => {
    app.notification.info({
      key: title,
      message: `${title}${content ? ':' + content : ''}`,
      duration: 10,
    });
  };

  useAsyncEffect(async () => {
    if (currentUser.data?.data?.subPrefs?.browser?.enable) {
      if (isSupported() && Notification.permission !== 'denied') {
        const result = await Notification.requestPermission();
      }
    }
  }, [currentUser.data.data]);

  useEffect(() => {
    // 建立 websocket 连接
    autorun(() => {
      if (app.ws.connected) {
        const data = {
          type: 'signIn',
          payload: {
            token: app.apiClient.auth.getToken(),
          },
        };
        app.ws.send(JSON.stringify(data));
      }
    });

    // 监听 websocket 消息
    app.ws.on('message', (event) =>
      sendNotification(event, {
        compile,
        sendSiteNotify,
      }),
    );
  }, []);

  return children;
};
