import { defineCollection } from '@tachybase/database';

export default defineCollection({
  dumpRules: 'required',
  name: 'appEntries',
  fields: [
    {
      type: 'string',
      name: 'title',
    },
    {
      type: 'integer',
      name: 'appId',
    },
    {
      type: 'string',
      name: 'type',
    },
    {
      type: 'string',
      name: 'path',
    },
    {
      type: 'boolean',
      name: 'default',
    },
    {
      type: 'json',
      name: 'options',
      defaultValue: {},
    },
  ],
});
