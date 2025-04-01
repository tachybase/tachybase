import { ISchema } from '@tachybase/schema';

import { NAMESPACE } from '../locale';

export const notificationCollection = {
  name: 'notificationConfigs',
  fields: [
    {
      name: 'id',
      interface: 'id',
      type: 'bigInt',
      autoIncrement: true,
      uiSchema: {
        type: 'number',
        title: '{{t("ID")}}',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'string',
      name: 'title',
      uiSchema: {
        type: 'string',
        title: `{{t("Notification title", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Input',
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'string',
      name: 'detail',
      uiSchema: {
        type: 'string',
        title: `{{t("Detail", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Input.TextArea',
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'number',
      name: 'duration',
      uiSchema: {
        type: 'number',
        title: `{{t("Notification duration", { ns: "${NAMESPACE}" })}}`,
        description: `{{t('Set to manual close when this item is empty', { ns: "${NAMESPACE}" })}}`,
        'x-component': 'InputNumber',
        'x-read-pretty': true,
        'x-component-props': {
          min: 0,
          max: 99999,
          suffix: 's',
        },
      } as ISchema,
    },
    {
      interface: 'select',
      type: 'string',
      name: 'level',
      uiSchema: {
        type: 'string',
        title: `{{t("Notification level", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Select',
        enum: [
          {
            value: 'info',
            label: 'info',
          },
          {
            value: 'success',
            label: 'success',
          },
          {
            value: 'error',
            label: 'error',
          },
          {
            value: 'warning',
            label: 'warning',
          },
          {
            value: 'open',
            label: 'open',
          },
        ],
      } as ISchema,
    },
  ],
};

export const NotificationFieldset: Record<string, ISchema> = {
  title: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  detail: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  duration: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  level: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
};

const createNotification: ISchema = {
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
      title: `{{ t("Add notification", { ns: "${NAMESPACE}" }) }}`,
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
          'x-acl-action': `notificationConfigs:create`,
          'x-decorator': 'FormBlockProvider',
          'x-use-decorator-props': 'useCreateFormBlockDecoratorProps',
          'x-decorator-props': {
            dataSource: 'main',
            collection: notificationCollection,
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
                ...NotificationFieldset,
              },
            },
          },
        },
      },
    },
  },
};

export const updateNotificationConfig: ISchema = {
  type: 'void',
  title: '{{ t("Edit") }}',
  'x-action': 'update',
  'x-component': 'Action.Link',
  'x-component-props': {
    openMode: 'drawer',
    icon: 'EditOutlined',
  },
  'x-decorator': 'ACLActionProvider',
  properties: {
    drawer: {
      type: 'void',
      title: `{{ t("Edit notification", { ns: "${NAMESPACE}" }) }}`,
      'x-component': 'Action.Container',
      'x-component-props': {
        className: 'tb-action-popup',
      },
      properties: {
        card: {
          type: 'void',
          'x-acl-action-props': {
            skipScopeCheck: false,
          },
          'x-acl-action': `${notificationCollection.name}:update`,
          'x-decorator': 'FormBlockProvider',
          'x-use-decorator-props': 'useEditFormBlockDecoratorProps',
          'x-decorator-props': {
            action: 'get',
            dataSource: 'main',
            collection: notificationCollection,
          },
          'x-component': 'CardItem',
          properties: {
            form: {
              type: 'void',
              'x-component': 'FormV2',
              'x-use-component-props': 'useEditFormBlockProps',
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
                      'x-use-component-props': 'useUpdateActionProps',
                      'x-component-props': {
                        type: 'primary',
                      },
                      'x-action-settings': {
                        isDeltaChanged: true,
                      },
                    },
                  },
                },
                ...NotificationFieldset,
              },
            },
          },
        },
      },
    },
  },
};

export const notificationSchema: ISchema = {
  type: 'void',
  properties: {
    notificationconfig: {
      type: 'void',
      'x-decorator': 'TableBlockProvider',
      'x-decorator-props': {
        collection: notificationCollection,
        action: 'list',
        params: {
          pageSize: 50,
        },
      },
      title: `{{t("Notification Config", { ns: "${NAMESPACE}" })}}`,
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
                actionCallback: '{{ dataSourceDeleteCallback }}',
              },
            },
            create: createNotification,
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
            id: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 100,
              },
              properties: {
                id: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            title: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                title: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-component-props': {
                    ellipsis: true,
                  },
                  'x-read-pretty': true,
                },
              },
            },
            detail: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                detail: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-component-props': {
                    ellipsis: true,
                  },
                  'x-read-pretty': true,
                },
              },
            },
            duration: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                duration: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-disabled': true,
                  // 'x-read-pretty': true,
                },
              },
            },
            level: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                level: {
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
                    send: {
                      type: 'void',
                      title: `{{t("Send", { ns: "${NAMESPACE}" })}}`,
                      'x-component': 'Action.Link',
                      'x-use-component-props': 'useSendActionProps',
                    },
                    update: updateNotificationConfig,
                    destroy: {
                      type: 'void',
                      title: '{{ t("Delete") }}',
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
