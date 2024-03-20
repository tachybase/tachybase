import { defineCollection } from '@nocobase/database';

export default defineCollection({
  dumpRules: {
    group: 'required',
  },
  name: 'home_page_presentations_attachments',
  title: '首页展示图关联',
  fields: [
    {
      name: 'home_page_presentations_id',
      type: 'bigInt',
      interface: 'id',
      primaryKey: true,
      allowNull: false,
    },
    {
      name: 'attachments_id',
      type: 'bigInt',
      interface: 'id',
      primaryKey: true,
      allowNull: false,
    },
  ],
});
