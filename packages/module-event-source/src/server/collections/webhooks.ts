import { defineCollection } from '@tachybase/database';

export default defineCollection({
  name: 'webhooks',
  dumpRules: {
    group: 'required',
  },
  model: 'EventSourceModel',
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
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
    {
      name: 'options',
      type: 'json',
    },
    {
      name: 'effect',
      type: 'virtual',
    },
    {
      name: 'effectConfig',
      type: 'virtual',
    },
    {
      name: 'sort',
      type: 'integer',
    },
  ],
});
