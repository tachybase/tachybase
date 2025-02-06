import React, { useEffect } from 'react';
import {
  ExtendCollectionsProvider,
  SchemaComponent,
  TableBlockProvider,
  useCollectionRecordData,
  useDataBlockResource,
  usePlugin,
  WorkflowSelect,
} from '@tachybase/client';
import { CodeMirror } from '@tachybase/components';
import {
  ExecutionLink,
  executionSchema,
  ExecutionStatusColumn,
  ExecutionTime,
  OpenDrawer,
} from '@tachybase/module-workflow/client';
import { ISchema, useField, useForm } from '@tachybase/schema';

import { Button, Space } from 'antd';

import ModuleEventSourceClient from '..';
import { lang } from '../locale';
import { dispatchers } from './collections/dispatchers';

// TODO
export const ExecutionResourceProvider = ({ params, filter = {}, ...others }) => {
  const webhook = useCollectionRecordData();
  const props = {
    ...others,
    params: {
      ...params,
      filter: {
        ...params?.filter,
        key: webhook.workflowKey,
      },
    },
  };

  return <TableBlockProvider {...props} />;
};

export const useTestActionProps = () => {
  const form = useForm();
  const webhook = useCollectionRecordData();
  const resource = useDataBlockResource();
  return {
    async onClick() {
      const res = await resource.test({
        values: {
          body: JSON.parse(form.values.body || '{}'),
          params: JSON.parse(form.values.params || '{}'),
          name: webhook.name,
        },
      });
      alert(JSON.stringify(res.data));
    },
  };
};

const properties = {
  name: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'webhooks.name',
    'x-component-props': {},
  },
  enabled: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'webhooks.enabled',
    'x-component-props': {},
  },
  workflowKey: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'webhooks.workflowKey',
  },
  type: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'webhooks.type',
    'x-component-props': {},
  },

  // resourceName: {
  //   type: 'string',
  //   'x-component': 'CollectionField',
  //   'x-decorator': 'FormItem',
  //   'x-collection-field': 'webhooks.resourceName',
  //   'x-reactions': [
  //     {
  //       dependencies: ['.type'],
  //       fulfill: {
  //         state: {
  //           hidden:
  //             '{{ $deps[0] !== "action" && $deps[0] !== "resource" && $deps[0] !== "beforeResource" && $deps[0] !== "afterResource" }}',
  //         },
  //       },
  //     },
  //   ],
  //   'x-component-props': {},
  // },
  // triggerOnAssociation: {
  //   type: 'string',
  //   'x-component': 'CollectionField',
  //   'x-decorator': 'FormItem',
  //   'x-collection-field': 'webhooks.triggerOnAssociation',
  //   'x-reactions': [
  //     {
  //       dependencies: ['.type'],
  //       fulfill: {
  //         state: {
  //           hidden:
  //             '{{ $deps[0] !== "action" && $deps[0] !== "resource" && $deps[0] !== "beforeResource" && $deps[0] !== "afterResource" }}',
  //         },
  //       },
  //     },
  //   ],
  //   'x-component-props': {},
  // },
  // actionName: {
  //   type: 'string',
  //   'x-component': 'CollectionField',
  //   'x-decorator': 'FormItem',
  //   'x-collection-field': 'webhooks.actionName',
  //   'x-reactions': [
  //     {
  //       dependencies: ['.type'],
  //       fulfill: {
  //         state: {
  //           hidden:
  //             '{{ $deps[0] !== "action" && $deps[0] !== "resource" && $deps[0] !== "beforeResource" && $deps[0] !== "afterResource"}}',
  //         },
  //       },
  //     },
  //   ],
  //   'x-component-props': {},
  // },
  // eventName: {
  //   type: 'string',
  //   'x-component': 'CollectionField',
  //   'x-decorator': 'FormItem',
  //   'x-reactions': [
  //     {
  //       dependencies: ['.type'],
  //       fulfill: {
  //         state: {
  //           hidden: '{{ $deps[0] !== "databaseEvent" && $deps[0] !== "applicationEvent" }}',
  //         },
  //       },
  //     },
  //   ],
  //   'x-component-props': {},
  // },
  options: {
    type: 'object',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'webhooks.options',
  },
  code: {
    type: 'string',
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    'x-decorator-props': {
      tooltip: 'ctx.request\nctx.body\nlib.JSON\nlib.Math\nlib.dayjs',
    },
    'x-collection-field': 'webhooks.code',
  },
};

