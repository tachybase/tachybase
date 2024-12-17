import React from 'react';
import { PinnedPluginListProvider, SchemaComponentOptions } from '@tachybase/client';

import { NotificationLink } from './components/NotificationLink.component';

// 站内信通知图标
export const ProviderMessageNotification = (props) => {
  return (
    <PinnedPluginListProvider
      items={{
        nl: {
          order: 220,
          component: 'NotificationLink',
          pin: true,
          isPublic: true,
        },
      }}
    >
      <SchemaComponentOptions
        components={{
          NotificationLink: NotificationLink,
        }}
      >
        {props.children}
      </SchemaComponentOptions>
    </PinnedPluginListProvider>
  );
};
