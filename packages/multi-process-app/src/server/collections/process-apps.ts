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
      type: 'uid',
      name: 'name', //数据库的表名
      primaryKey: true,
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
      name: 'remote', //拉取远程仓库,为空表示使用本地仓库运行
    },
    {
      type: 'string',
      name: 'host',
    },
    {
      type: 'number',
      name: 'port',
    },
    {
      type: 'number',
      name: 'pid',
    },
    // {
    //   type: 'boolean',
    //   name: 'close',
    // },
  ],
});
