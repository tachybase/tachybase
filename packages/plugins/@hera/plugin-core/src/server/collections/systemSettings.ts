import { extendCollection } from '@nocobase/database';

export default extendCollection({
  name: 'systemSettings',
  fields: [
    {
      type: 'json',
      name: 'features',
      defaultValue: [],
    },
  ],
});