const createForm: ISchema = {
  type: 'void',
  'x-acl-action-props': {
    skipScopeCheck: true,
  },
  'x-acl-action': 'webhooks:create',
  'x-decorator': 'FormBlockProvider',
  'x-use-decorator-props': 'useCreateFormBlockDecoratorProps',
  'x-decorator-props': {
    dataSource: 'main',
    collection: dispatchers.name,
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
              marginBottom: 'var(--tb-spacing)',
            },
          },
          properties: {
            submit: {
              title: '{{t("Submit")}}',
              'x-action': 'submit',
              'x-component': 'Action',
              'x-use-component-props': 'useCreateActionProps',
              'x-component-props': {
                type: 'primary',
                htmlType: 'submit',
              },
              type: 'void',
            },
          },
        },
        ...properties,
      },
    },
  },
};

const editAction: ISchema = {
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
      title: '{{ t("Edit record") }}',
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
          'x-acl-action': 'webhooks:update',
          'x-decorator': 'FormBlockProvider',
          'x-use-decorator-props': 'useEditFormBlockDecoratorProps',
          'x-decorator-props': {
            action: 'get',
            dataSource: 'main',
            collection: dispatchers,
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
                      marginBottom: 'var(--tb-spacing)',
                    },
                  },
                  properties: {
                    submit: {
                      title: '{{ t("Submit") }}',
                      'x-action': 'submit',
                      'x-component': 'Action',
                      'x-use-component-props': 'useUpdateActionProps',
                      'x-component-props': {
                        type: 'primary',
                        htmlType: 'submit',
                      },
                      'x-action-settings': {
                        triggerWorkflows: [],
                        onSuccess: {
                          manualClose: false,
                          redirecting: false,
                          successMessage: '{{t("Updated successfully")}}',
                        },
                        isDeltaChanged: false,
                      },
                      type: 'void',
                    },
                  },
                },
                ...properties,
              },
            },
          },
        },
      },
    },
  },
};

const deleteAction: ISchema = {
  title: '{{ t("Delete") }}',
  'x-action': 'destroy',
  'x-component': 'Action.Link',
  'x-use-component-props': 'useDestroyActionProps',
  'x-component-props': {
    icon: 'DeleteOutlined',
    confirm: {
      title: "{{t('Delete record')}}",
      content: "{{t('Are you sure you want to delete it?')}}",
    },
  },
  'x-action-settings': {
    triggerWorkflows: [],
  },
  'x-decorator': 'ACLActionProvider',
  type: 'void',
};

