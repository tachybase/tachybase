import { Collection } from '@tachybase/database';

export default {
  name: 'metricsConfig',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: '配置标题',
      required: true,
    },
    {
      name: 'resourceName',
      type: 'string',
      title: '资源名称',
      required: true,
    },
    {
      name: 'action',
      type: 'string',
      title: '操作名称',
      required: true,
    },
    {
      name: 'enabled',
      type: 'boolean',
      title: '是否启用',
      defaultValue: true,
    },
    {
      name: 'trackingOptions',
      type: 'json',
      title: '追踪选项',
      defaultValue: {
        meta: [],
        payload: [],
        filter: {},
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      title: '创建时间',
    },
    {
      name: 'updatedAt',
      type: 'date',
      title: '更新时间',
    },
  ],
  indexes: [
    {
      fields: ['resourceName', 'action'],
      unique: true,
    },
    {
      fields: ['enabled'],
    },
  ],
};
