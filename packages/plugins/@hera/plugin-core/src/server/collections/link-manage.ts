import { defineCollection } from '@nocobase/database';

export default defineCollection({
  duplicator: 'optional',
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
