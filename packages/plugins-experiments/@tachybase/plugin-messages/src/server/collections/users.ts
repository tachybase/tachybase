import { extendCollection } from '@tachybase/database';

export default extendCollection({
  name: 'users',
  fields: [
    {
      type: 'json',
      // 订阅偏好设置
      name: 'subPrefs',
      allowNull: false,
      defaultValue: {},
    },
  ],
});
