import { CollectionOptions } from '@tachybase/database';

export default {
  dumpRules: {
    group: 'required',
  },
  shared: true,
  name: 'workflowCategories',
  autoGenId: true,
  sortable: true,
  fields: [
    {
      type: 'string',
      name: 'name',
      translation: true,
    },
    {
      type: 'string',
      name: 'color',
      defaultValue: 'default',
    },
    {
      type: 'belongsToMany',
      name: 'workflows',
      target: 'workflows',
      foreignKey: 'categoryId',
      otherKey: 'workflowKey',
      targetKey: 'key',
      through: 'workflowCategory',
    },
  ],
} as CollectionOptions;
