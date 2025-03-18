import { ISchema, uid } from '@tachybase/schema';

import { NAMESPACE } from '../locale';

export const collectionFileManager = {
  name: 'storages',
  fields: [
    {
      type: 'integer',
      name: 'title',
      interface: 'input',
      uiSchema: {
        title: '{{t("Title")}}',
        type: 'string',
        'x-component': 'TextAreaWithGlobalScope',
        required: true,
      } as ISchema,
    },
    {
      type: 'string',
      name: 'name',
      interface: 'input',
      uiSchema: {
        title: `{{t("Storage name", { ns: "${NAMESPACE}" })}}`,
        descriptions: `{{t("Will be used for API", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'Input',
      } as ISchema,
    },
    {
      type: 'string',
      name: 'type',
      interface: 'select',
      uiSchema: {
        title: `{{t("Storage type", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'Select',
        required: true,
        enum: '{{ storageTypes }}',
      } as ISchema,
    },
    {
      type: 'string',
      name: 'baseUrl',
      interface: 'input',
      uiSchema: {
        title: `{{t("Storage base URL", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'TextAreaWithGlobalScope',
        required: true,
      } as ISchema,
    },
    {
      type: 'string',
      name: 'path',
      interface: 'input',
      uiSchema: {
        title: `{{t("Path", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'TextAreaWithGlobalScope',
      } as ISchema,
    },
    {
      type: 'boolean',
      name: 'default',
      interface: 'boolean',
      uiSchema: {
        // title: `{{t("Default storage", { ns: "${NAMESPACE}" })}}`,
        type: 'boolean',
        'x-component': 'Checkbox',
      } as ISchema,
    },
    {
      type: 'boolean',
      name: 'paranoid',
      interface: 'boolean',
      uiSchema: {
        // title: `{{t("Keep file in storage when destroy record", { ns: "${NAMESPACE}" })}}`,
        type: 'boolean',
        'x-component': 'Checkbox',
      } as ISchema,
    },
  ],
};

export const storageSchema: ISchema = {
  type: 'void',
  properties: {
    [uid()]: {
      type: 'void',
      'x-decorator': 'TableBlockProvider',
      'x-component': 'CardItem',
      'x-decorator-props': {
        collection: collectionFileManager,
        action: 'list',
        params: {
          pageSize: 50,
          sort: ['id'],
          appends: [],
        },
        rowKey: 'id',
      },
      properties: {
        actions: {
          type: 'void',
          'x-component': 'ActionBar',
          'x-component-props': {
            style: {
              marginBottom: 16,
            },
          },
          properties: {
            delete: {
              type: 'void',
              title: '{{ t("Delete") }}',
              'x-action': 'destroy',
              'x-decorator': 'ACLActionProvider',
              'x-component': 'Action',
              'x-use-component-props': 'useDestroyActionProps',
              'x-component-props': {
                icon: 'DeleteOutlined',
                confirm: {
                  title: "{{t('Delete record')}}",
                  content: "{{t('Are you sure you want to delete it?')}}",
                },
              },
            },
            create: {
              type: 'void',
              title: '{{t("Add new")}}',
              'x-component': 'CreateStorage',
              'x-component-props': {
                type: 'primary',
              },
            },
          },
        },
        table: {
          type: 'array',
          'x-component': 'TableV2',
          'x-use-component-props': 'useTableBlockProps',
          'x-component-props': {
            rowKey: 'id',
            rowSelection: {
              type: 'checkbox',
            },
          },
          properties: {
            title: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                title: {
                  type: 'number',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            name: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                name: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            default: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              title: `{{t("Default storage", { ns: "${NAMESPACE}" })}}`,
              properties: {
                default: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            actions: {
              type: 'void',
              title: '{{t("Actions")}}',
              'x-component': 'TableV2.Column',
              properties: {
                actions: {
                  type: 'void',
                  'x-component': 'Space',
                  'x-component-props': {
                    split: '|',
                  },
                  properties: {
                    update: {
                      type: 'void',
                      title: '{{t("Edit")}}',
                      'x-component': 'EditStorage',
                    },
                    delete: {
                      type: 'void',
                      title: '{{t("Delete")}}',
                      'x-action': 'destroy',
                      'x-decorator': 'ACLActionProvider',
                      'x-component': 'Action.Link',
                      'x-use-component-props': 'useDestroyActionProps',
                      'x-component-props': {
                        icon: 'DeleteOutlined',
                        confirm: {
                          title: "{{t('Delete record')}}",
                          content: "{{t('Are you sure you want to delete it?')}}",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
