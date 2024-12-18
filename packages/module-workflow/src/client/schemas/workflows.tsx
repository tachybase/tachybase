import React from 'react';
import {
  CardItem,
  TableBlockProvider,
  useActionContext,
  useAPIClient,
  useCollectionRecordData,
  useDataBlockRequest,
  useDataBlockResource,
  useFilterByTk,
} from '@tachybase/client';
import { ISchema, observable, observer, useForm } from '@tachybase/schema';

import { message, Tabs } from 'antd';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';

import { lang, NAMESPACE, tval } from '../locale';
import { executionSchema } from './executions';

const tag = observable({ value: '' });

const dataSource = [
  {
    value: '0',
    label: '分类一',
  },
  {
    value: '1',
    label: '分类二',
  },
  {
    value: '2',
    label: '分类三',
  },
  {
    value: '3',
    label: '分类四',
  },
  {
    value: '4',
    label: '分类五',
  },
  {
    value: '5',
    label: '分类六',
  },
];

export const collectionWorkflows = {
  name: 'workflows',
  fields: [
    {
      type: 'string',
      name: 'title',
      interface: 'input',
      uiSchema: {
        title: '{{t("Name")}}',
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
        title: `{{t("Trigger type", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          options: `{{getTriggersOptions()}}`,
        },
        required: true,
      } as ISchema,
    },
    {
      type: 'array',
      name: 'tags',
      interface: 'multipleSelect',
      uiSchema: {
        title: '{{t("Tags")}}',
        type: 'array',
        enum: dataSource,
        'x-component': 'Select',
        'x-component-props': {
          mode: 'multiple',
        },
      } as ISchema,
    },
    {
      type: 'string',
      name: 'description',
      interface: 'textarea',
      uiSchema: {
        title: '{{t("Description")}}',
        type: 'string',
        'x-component': 'Input.TextArea',
      } as ISchema,
    },
    {
      type: 'boolean',
      name: 'enabled',
      interface: 'radioGroup',
      uiSchema: {
        title: `{{t("Status", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        enum: [
          { label: `{{t("On", { ns: "${NAMESPACE}" })}}`, value: true, color: '#52c41a' },
          { label: `{{t("Off", { ns: "${NAMESPACE}" })}}`, value: false },
        ],
        'x-component': 'Radio.Group',
        'x-decorator': 'FormItem',
        default: false,
      } as ISchema,
    },

    {
      type: 'number',
      name: 'allExecuted',
      interface: 'integer',
      uiSchema: {
        title: `{{t("Executed", { ns: "${NAMESPACE}" })}}`,
        type: 'number',
        'x-component': 'InputNumber',
        'x-decorator': 'FormItem',
      } as ISchema,
    },
    {
      type: 'object',
      name: 'options',
    },
    {
      name: 'updatedAt',
      type: 'date',
      interface: 'updatedAt',
      uiSchema: {
        type: 'datetime',
        title: tval('Updated at'),
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
      },
    },
    {
      name: 'updatedBy',
      type: 'belongsTo',
      interface: 'updatedBy',
      target: 'users',
      targetKey: 'id',
      foreignKey: 'updatedById',
      collectionName: 'workflows',
      uiSchema: {
        type: 'object',
        title: '{{t("Last updated by")}}',
        'x-component': 'AssociationField',
        'x-component-props': {
          fieldNames: {
            value: 'id',
            label: 'nickname',
          },
        },
        'x-read-pretty': true,
      },
    },
  ],
};

export const workflowFieldset: Record<string, ISchema> = {
  title: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  type: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
    default: 'general-action',
    'x-hidden': true,
  },
  sync: {
    type: 'boolean',
    title: `{{ t("Execute mode", { ns: "${NAMESPACE}" }) }}`,
    'x-decorator': 'FormItem',
    'x-component': 'SyncOptionSelect',
    'x-component-props': {
      options: [
        {
          label: `{{ t("Queue Mode", { ns: "${NAMESPACE}" }) }}`,
          value: false,
          tooltip: `{{ t("Will be executed in the background as a queued task.", { ns: "${NAMESPACE}" }) }}`,
        },
        {
          label: `{{ t("Transactional Mode", { ns: "${NAMESPACE}" }) }}`,
          value: true,
          tooltip: `{{ t("For user actions that require immediate feedback. Can not use asynchronous nodes in such mode, and it is not recommended to perform time-consuming operations under synchronous mode.", { ns: "${NAMESPACE}" }) }}`,
        },
      ],
    },
  },
  tags: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  enabled: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  description: {
    'x-component': 'CollectionField',
    'x-decorator': 'FormItem',
  },
  options: {
    type: 'object',
    'x-component': 'fieldset',
    properties: {
      deleteExecutionOnStatus: {
        type: 'array',
        title: `{{ t("Auto delete history when execution is on end status", { ns: "${NAMESPACE}" }) }}`,
        'x-decorator': 'FormItem',
        'x-component': 'ExecutionStatusSelect',
        'x-component-props': {
          multiple: true,
        },
      },
    },
  },
};

export const createWorkflow: ISchema = {
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
          'x-acl-action': `${collectionWorkflows.name}:create`,
          'x-decorator': 'FormBlockProvider',
          'x-use-decorator-props': 'useCreateFormBlockDecoratorProps',
          'x-decorator-props': {
            dataSource: 'main',
            collection: collectionWorkflows,
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
                title: workflowFieldset.title,
                tags: workflowFieldset.tags,
                type: workflowFieldset.type,
                sync: workflowFieldset.sync,
                description: workflowFieldset.description,
                options: workflowFieldset.options,
              },
            },
          },
        },
      },
    },
  },
};

