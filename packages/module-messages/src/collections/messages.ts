import { CollectionOptions } from '@tachybase/database';

import { tval } from '../locale';

export default {
  dumpRules: 'required',
  name: 'messages',
  title: tval('In-site messages'),
  sortable: true,
  createdBy: true,
  updatedBy: true,
  logging: true,
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
      name: 'createdAt',
      interface: 'createdAt',
      type: 'date',
      field: 'createdAt',
      uiSchema: {
        type: 'datetime',
        title: '{{t("Created at")}}',
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
        'x-read-pretty': true,
      },
    },
    {
      interface: 'input',
      type: 'string',
      name: 'title',
      allowNull: false,
      unique: false,
      uiSchema: {
        type: 'string',
        title: tval('Title'),
        'x-component': 'Input',
        required: true,
      },
    },
    {
      interface: 'input',
      type: 'string',
      name: 'content',
      allowNull: false,
      unique: false,
      uiSchema: {
        type: 'string',
        title: tval('Content'),
        'x-component': 'Input',
        required: true,
      },
    },
    {
      name: 'read',
      type: 'boolean',
      interface: 'checkbox',
      description: tval('Read'),
      uiSchema: {
        'x-component-props': { showUnchecked: true },
        type: 'boolean',
        'x-component': 'Checkbox',
        title: tval('Read'),
      },
    },
    {
      name: 'userId',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: {
        type: 'number',
        title: 'userId',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      name: 'user',
      type: 'belongsTo',
      interface: 'm2o',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': { multiple: false, fieldNames: { label: 'id', value: 'id' } },
        title: tval('User'),
      },
      target: 'users',
      targetKey: 'id',
    },
    {
      type: 'belongsTo',
      name: 'schema',
      target: 'uiSchemas',
      targetKey: 'x-uid',
      foreignKey: 'schemaName',
      constraints: false,
    },
  ],
} as CollectionOptions;
