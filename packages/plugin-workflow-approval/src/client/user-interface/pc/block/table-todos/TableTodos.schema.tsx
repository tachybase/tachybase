import { css } from '@tachybase/client';

import { tval } from '../../../../locale';

export const schemaTableTodos = {
  type: 'void',
  name: 'todos',
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
          title: tval('Filter', { ns: 'core' }),
          'x-action': 'filter',
          'x-designer': 'Filter.Action.Designer',
          'x-component': 'Filter.Action',
          'x-use-component-props': 'useFilterActionProps',
          'x-component-props': {
            icon: 'FilterOutlined',
          },
          'x-align': 'left',
        },
        filterSummary: {
          type: 'void',
          'x-component': 'FuzzySearch',
          'x-align': 'left',
        },
        refresher: {
          type: 'void',
          title: tval('Refresh', { ns: 'core' }),
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
        tableLayout: 'fixed',
        className: css`
          .ant-table-cell {
            text-align: center;
          }
        `,
      },
      properties: {
        action: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 60,
          },
          title: tval('Actions', { ns: 'core' }),
          properties: {
            action: {
              'x-component': 'ViewCheckLink',
            },
          },
        },
        approvalId: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 80,
          },
          title: tval('ID'),
          properties: {
            approvalId: {
              type: 'number',
              'x-component': 'Input',
              'x-read-pretty': true,
            },
          },
        },
        createdAt: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 160,
          },
          properties: {
            createdAt: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
        summary: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 350,
          },
          title: tval('Approval Summary'),
          properties: {
            summary: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
        createdBy: {
          type: 'void',
          title: tval('Initiator'),
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 160,
          },
          properties: {
            createdBy: {
              type: 'string',
              'x-component': 'UserColumn',
              'x-read-pretty': true,
            },
          },
        },
        user: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 140,
          },
          title: tval('Assignee'),
          properties: {
            user: {
              'x-component': 'UserColumn',
              'x-read-pretty': true,
            },
          },
        },
        status: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: 100,
          },
          title: tval('Status', { ns: 'workflow' }),
          properties: {
            status: {
              'x-component': 'ApprovalRecordStatusColumn',
              'x-read-pretty': true,
            },
          },
        },
        workflow: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: null,
          },
          title: tval('Workflow', { ns: 'workflow' }),
          properties: {
            workflow: {
              'x-component': 'WorkflowColumn',
              'x-read-pretty': true,
            },
          },
        },
        node: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': {
            width: null,
          },
          title: tval('Task node'),
          properties: {
            node: {
              'x-component': 'NodeColumn',
              'x-read-pretty': true,
            },
          },
        },
      },
    },
  },
};
