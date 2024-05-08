import { CollectionOptions } from '@tachybase/database';

export default {
  dumpRules: 'required',
  name: 'uiSchemaServerHooks',
  model: 'ServerHookModel',
  // autoGenId: false,
  timestamps: false,
  fields: [
    { type: 'belongsTo', name: 'uiSchema', target: 'uiSchemas', foreignKey: 'uid' },
    { type: 'string', name: 'type' },
    {
      type: 'string',
      name: 'collection',
    },
    {
      type: 'string',
      name: 'field',
    },
    {
      type: 'string',
      name: 'method',
    },
    {
      type: 'json',
      name: 'params',
    },
  ],
} as CollectionOptions;
