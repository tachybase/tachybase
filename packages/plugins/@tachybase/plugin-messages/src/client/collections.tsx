import { tval } from './locale';

export const useMessageCollection = () => {
  return {
    name: 'messages',
    title: tval('Messages'),
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
        interface: 'input',
        type: 'string',
        name: 'title',
        allowNull: false,
        unique: false,
        uiSchema: {
          type: 'string',
          title: '{{t("Title")}}',
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
          title: '{{t("Content")}}',
          'x-component': 'Input',
          required: true,
        },
      },
      {
        name: 'type',
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
      {
        collectionName: 'messages',
        name: 'collection',
        type: 'belongsTo',
        interface: 'm2o',
        target: 'collections',
        targetKey: 'name',
        sourceKey: 'id',
        foreignKey: 'collectionName',
        uiSchema: {
          type: 'object',
          title: tval('Collection'),
          'x-component': 'AssociationField',
          'x-component-props': { fieldNames: { value: 'name', label: 'title' }, ellipsis: true },
          'x-read-pretty': true,
        },
      },
      {
        name: 'user',
        collectionName: 'messages',
        type: 'belongsTo',
        interface: 'createdBy',
        targetKey: 'id',
        foreignKey: 'createdById',
        target: 'users',
        uiSchema: {
          type: 'object',
          title: tval('User'),
          'x-component': 'AssociationField',
          'x-component-props': { fieldNames: { value: 'id', label: 'nickname' }, ellipsis: true },
          'x-read-pretty': true,
        },
      },
    ],
  };
};

export const useAuditChangesCollection = () => {
  return {
    name: 'auditChanges',
    title: tval('Audit Changes'),
    fields: [],
  };
};

export const useCollectionsCollection = () => {
  return {
    name: 'collections',
    title: tval('Collections'),
    fields: [
      {
        name: 'name',
        type: 'string',
        interface: 'input',
        uiSchema: {
          title: tval('Collection name'),
          type: 'string',
          'x-component': 'Input',
          'x-component-props': { ellipsis: true },
        },
      },
      {
        name: 'title',
        type: 'string',
        interface: 'input',
        uiSchema: {
          title: tval('Collection display name'),
          type: 'string',
          'x-component': 'Input',
          'x-component-props': { ellipsis: true },
        },
      },
    ],
  };
};
