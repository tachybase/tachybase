import React from 'react';
import { useCurrentUserContext } from '@tachybase/client';

import { useAsyncEffect } from 'ahooks';

const isSupported = () => 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;

export const WebNotificationProvider = ({ children }) => {
  const currentUser = useCurrentUserContext();

  useAsyncEffect(async () => {
    if (currentUser.data?.data?.subPrefs?.browser?.enable) {
      if (isSupported() && Notification.permission !== 'denied') {
        const result = await Notification.requestPermission();
      }
    }
  }, [currentUser.data.data]);

  return <>{children}</>;
};
