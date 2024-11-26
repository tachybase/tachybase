import { defineCollection } from '@tachybase/database';

export default defineCollection({
  dumpRules: {
    group: 'third-party',
  },
  name: 'applications',
  model: 'ApplicationModel',
  autoGenId: false,
  sortable: 'sort',
  filterTargetKey: 'name',
  createdBy: true,
  updatedBy: true,
  fields: [
    {
      type: 'uid',
      name: 'name',
      primaryKey: true,
    },
    {
      type: 'string',
      name: 'displayName',
    },
    {
      type: 'string',
      name: 'cname',
      unique: true,
    },
    {
      type: 'string',
      name: 'preset',
    },
    {
      type: 'string',
      name: 'tmpl',
    },
    {
      type: 'boolean',
      name: 'pinned',
    },
    {
      type: 'string',
      name: 'icon',
    },
    {
      type: 'string',
      name: 'status',
      defaultValue: 'pending',
    },
    {
      type: 'json',
      name: 'options',
    },
  ],
});
