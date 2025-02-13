import { ISchema, uid } from '@tachybase/schema';

import { NAMESPACE, tval } from '../locale';

export const apiLogsConfigCollection = {
  name: 'apiLogsConfig',
  fields: [
    {
      interface: 'input',
      type: 'string',
      name: 'name',
      uiSchema: {
        type: 'string',
        title: '{{t("Name")}}',
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'string',
      name: 'action',
      uiSchema: {
        type: 'string',
        title: `{{t("Action", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'boolean',
      type: 'boolean',
      name: 'apiConfig',
      uiSchema: {
        type: 'boolean',
        title: `{{t("Api audit", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Checkbox',
      } as ISchema,
    },
  ],
};

export const createApiConfig: ISchema = {
  type: 'void',
  'x-action': 'create',
  'x-acl-action': 'create',
  title: "{{t('Add new')}}",
  'x-component': 'Action',
  'x-decorator': 'ACLActionProvider',
  'x-component-props': {
    openMode: 'drawer',
    type: 'primary',
    component: 'CreateRecordAction',
    icon: 'PlusOutlined',
  },
  'x-align': 'right',
  'x-acl-action-props': {
    skipScopeCheck: true,
  },
  properties: {
    drawer: {
      type: 'void',
      title: '{{ t("Add record") }}',
      'x-component': 'Action.Container',
      'x-component-props': {
        className: 'tb-action-popup',
      },
      properties: {
        body: {
          type: 'void',
          'x-acl-action-props': {
            skipScopeCheck: true,
          },
          'x-acl-action': `${apiLogsConfigCollection.name}:create`,
          'x-decorator': 'FormBlockProvider',
          'x-use-decorator-props': 'useCreateFormBlockDecoratorProps',
          'x-decorator-props': {
            dataSource: 'main',
            collection: apiLogsConfigCollection,
          },
          'x-component': 'CardItem',
          properties: {
            form: {
              type: 'void',
              'x-component': 'FormV2',
              'x-use-component-props': 'useCreateFormBlockProps',
              properties: {
                actionBar: {
                  type: 'void',
                  'x-component': 'ActionBar',
                  'x-component-props': {
                    style: {
                      marginBottom: 24,
                    },
                  },
                  properties: {
                    cancel: {
                      title: '{{ t("Cancel") }}',
                      'x-component': 'Action',
                      'x-use-component-props': 'useCancelActionProps',
                    },
                    submit: {
                      title: '{{ t("Submit") }}',
                      'x-component': 'Action',
                      'x-use-component-props': 'useCreateActionProps',
                      'x-component-props': {
                        type: 'primary',
                        htmlType: 'submit',
                      },
                      'x-action-settings': {
                        assignedValues: {},
                        triggerWorkflows: [],
                        pageMode: false,
                      },
                    },
                  },
                },
                name: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-decorator': 'FormItem',
                },
                action: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-decorator': 'FormItem',
                },
                apiConfig: {
                  type: 'boolean',
                  default: true,
                  'x-component': 'CollectionField',
                  'x-decorator': 'FormItem',
                },
              },
            },
          },
        },
      },
    },
  },
};

export const apiLogsConfigPane: ISchema = {
  type: 'void',
  properties: {
    [uid()]: {
      type: 'void',
      'x-component': 'CardItem',
      'x-decorator': 'TableBlockProvider',
      'x-decorator-props': {
        collection: apiLogsConfigCollection,
        action: 'list',
        params: {
          filter: {},
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
            filter: {
              type: 'void',
              title: '{{ t("Filter") }}',
              'x-action': 'filter',
              'x-designer': 'Filter.Action.Designer',
              'x-component': 'Filter.Action',
              'x-use-component-props': 'useFilterActionProps',
              'x-component-props': {
                icon: 'FilterOutlined',
              },
              'x-align': 'left',
            },
            refresher: {
              type: 'void',
              title: '{{ t("Refresh") }}',
              'x-action': 'refresh',
              'x-component': 'Action',
              'x-use-component-props': 'useRefreshActionProps',
              'x-designer': 'Action.Designer',
              'x-component-props': {
                icon: 'ReloadOutlined',
              },
              'x-align': 'right',
            },
            delete: {
              type: 'void',
              title: '{{ t("Delete") }}',
              'x-action': 'destroy',
              'x-component': 'Action',
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
            // edit: {
            //   type: 'void',
            //   title: '{{ t("Update") }}',
            //   'x-action': 'update',
            //   'x-decorator': 'ACLActionProvider',
            //   'x-use-component-props': 'useUpdateActionProps',
            //   'x-component': 'Action',
            //   'x-component-props': {
            //     openMode: 'drawer',
            //     icon: 'EditOutlined',
            //   },
            // },
            create: createApiConfig,
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
            name: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                align: 'center',
              },
              properties: {
                name: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            action: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                align: 'center',
              },
              properties: {
                action: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            apiConfig: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                align: 'center',
              },
              properties: {
                apiConfig: {
                  type: 'boolean',
                  'x-component': 'CollectionField',
                },
              },
            },
            // actions: {
            //   type: 'void',
            //   title: '{{ t("Actions") }}',
            //   'x-component': 'TableV2.Column',
            //   'x-component-props': {
            //     width: 50,
            //   },
            //   properties: {
            //     actions: {
            //       type: 'void',
            //       'x-component': 'Space',
            //       'x-component-props': {
            //         split: '|',
            //       },
            //       properties: {
            //         delete: {
            //           type: 'void',
            //           title: '{{ t("Delete") }}',
            //           'x-action': 'destroy',
            //           'x-decorator': 'ACLActionProvider',
            //           'x-component': 'Action.Link',
            //           'x-use-component-props': 'useDestroyActionProps',
            //           'x-component-props': {
            //             icon: 'DeleteOutlined',
            //             confirm: {
            //               title: "{{t('Delete record')}}",
            //               content: "{{t('Are you sure you want to delete it?')}}",
            //             },
            //           },
            //         },
            //       },
            //     },
            //   },
            // },
          },
        },
      },
    },
  },
};