export const updateWorkflow: ISchema = {
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
          'x-acl-action': `${collectionWorkflows.name}:update`,
          'x-decorator': 'FormBlockProvider',
          'x-use-decorator-props': 'useEditFormBlockDecoratorProps',
          'x-decorator-props': {
            action: 'get',
            dataSource: 'main',
            collection: collectionWorkflows,
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
                title: workflowFieldset.title,
                tags: workflowFieldset.tags,
                type: workflowFieldset.type,
                enabled: workflowFieldset.enabled,
                sync: workflowFieldset.sync,
                description: workflowFieldset.description,
                options: workflowFieldset.options,
              },
            },
          },
        },
      },
    },
  },
};
const revisionWorkflow: ISchema = {
  type: 'void',
  title: `{{t("Duplicate", { ns: "${NAMESPACE}" })}}`,
  'x-component': 'Action.Link',
  'x-component-props': {
    openSize: 'small',
  },
  properties: {
    modal: {
      type: 'void',
      title: `{{t("Duplicate to new workflow", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormV2',
      'x-component': 'Action.Modal',
      properties: {
        title: {
          type: 'string',
          title: '{{t("Title")}}',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        footer: {
          type: 'void',
          'x-component': 'Action.Modal.Footer',
          properties: {
            submit: {
              type: 'void',
              title: '{{t("Submit")}}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                useAction() {
                  const { t } = useTranslation();
                  const { refresh } = useDataBlockRequest();
                  const resource = useDataBlockResource();
                  const { setVisible } = useActionContext();
                  const filterByTk = useFilterByTk();
                  const { values } = useForm();
                  return {
                    async run() {
                      await resource.revision({ filterByTk, values });
                      message.success(t('Operation succeeded'));
                      refresh();
                      setVisible(false);
                    },
                  };
                },
              },
            },
            cancel: {
              type: 'void',
              title: '{{t("Cancel")}}',
              'x-component': 'Action',
              'x-use-component-props': 'useCancelActionProps',
            },
          },
        },
      },
    },
  },
};

const testWorkflow: ISchema = {
  type: 'void',
  title: `{{t("Test", { ns: "${NAMESPACE}" })}}`,
  'x-component': 'Action.Link',
  properties: {
    modal: {
      type: 'void',
      title: `{{t("Duplicate to new workflow", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormV2',
      'x-component': 'Action.Modal',
      properties: {
        params: {
          type: 'string',
          title: '{{t("Input")}}',
          'x-decorator': 'FormItem',
          default: { data: {}, ctx: {} },
          'x-component': 'Input.JSON',
          'x-component-props': {
            autoSize: {
              minRows: 20,
              maxRows: 50,
            },
          },
        },
        footer: {
          type: 'void',
          'x-component': 'Action.Modal.Footer',
          properties: {
            submit: {
              type: 'void',
              title: '{{t("Submit")}}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                useAction() {
                  const { t } = useTranslation();
                  const { refresh } = useDataBlockRequest();
                  const resource = useDataBlockResource();
                  const { setVisible } = useActionContext();
                  const filterByTk = useFilterByTk();
                  const { values } = useForm();
                  return {
                    async run() {
                      await resource.test({ filterByTk, values });
                      refresh();
                      setVisible(false);
                    },
                  };
                },
              },
            },
            cancel: {
              type: 'void',
              title: '{{t("Cancel")}}',
              'x-component': 'Action',
              'x-use-component-props': 'useCancelActionProps',
            },
          },
        },
      },
    },
  },
};

const TabCardItem = ({ children }) => {
  return (
    <Tabs
      type="card"
      onChange={(value) => {
        tag.value = value;
      }}
      items={[{ value: '', label: lang('All') }].concat(dataSource).map(({ label, value }, i) => {
        return {
          label: label,
          key: value,
          children: <CardItem>{children}</CardItem>,
        };
      })}
    />
  );
};

const TabTableBlockProvider = observer((props) => {
  const requestProps = {
    collection: collectionWorkflows,
    action: 'list',
    params: {
      filter: {
        current: true,
        type: {
          // TODO: 等工作流整理完成后, 去除这里的依赖审批 "approval" 字段
          $not: 'approval',
        },
      },
      sort: ['-initAt'],
    },
    rowKey: 'id',
  };

  if (tag.value) {
    // @ts-expect-error
    requestProps.params.filter.tags = {
      $anyOf: [tag.value],
    };
  }

  return <TableBlockProvider {...props} {...requestProps} />;
});

export const workflowSchema: ISchema = {
  type: 'void',
  properties: {
    provider: {
      type: 'void',
      'x-decorator': TabTableBlockProvider,
      'x-component': TabCardItem,
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
              default: {
                $and: [{ title: { $includes: '' } }],
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
              'x-action': 'refresh',
              'x-component': 'Action',
              'x-settings': 'actionSettings:refresh',
              'x-component-props': {
                icon: 'ReloadOutlined',
              },
              'x-use-component-props': 'useRefreshActionProps',
            },
            delete: {
              type: 'void',
              title: '{{t("Delete")}}',
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
            load: {
              type: 'void',
              title: `{{t("Load", { ns: "${NAMESPACE}" })}}`,
              'x-component': 'Action',
              'x-component-props': {
                icon: 'UploadOutlined',
                openSize: 'small',
              },
              properties: {
                modal: {
                  type: 'void',
                  title: `{{t("Load a workflow", { ns: "${NAMESPACE}" })}}`,
                  'x-decorator': 'FormV2',
                  'x-component': 'Action.Modal',
                  properties: {
                    title: {
                      type: 'string',
                      title: '{{t("Title")}}',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                    },
                    file: {
                      type: 'object',
                      title: '{{ t("File") }}',
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Upload.Attachment',
                      'x-component-props': {
                        action: 'attachments:create',
                        multiple: false,
                      },
                    },
                    footer: {
                      type: 'void',
                      'x-component': 'Action.Modal.Footer',
                      properties: {
                        submit: {
                          type: 'void',
                          title: '{{t("Submit")}}',
                          'x-component': 'Action',
                          'x-component-props': {
                            type: 'primary',
                            useAction() {
                              const { t } = useTranslation();
                              const api = useAPIClient();
                              const { refresh } = useDataBlockRequest();
                              const resource = useDataBlockResource();
                              const filterByTk = useFilterByTk();
                              const { setVisible } = useActionContext();
                              const { values } = useForm();
                              return {
                                async run() {
                                  const { data } = await api.request({
                                    url: values.file.url,
                                    baseURL: '/',
                                  });
                                  await resource.load({ filterByTk, values: { ...values, workflow: data } });
                                  message.success(t('Operation succeeded'));
                                  refresh();
                                  setVisible(false);
                                },
                              };
                            },
                          },
                        },
                        cancel: {
                          type: 'void',
                          title: '{{t("Cancel")}}',
                          'x-component': 'Action',
                          'x-use-component-props': 'useCancelActionProps',
                        },
                      },
                    },
                  },
                },
              },
            },
            create: createWorkflow,
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
              'x-component-props': {
                sorter: true,
              },
              title: '{{t("Name")}}',
              properties: {
                title: {
                  type: 'string',
                  'x-component': 'ColumnShowTitle',
                },
              },
            },
            tags: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                sorter: true,
                width: 20,
                align: 'center',
              },
              title: '{{t("Tags")}}',
              properties: {
                tags: {
                  type: 'array',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            showCollection: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              title: tval('Collection'),
              properties: {
                showCollection: {
                  type: 'string',
                  'x-component': 'ColumnShowCollection',
                },
              },
            },
            enabled: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 20,
                align: 'center',
              },
              properties: {
                enabled: {
                  type: 'boolean',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                  default: false,
                },
              },
            },
            allExecuted: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 20,
                align: 'center',
                style: {
                  display: 'grid',
                  placeItems: 'center',
                },
              },
              properties: {
                allExecuted: {
                  type: 'number',
                  'x-decorator': 'OpenDrawer',
                  'x-decorator-props': {
                    component: function Com(props) {
                      const record = useCollectionRecordData();
                      return React.createElement('a', {
                        'aria-label': `executed-${record.title}`,
                        ...props,
                      });
                    },
                  },
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                  properties: {
                    drawer: executionSchema,
                  },
                },
              },
            },
            updatedAt: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 20,
                align: 'center',
                style: {
                  display: 'grid',
                  placeItems: 'center',
                },
              },
              properties: {
                updatedAt: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            updatedBy: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 20,
                align: 'center',
                style: {
                  display: 'grid',
                  placeItems: 'center',
                },
              },
              properties: {
                updatedBy: {
                  type: 'string',
                  'x-collection-field': 'workflows.updatedBy',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            actions: {
              type: 'void',
              title: '{{ t("Actions") }}',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                fixed: 'right',
              },
              properties: {
                actions: {
                  type: 'void',
                  'x-component': 'Space',
                  'x-component-props': {
                    split: '|',
                  },
                  properties: {
                    configure: {
                      type: 'void',
                      'x-component': 'WorkflowLink',
                    },
                    update: updateWorkflow,
                    revision: revisionWorkflow,
                    test: testWorkflow,
                    delete: {
                      type: 'void',
                      title: '{{t("Delete")}}',
                      'x-action': 'destroy',
                      'x-component': 'Action.Link',
                      'x-use-component-props': 'useDestroyActionProps',
                      'x-component-props': {
                        confirm: {
                          title: "{{t('Delete record')}}",
                          content: "{{t('Are you sure you want to delete it?')}}",
                        },
                      },
                    },
                    dump: {
                      type: 'void',
                      title: '{{ t("Dump") }}',
                      'x-component': 'Action.Link',
                      'x-component-props': {
                        useAction() {
                          const { t } = useTranslation();
                          const resource = useDataBlockResource();
                          const filterByTk = useFilterByTk();

                          return {
                            async run() {
                              const { data } = await resource.dump({ filterByTk });
                              const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
                              saveAs(blob, data.data.title + '-' + data.data.key + '.json');
                              message.success(t('Operation succeeded'));
                            },
                          };
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
