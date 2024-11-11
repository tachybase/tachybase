import { defineCollection } from '@tachybase/database';

export default defineCollection({
  dumpRules: {
    group: 'required',
  },
  name: 'linkManage',
  title: '链接管理',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
    },
    {
      title: 'Link',
      name: 'link',
      type: 'string',
    },
  ],
});
