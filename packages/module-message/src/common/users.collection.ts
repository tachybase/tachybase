import { extendCollection } from '@tachybase/database';

import { CHANNEL_SITE_MESSAGE } from './constants';

export default extendCollection({
  name: 'users',
  fields: [
    {
      type: 'json',
      // 订阅偏好设置
      name: 'subPrefs',
      allowNull: false,
      defaultValue: {
        [CHANNEL_SITE_MESSAGE]: {
          enable: true,
        },
      },
    },
  ],
});
