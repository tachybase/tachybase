import { defineCollection } from '@tachybase/database';

export default defineCollection({
  name: 'cloudLibraries',
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
      allowNull: false,
    },
    {
      name: 'compiledCode',
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
    {
      name: 'isClient',
      type: 'boolean',
      defaultValue: false,
    },
    {
      name: 'isServer',
      type: 'boolean',
      defaultValue: false,
    },
    {
      name: 'module',
      type: 'string',
      allowNull: false,
    },
    {
      name: 'serverPlugin',
      type: 'string',
    },
    {
      name: 'clientPlugin',
      type: 'string',
    },
  ],
});
