import { defineCollection } from '@tachybase/database';

export default defineCollection({
  name: 'cloudComponents',
  dumpRules: 'required',
  logging: true,
  autoGenId: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
  fields: [
    {
      name: 'name',
      type: 'string',
      unique: true,
    },
    {
      name: 'code',
      type: 'text',
    },
    {
      name: 'data',
      type: 'json',
      jsonb: false,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'enabled',
      type: 'boolean',
      defaultValue: false,
    },
  ],
});
