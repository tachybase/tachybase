import { useApp } from '@tachybase/client';

import { CHANNEL_SITE_MESSAGE } from '../../../../common/constants';
import { Channel } from '../../../interface';
import { lang } from '../../../locale';

export const SITE_MESSAGE_CHANNEL = CHANNEL_SITE_MESSAGE;
export class SiteMessageChannel extends Channel {
  name = SITE_MESSAGE_CHANNEL;
  title = lang('Site message notification');
  useAction() {
    const app = useApp();
    const send = (message) => {
      const { title, content } = message;
      app.notification.info({
        key: title,
        message: `${title}${content ? ':' + content : ''}`,
        duration: 10,
      });
    };

    return {
      send,
    };
  }
}
