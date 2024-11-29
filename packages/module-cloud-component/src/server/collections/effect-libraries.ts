import { defineCollection } from '@tachybase/database';

export default defineCollection({
  name: 'effectLibraries',
  dumpRules: 'required',
  fields: [
    {
      name: 'module',
      type: 'string',
      allowNull: false,
      unique: true,
    },
    {
      name: 'enabled',
      type: 'boolean',
      defaultValue: false,
    },
    {
      name: 'server',
      type: 'text',
    },
    {
      name: 'client',
      type: 'text',
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
      name: 'serverPlugin',
      type: 'string',
    },
    {
      name: 'clientPlugin',
      type: 'string',
    },
    {
      name: 'version',
      type: 'string',
    },
  ],
});
