import React, { useEffect, useMemo } from 'react';
import { useApp, useCompile, usePlugin } from '@tachybase/client';
import { autorun } from '@tachybase/schema';

import { MESSAGE_TYPE_MESSAGES } from '../../../common/constants';
import ModuleMessageClient from '../../plugin';

export const MessageChannelProvider = ({ children }) => {
  const app = useApp();
  const compile = useCompile();
  const moduleMessage = usePlugin(ModuleMessageClient);
  const channelList = useMemo(() => Array.from(moduleMessage.channels.getValues()), [moduleMessage]);

  const sendFuncList = useMemo(
    () =>
      channelList
        .map((channel) => {
          return channel.send || channel.useAction?.()?.send;
        })
        .filter(Boolean),
    [channelList],
  );

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
  }, []);

  useEffect(() => {
    // 监听 websocket 消息
    app.ws.on('message', (event) => {
      const data = JSON.parse(event.data);
      if (data?.type === MESSAGE_TYPE_MESSAGES) {
        const message = data.payload.message;
        const title = compile(message.title);
        const content = compile(message.content);

        const cookedMessage = {
          title,
          content,
        };

        [].forEach((send) => send?.(cookedMessage));
      }
    });
  }, []);

  return <>{children}</>;
};
