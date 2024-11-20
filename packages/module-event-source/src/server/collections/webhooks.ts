import { defineCollection } from '@tachybase/database';

export default defineCollection({
  name: 'webhooks',
  dumpRules: {
    group: 'required',
  },
  fields: [
    {
      name: 'name',
      unique: true,
      type: 'string',
    },
    {
      name: 'enabled',
      type: 'boolean',
    },
    {
      name: 'workflowKey',
      type: 'string',
    },
    {
      name: 'type', // code/plugin
      type: 'string',
    },
    {
      name: 'code',
      type: 'text',
    },
    {
      name: 'settings',
      type: 'json',
    },
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
