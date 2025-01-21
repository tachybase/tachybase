import { defineCollection } from '@tachybase/database';

export default defineCollection({
  name: 'eventSources',
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
      name: 'type',
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
      name: 'triggerOnAssociation',
      type: 'boolean',
    },
    {
      name: 'actionName',
      type: 'string',
    },
    {
      name: 'resourceName',
      type: 'text',
    },
    {
      name: 'eventName',
      type: 'string',
    },
  ],
});