const testAction: ISchema = {
  type: 'void',
  title: '{{ t("Test") }}',
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
      title: '{{ t("Edit record") }}',
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
          'x-acl-action': 'webhooks:update',
          'x-decorator': 'FormBlockProvider',
          'x-decorator-props': {
            action: 'get',
            dataSource: 'main',
            collection: dispatchers.name,
          },
          'x-component': 'CardItem',
          properties: {
            testForm: {
              type: 'void',
              'x-component': 'FormV2',
              properties: {
                actionBar: {
                  type: 'void',
                  'x-component': 'ActionBar',
                  'x-component-props': {
                    style: {
                      marginBottom: 'var(--tb-spacing)',
                    },
                  },
                  properties: {
                    submit: {
                      title: '{{ t("Submit") }}',
                      'x-action': 'submit',
                      'x-component': 'Action',
                      'x-use-component-props': 'useTestActionProps',
                      'x-component-props': {
                        type: 'primary',
                        htmlType: 'submit',
                      },
                      'x-action-settings': {
                        triggerWorkflows: [],
                        onSuccess: {
                          manualClose: false,
                          redirecting: false,
                          successMessage: '{{t("Updated successfully")}}',
                        },
                        isDeltaChanged: false,
                      },
                      type: 'void',
                    },
                  },
                },
                params: {
                  type: 'string',
                  'x-component': 'CodeMirror',
                  'x-component-props': {
                    defaultValue: '{}',
                  },
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    label: 'query',
                  },
                },
                body: {
                  type: 'string',
                  'x-component': 'CodeMirror',
                  'x-component-props': {
                    defaultValue: '{}',
                  },
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    label: 'body',
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

const schema: ISchema = {
  type: 'void',
  properties: {
    table: {
      type: 'void',
      'x-decorator': 'TableBlockProvider',
      'x-acl-action': 'webhooks:list',
      'x-use-decorator-props': 'useTableBlockDecoratorProps',
      'x-decorator-props': {
        collection: dispatchers,
        dataSource: 'main',
        action: 'list',
        params: {
          pageSize: 20,
        },
        rowKey: 'id',
        showIndex: true,
        dragSort: false,
      },
      'x-component': 'CardItem',
      'x-filter-targets': [],
      properties: {
        actions: {
          type: 'void',
          'x-component': 'ActionBar',
          'x-component-props': {
            style: {
              marginBottom: 'var(--tb-spacing)',
            },
          },
          properties: {
            filter: {
              type: 'void',
              title: '{{ t("Filter") }}',
              default: {
                $and: [{ name: { $includes: '' } }],
              },
              'x-action': 'filter',
              'x-component': 'Filter.Action',
              'x-use-component-props': 'useFilterActionProps',
              'x-component-props': {
                icon: 'FilterOutlined',
              },
              'x-align': 'left',
            },
            refresh: {
              type: 'void',
              title: '{{ t("Refresh") }}',
              'x-component': 'Action',
              'x-component-props': {
                icon: 'ReloadOutlined',
              },
              'x-use-component-props': 'useRefreshActionProps',
            },
            create: {
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
                    form: createForm,
                  },
                },
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
            nameColumn: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
              },
              properties: {
                name: {
                  'x-collection-field': 'webhooks.name',
                  'x-component': 'CollectionField',
                  'x-component-props': {
                    ellipsis: true,
                  },
                  'x-read-pretty': true,
                  'x-decorator': null,
                  'x-decorator-props': {
                    labelStyle: {
                      display: 'none',
                    },
                  },
                },
              },
            },
            enabledColumn: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 20,
              },
              properties: {
                enabled: {
                  type: 'boolean',
                  'x-collection-field': 'webhooks.enabled',
                  'x-component': 'CollectionField',
                  'x-component-props': {
                    ellipsis: true,
                  },
                  'x-read-pretty': true,
                  'x-decorator': null,
                  'x-decorator-props': {
                    labelStyle: {
                      display: 'none',
                    },
                  },
                },
              },
            },
            workflowKeyColumn: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 20,
              },
              properties: {
                workflowKey: {
                  'x-collection-field': 'webhooks.workflowKey',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                  'x-decorator': 'OpenDrawer',
                  'x-decorator-props': {
                    component: function Com({ children, onClick }) {
                      const webhook = useCollectionRecordData();
                      return (
                        <Space size="small">
                          {children}
                          {webhook.workflowKey ? (
                            <Button type="link" onClick={onClick} style={{ padding: 0, marginLeft: '-4px' }}>
                              ({lang('View executions')})
                            </Button>
                          ) : null}
                        </Space>
                      );
                    },
                  },
                  properties: {
                    drawer: executionSchema,
                  },
                },
              },
            },
            typeColumn: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 20,
              },
              properties: {
                type: {
                  'x-collection-field': 'webhooks.type',
                  'x-component': 'CollectionField',
                  'x-component-props': {},
                  'x-read-pretty': true,
                  'x-decorator': null,
                  'x-decorator-props': {
                    labelStyle: {
                      display: 'none',
                    },
                  },
                },
              },
            },
            actionColumn: {
              type: 'void',
              title: '{{ t("Actions") }}',
              'x-decorator': 'TableV2.Column.ActionBar',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 150,
                fixed: 'right',
              },
              'x-action-column': 'actions',
              properties: {
                space: {
                  type: 'void',
                  'x-component': 'Space',
                  properties: {
                    editAction,
                    deleteAction,
                    testAction,
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

const useTypeOptions = (type) => {
  const plugin = usePlugin(ModuleEventSourceClient);
  if (!type) return {};

  const trigger = plugin.triggers.get(type);
  if (!trigger?.options) return {};

  return {
    type: 'object',
    properties: trigger.options,
  };
};

export const WebhookManager = () => {
  const plugin = usePlugin(ModuleEventSourceClient);
  const typeList = [];
  for (const type of plugin.triggers.getKeys()) {
    typeList.push({
      label: plugin.triggers.get(type).title,
      value: type,
    });
  }
  return (
    <ExtendCollectionsProvider collections={[dispatchers]}>
      <SchemaComponent
        name="eventSource"
        schema={schema}
        scope={{
          useTestActionProps,
          typeList,
          useTypeOptions,
        }}
        components={{
          ExecutionStatusColumn,
          ExecutionResourceProvider,
          OpenDrawer,
          ExecutionLink,
          ExecutionTime,
          WorkflowSelect,
          CodeMirror,
        }}
      />
    </ExtendCollectionsProvider>
  );
};
