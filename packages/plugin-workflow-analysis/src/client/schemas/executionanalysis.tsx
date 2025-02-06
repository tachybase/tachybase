import { dataSource, useActionContext } from '@tachybase/client';
import { ExecutionStatusOptions, getWorkflowDetailPath } from '@tachybase/module-workflow/client';
import { ISchema, uid } from '@tachybase/schema';

import { Link } from 'react-router-dom';

import { NAMESPACE, tval } from '../locale';

export const ExecutionsCollection = {
  name: 'executions',
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
      interface: 'm2o',
      type: 'belongsTo',
      name: 'workflow',
      target: 'workflows',
      targetKey: 'workflowId',
      foreignKey: 'id',
      collectionName: 'workflows',
      uiSchema: {
        type: 'object',
        title: `{{t("Workflow title", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'AssociationField',
        'x-component-props': {
          fieldNames: {
            value: 'title',
            label: 'title',
          },
        },
      } as ISchema,
      // uiSchema: {
      //   type: 'string',
      //   title: `{{t("Workflow title", { ns: "${NAMESPACE}" })}}`,
      // ['x-component']({ value }) {
      //   const title = value?.title;
      //   return <span style={{ textAlign: 'left', cursor: 'pointer' }}>{title}</span>;
      // },
      // } as ISchema,
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
      name: 'executionCost',
      uiSchema: {
        type: 'bigInt',
        title: `{{t("Execution time", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    // {
    //   interface: 'integer',
    //   type: 'bigInt',
    //   name: 'workflowId',
    //   uiSchema: {
    //     type: 'number',
    //     title: `{{t("Version", { ns: "${NAMESPACE}" })}}`,
    //     ['x-component']({ value }) {
    //       const { setVisible } = useActionContext();
    //       return (
    //         <Link to={getWorkflowDetailPath(value)} onClick={() => setVisible(false)}>
    //           {' '}
    //           {`#${value}`}
    //         </Link>
    //       );
    //     },
    //   } as ISchema,
    // },
    {
      type: 'number',
      name: 'status',
      interface: 'select',
      uiSchema: {
        title: `{{t("Status", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        enum: ExecutionStatusOptions,
      } as ISchema,
    },
  ],
};

export const collectionWorkflows = {
  name: 'workflows',
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
  ],
};

export const ExecutionsPane: ISchema = {
  type: 'void',
  properties: {
    [uid()]: {
      type: 'void',
      'x-component': 'CardItem',
      'x-decorator': 'TableBlockProvider',
      'x-decorator-props': {
        collection: ExecutionsCollection,
        action: 'list',
        params: {
          // appends: ['workflow.title', 'workflow.id'],
          pageSize: 20,
          sort: ['-createdAt'],
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
                      'x-component': 'ExecutionLink',
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
              properties: {
                workflow: {
                  type: 'string',
                  'x-collection-field': 'executions.workflow',
                  'x-component': 'CollectionField',
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
            executionCost: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                sorter: true,
                width: 50,
              },
              properties: {
                executionCost: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            workflowId: {
              type: 'void',
              title: `{{t("Version", { ns: "${NAMESPACE}" })}}`,
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
              },
              properties: {
                workflowId: {
                  type: 'number',
                  'x-component': 'executionVersionColumn',
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
                  'x-decorator': 'ExecutionStatusColumn',
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
