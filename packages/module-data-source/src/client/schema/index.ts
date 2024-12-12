import { ISchema, uid } from '@tachybase/schema';

import { NAMESPACE } from '../locale';

export const statusEnum = [
  { value: 'loading', label: `{{t("Loading",{ns:"${NAMESPACE}"})}}`, color: 'orange' },
  { value: 'loading-failed', label: `{{t("Failed",{ns:"${NAMESPACE}"})}}`, color: 'red' },
  { value: 'loaded', label: `{{t("Loaded",{ns:"${NAMESPACE}"})}}`, color: 'green' },
  { value: 'reloading', label: `{{t("Reloading",{ns:"${NAMESPACE}"})}}`, color: 'orange' },
];
const collection = {
  name: 'dataSources',
  fields: [
    {
      type: 'string',
      name: 'key',
      interface: 'input',
      uiSchema: {
        title: `{{t("Data source name",{ ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'Input',
        required: true,
      } as ISchema,
    },
    {
      type: 'string',
      name: 'displayName',
      interface: 'input',
      uiSchema: {
        title: `{{t("Data source display name",{ ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'Input',
        required: true,
      } as ISchema,
    },
    {
      type: 'string',
      name: 'type',
      interface: 'select',
      uiSchema: {
        title: `{{t("Type", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'Select',
        enum: '{{types}}',
      } as ISchema,
    },
    {
      type: 'string',
      name: 'status',
      interface: 'select',
      uiSchema: {
        title: `{{t("Status", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'Select',
        enum: statusEnum,
      } as ISchema,
    },
    {
      type: 'boolean',
      name: 'enabled',
      uiSchema: {
        type: 'boolean',
        title: '{{t("Enabled")}}',
        'x-component': 'Checkbox',
      },
    },
  ],
};

export const databaseConnectionSchema: ISchema = {
  type: 'void',
  properties: {
    [uid()]: {
      type: 'void',
      'x-component': 'CardItem',
      'x-decorator': 'TableBlockProvider',
      'x-decorator-props': {
        collection: collection,
        action: 'list',
        params: {
          pageSize: 50,
          appends: [],
        },
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
            refresh: {
              type: 'void',
              title: '{{ t("Refresh") }}',
              'x-component': 'Action',
              'x-use-component-props': 'useRefreshActionProps',
              'x-component-props': {
                icon: 'ReloadOutlined',
              },
            },
            delete: {
              type: 'void',
              title: '{{ t("Delete") }}',
              'x-component': 'Action',
              'x-action': 'destroy',
              'x-decorator': 'ACLActionProvider',
              'x-use-component-props': 'useBulkDestroyActionProps',
              'x-component-props': {
                icon: 'DeleteOutlined',
                confirm: {
                  title: "{{t('Delete')}}",
                  content: "{{t('Are you sure you want to delete it?')}}",
                },
              },
            },
            create: {
              type: 'void',
              title: '{{t("Add new")}}',
              'x-component': 'CreateDatabaseConnectAction',
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
            rowKey: 'key',
            rowSelection: {
              type: 'checkbox',
            },
          },
          properties: {
            key: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                key: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            displayName: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                displayName: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            type: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                type: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            status: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                status: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            enabled: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                enabled: {
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
                    // split: '|',
                  },
                  properties: {
                    view: {
                      type: 'void',
                      title: '{{t("View")}}',
                      'x-component': 'ViewDatabaseConnectionAction',
                      'x-component-props': {
                        type: 'primary',
                      },
                    },
                    update: {
                      type: 'void',
                      title: '{{t("Edit")}}',
                      'x-component': 'EditDatabaseConnectionAction',
                      'x-component-props': {
                        type: 'primary',
                      },
                      'x-reactions': ['{{useIsAbleDelete($self)}}'],
                    },
                    delete: {
                      type: 'void',
                      title: '{{ t("Delete") }}',
                      'x-component': 'Action.Link',
                      'x-component-props': {
                        confirm: {
                          title: '{{t("Delete")}}',
                          content: '{{t("Are you sure you want to delete it?")}}',
                        },
                        useAction: '{{useDestroyAction}}',
                      },
                      'x-reactions': ['{{useIsAbleDelete($self)}}'],
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
