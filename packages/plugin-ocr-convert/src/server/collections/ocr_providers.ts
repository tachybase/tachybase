import { defineCollection } from '@tachybase/database';

export default defineCollection({
  name: 'ocr_providers',
  dumpRules: {
    group: 'third-party',
  },
  fields: [
    {
      type: 'string',
      name: 'id',
      primaryKey: true,
    },
    {
      type: 'string',
      name: 'title',
    },
    {
      type: 'string',
      name: 'type',
    },
    {
      type: 'jsonb',
      name: 'options',
    },
    {
      type: 'radio',
      name: 'default',
    },
  ],
});
