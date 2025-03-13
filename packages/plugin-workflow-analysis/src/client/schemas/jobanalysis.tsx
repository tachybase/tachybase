import { JobStatusOptions } from '@tachybase/module-workflow/client';
import { ISchema, uid } from '@tachybase/schema';

import { NAMESPACE, tval } from '../locale';

export const JobsCollection = {
  name: 'jobs',
  fields: [
    {
      interface: 'id',
      type: 'bigInt',
      name: 'id',
      uiSchema: {
        type: 'number',
        title: '{{t("ID")}}',
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'createdAt',
      type: 'datetime',
      name: 'createdAt',
      uiSchema: {
        type: 'datetime',
        title: `{{t("Triggered at", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'DatePicker',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'integer',
      type: 'bigInt',
      name: 'cost',
      uiSchema: {
        type: 'bigInt',
        title: `{{t("Execution time(ms)", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      type: 'number',
      name: 'status',
      interface: 'select',
      uiSchema: {
        title: `{{t("Status", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        enum: JobStatusOptions,
      } as ISchema,
    },
    {
      name: 'node',
      type: 'belongsTo',
      interface: 'm2o',
      target: 'node',
      targetKey: 'id',
      foreignKey: 'nodeId',
      collectionName: 'node',
      uiSchema: {
        type: 'object',
        title: tval('Node'),
        'x-component': 'AssociationField',
        'x-component-props': {
          fieldNames: {
            value: 'title',
            label: 'title',
          },
        },
      } as ISchema,
    },
  ],
};

export const nodesCollection = {
  name: 'node',
  fields: [
    {
      interface: 'id',
      type: 'bigInt',
      name: 'id',
      uiSchema: {
        type: 'number',
        title: tval('Node ID'),
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'string',
      name: 'title',
      uiSchema: {
        type: 'string',
        title: tval('Node title'),
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      name: 'workflow',
      type: 'belongsTo',
      interface: 'm2m',
      target: 'workflow',
      targetKey: 'id',
      foreignKey: 'workflowId',
      collectionName: 'workflow',
      uiSchema: {
        type: 'object',
        title: tval('Workflow'),
        'x-component': 'AssociationField',
        'x-component-props': {
          fieldNames: {
            value: 'title',
            label: 'title',
          },
        },
      } as ISchema,
    },
  ],
};

export const workflowCollection = {
  name: 'workflow',
  fields: [
    {
      interface: 'id',
      type: 'bigInt',
      name: 'id',
      uiSchema: {
        type: 'number',
        title: tval('Workflow ID'),
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'string',
      name: 'title',
      uiSchema: {
        type: 'string',
        title: tval('Workflow title'),
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
  ],
};

export const JobsPane: ISchema = {
  type: 'void',
  properties: {
    [uid()]: {
      type: 'void',
      'x-component': 'CardItem',
      'x-decorator': 'TableBlockProvider',
      'x-decorator-props': {
        collection: JobsCollection,
        action: 'list',
        params: {
          pageSize: 20,
          sort: ['-createdAt'],
          appends: ['node.workflow', 'node'],
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
          },
        },
        table: {
          type: 'array',
          'x-component': 'TableV2',
          'x-use-component-props': 'useTableBlockProps',
          'x-component-props': {
            rowKey: 'id',
          },
          properties: {
            actions: {
              type: 'void',
              title: '{{ t("Actions") }}',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
              },
              properties: {
                actions: {
                  type: 'void',
                  'x-component': 'Space',
                  'x-component-props': {
                    split: '|',
                  },
                  properties: {
                    link: {
                      type: 'void',
                      'x-component': 'jobsLink',
                    },
                  },
                },
              },
            },
            id: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                sorter: true,
                width: 50,
              },
              properties: {
                id: {
                  type: 'number',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            node: {
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
              title: tval('Node title'),
              properties: {
                node: {
                  type: 'string',
                  'x-collection-field': 'jobs.node',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            workflow: {
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
              title: tval('Workflow title'),
              properties: {
                workflow: {
                  type: 'string',
                  'x-component': 'jobWorkflowTitleColumn',
                  'x-read-pretty': true,
                },
              },
            },
            createdAt: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                sorter: true,
                width: 100,
              },
              properties: {
                createdAt: {
                  type: 'datetime',
                  'x-component': 'CollectionField',
                  'x-component-props': {
                    showTime: true,
                  },
                  'x-read-pretty': true,
                },
              },
            },
            cost: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                sorter: true,
                width: 50,
              },
              properties: {
                cost: {
                  type: 'bigInt',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            version: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
              },
              title: '{{ t("Version") }}',
              properties: {
                version: {
                  type: 'number',
                  'x-component': 'jobVersionColumn',
                  'x-read-pretty': true,
                },
              },
            },
            status: {
              type: 'void',
              title: `{{t("Status", { ns: "${NAMESPACE}" })}}`,
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                sorter: true,
                width: 50,
              },
              properties: {
                status: {
                  type: 'number',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
          },
        },
      },
    },
  },
};
