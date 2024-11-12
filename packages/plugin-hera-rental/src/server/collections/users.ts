import { extendCollection } from '@tachybase/database';

export default extendCollection({
  name: 'users',
  fields: [
    {
      type: 'belongsTo',
      name: 'defaultPrintStyle',
      target: 'printStyles',
    },
  ],
});
