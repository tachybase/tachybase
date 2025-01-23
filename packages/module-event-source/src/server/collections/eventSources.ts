import { defineCollection } from '@tachybase/database';

export default defineCollection({
  name: 'eventSources',
  dumpRules: {
    group: 'required',
  },
  model: 'EventSourceModel',
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
      name: 'options',
      type: 'json',
    },
  ],
});
