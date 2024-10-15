import { extendCollection } from '@tachybase/database';

export default extendCollection({
  name: 'webhooks',
  fields: [
    {
      name: 'actionName',
      type: 'string',
    },
    {
      name: 'resourceName',
      type: 'text',
    },
  ],
});
