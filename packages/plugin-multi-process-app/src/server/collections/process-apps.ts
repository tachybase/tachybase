import { defineCollection } from '@tachybase/database';

export default defineCollection({
  dumpRules: 'required',
  name: 'process_apps',
  autoGenId: false,
  sortable: 'sort',
  filterTargetKey: 'name',
  createdBy: true,
  updatedBy: true,
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      interface: 'id',
    },
    {
      type: 'boolean',
      name: 'enabled',
    },
    {
      type: 'string',
      name: 'displayName',
    },
    {
      type: 'string',
      name: 'cname', //域名前缀
      unique: true,
    },
    {
      type: 'string',
      name: 'remote',
    },
    {
      type: 'string',
      name: 'branch',
    },
    {
      type: 'number',
      name: 'port',
    },
    {
      type: 'number',
      name: 'pid',
    },
  ],
  indexes: [
    {
      unique: true,
      fields: ['database'],
    },
  ],
});
