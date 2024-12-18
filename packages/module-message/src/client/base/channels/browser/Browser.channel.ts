import { useCurrentUserContext } from '@tachybase/client';

import { useAsyncEffect } from 'ahooks';

import { Channel } from '../../../interface';
import { lang } from '../../../locale';

export const BROWSER_CHANNEL = 'browser';
export class BrowserChannel extends Channel {
  name = BROWSER_CHANNEL;
  title = lang('Desktop Browser Notifications');
  useAction() {
    const currentUserService = useCurrentUserContext();
    const currentUser = currentUserService?.data?.data;
    const isSupported = () => 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;

    useAsyncEffect(async () => {
      if (currentUser?.subPrefs?.[BROWSER_CHANNEL]?.enable) {
        if (isSupported() && Notification.permission !== 'denied') {
          await Notification.requestPermission();
        }
      }
    }, [currentUser]);
  }
}
