import { CollectionOptions } from '@tachybase/database';

import { tval } from '../locale';

export const COLLECTION_NAME_MESSAGES = 'messages';

export default {
  dumpRules: 'required',
  name: COLLECTION_NAME_MESSAGES,
  title: tval('Site Messages'),
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
      name: 'title',
      interface: 'input',
      type: 'string',
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
      name: 'content',
      interface: 'input',
      type: 'string',
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
      name: 'collectionName',
      interface: 'input',
      type: 'string',
    },
    {
      name: 'jsonContent',
      interface: 'input',
      type: 'jsonb',
      uiSchema: {
        type: 'array',
        title: tval('Content'),
        'x-component': 'ShowJsonContent',
        'x-component-props': {
          style: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
      },
    },
    {
      type: 'jsonb',
      name: 'snapshot',
      defaultValue: {},
    },
    {
      name: 'read',
      type: 'boolean',
      interface: 'checkbox',
      defaultValue: false,
      description: tval('Read'),
      uiSchema: {
        'x-component-props': {
          showUnchecked: true,
        },
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
      name: 'user',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      type: 'belongsTo',
      interface: 'm2o',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
        title: tval('User'),
      },
      target: 'users',
      targetKey: 'id',
    },
    {
      name: 'schema',
      type: 'belongsTo',
      target: 'uiSchemas',
      targetKey: 'x-uid',
      foreignKey: 'schemaName',
      constraints: false,
    },
  ],
} as CollectionOptions;
