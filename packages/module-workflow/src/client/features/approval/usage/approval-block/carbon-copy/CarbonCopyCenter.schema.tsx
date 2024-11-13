import React from 'react';
import { css, SchemaComponent } from '@tachybase/client';

import { NAMESPACE, tval } from '../../../locale';
import { ColumnApprovalStatus } from '../../approval-common/approval-columns/approvalStatus.column';
import { ColumnAction } from '../../approval-common/notice-columns/column.action';
import { ColumnNode } from '../../approval-common/notice-columns/column.node';
import { ColumnStatus } from '../../approval-common/notice-columns/column.status';
import { ColumnUser } from '../../approval-common/notice-columns/column.user';
import { ColumnWorkflow } from '../../approval-common/notice-columns/column.workflow';

const schemaStyles = {
  ActionbarStyle: css`
    margin-bottom: 16px;
  `,
  TableV2Style: css`
    .ant-table-cell {
      text-align: center;
    }
  `,
};

export const CarbonCopyCenter = () => (
  <SchemaComponent
    components={{
      ColumnNode,
      ColumnWorkflow,
      ColumnUser,
      ColumnStatus,
      ColumnAction,
      ColumnApprovalStatus,
    }}
    schema={schema}
  />
);

const schema = {
  type: 'void',
  name: 'approval-carbon-copy-center',
  properties: {
    actions: {
      type: 'void',
      'x-component': 'ActionBar',
      'x-component-props': {
        className: schemaStyles.ActionbarStyle,
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
        filterSummary: {
          type: 'void',
          'x-component': 'FilterSummary',
          'x-align': 'left',
        },
        refresher: {
          type: 'void',
          title: '{{ t("Refresh") }}',
          'x-action': 'refresh',
          'x-component': 'Action',
          'x-use-component-props': 'useRefreshActionProps',
          'x-designer': 'Action.Designer',
          'x-component-props': { icon: 'ReloadOutlined' },
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
          title: '{{t("Actions")}}',
          properties: {
            action: {
              'x-component': 'ColumnAction',
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
          'x-component-props': { width: 160 },
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
          'x-component-props': { width: 350 },
          title: tval('Summary'),
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
          'x-component-props': { width: 160 },
          properties: {
            createdBy: {
              type: 'string',
              'x-component': 'ColumnUser',
              'x-read-pretty': true,
            },
          },
        },
        user: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          'x-component-props': { width: 140 },
          title: tval('The Notified Person'),
          properties: {
            user: {
              'x-component': 'ColumnUser',
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
          title: '{{t("Status", { ns: "workflow" })}}',
          properties: {
            status: {
              'x-component': 'ColumnApprovalStatus',
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
          title: '{{t("Workflow", { ns: "workflow" })}}',
          properties: {
            workflow: {
              'x-component': 'ColumnWorkflow',
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
          title: `{{t("Task node", { ns: "${NAMESPACE}" })}}`,
          properties: {
            node: {
              'x-component': 'ColumnNode',
              'x-read-pretty': true,
            },
          },
        },
      },
    },
  },
};
