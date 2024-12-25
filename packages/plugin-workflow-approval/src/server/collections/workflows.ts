import { extendCollection } from '@tachybase/database';

// show workflows feature card theme-color and icon
export default extendCollection({
  name: 'workflows',
  fields: [
    {
      name: 'color',
      type: 'string',
      interface: 'color',
    },
    {
      name: 'icon',
      type: 'string',
      interface: 'icon',
    },
  ],
});
