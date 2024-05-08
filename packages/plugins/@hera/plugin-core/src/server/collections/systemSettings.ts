import { extendCollection } from '@tachybase/database';

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
