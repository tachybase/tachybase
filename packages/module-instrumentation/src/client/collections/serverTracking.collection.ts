import { ISchema } from '@tachybase/schema';

import { NAMESPACE, tval } from '../locale';

export const serverTrackingCollection = {
  name: 'serverTracking',
  title: tval('server Tracking'),
  fields: [
    {
      name: 'createdAt',
      type: 'date',
      interface: 'createdAt',
      uiSchema: {
        type: 'datetime',
        title: tval('Created at'),
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
          ellipsis: true,
        },
        'x-read-pretty': true,
      },
    },
    {
      name: 'action',
      type: 'string',
      interface: 'select',
      uiSchema: {
        type: 'string',
        title: tval('Action type'),
        'x-component': 'Select',
        'x-component-props': { ellipsis: true },
        'x-read-pretty': true,
        enum: [
          { label: tval('Create record'), value: 'create', color: 'lime' },
          { label: tval('Update record'), value: 'update', color: 'gold' },
          { label: tval('Delete record'), value: 'destroy', color: 'magenta' },
        ],
      },
    },
    {
      name: 'recordId',
      type: 'string',
      interface: 'input',
      uiSchema: {
        title: tval('Record ID'),
        type: 'string',
        'x-component': 'Input',
        'x-component-props': { ellipsis: true },
      },
    },
    // {
    //   collectionName: 'serverTracking',
    //   name: 'collection',
    //   type: 'belongsTo',
    //   interface: 'm2o',
    //   target: 'collections',
    //   targetKey: 'name',
    //   sourceKey: 'id',
    //   foreignKey: 'collectionName',
    //   uiSchema: {
    //     type: 'object',
    //     title: tval('Collection'),
    //     'x-component': 'AssociationField',
    //     'x-component-props': { fieldNames: { value: 'name', label: 'title' }, ellipsis: true },
    //     'x-read-pretty': true,
    //   },
    // },
    {
      name: 'collectionName',
      type: 'string',
      interface: 'string',
      uiSchema: {
        type: 'string',
        title: tval('Collection name'),
        'x-component': 'Input',
      },
    },
    {
      name: 'user',
      collectionName: 'serverTracking',
      type: 'belongsTo',
      interface: 'createdBy',
      targetKey: 'id',
      foreignKey: 'createdById',
      target: 'users',
      uiSchema: {
        type: 'object',
        title: tval('User'),
        'x-component': 'AssociationField',
        'x-component-props': { fieldNames: { value: 'id', label: 'nickname' } },
        'x-read-pretty': true,
      },
    },
    // {
    //   name: 'changes',
    //   collectionName: 'apiLogs',
    //   type: 'hasMany',
    //   interface: 'subTable',
    //   target: 'apiChanges',
    //   foreignKey: 'apiLogId',
    //   targetKey: 'id',
    //   uiSchema: {
    //     type: 'object',
    //     title: tval('Details of changes'),
    //   },
    // },
    {
      type: 'bigInt',
      name: 'id',
      interface: 'number',
      uiSchema: { type: 'number', title: 'ID', 'x-component': 'InputNumber' },
    },
  ],
};
