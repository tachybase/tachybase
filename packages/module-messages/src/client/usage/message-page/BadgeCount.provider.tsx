import React, { useEffect, useState } from 'react';
import { useAPIClient, useApp, useCurrentUserContext } from '@tachybase/client';

import { COLLECTION_NAME_MESSAGES } from '../../../common/messages.collection';
import { ProviderContextBadgeCount } from './BadgeCount.context';

// 提供全局的 badge 计数器
export const ProviderBadgeCount = (props) => {
  const { children } = props;
  const app = useApp();

  const apiClient = useAPIClient();
  const userContext = useCurrentUserContext();
  const currentUser = userContext.data?.data;

  const [badgeCount, setBadgeCount] = useState(0);

  const changeBadgeCount = async () => {
    const res = await apiClient.request({
      resource: COLLECTION_NAME_MESSAGES,
      action: 'count',
      params: {
        filter: {
          read: false,
          userId: currentUser?.id,
        },
      },
    });

    if (!isNaN(res?.data?.data)) {
      setBadgeCount(res?.data?.data);
    }
  };

  useEffect(() => {
    // 监听 websocket 的消息
    app.ws.on('message', changeBadgeCount);
  }, []);

  return (
    <ProviderContextBadgeCount
      value={{
        badgeCount,
        changeBadgeCount,
      }}
    >
      {children}
    </ProviderContextBadgeCount>
  );
};
