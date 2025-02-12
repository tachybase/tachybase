import { useActionContext, useDataBlockRequest, useDataBlockResource } from '@tachybase/client';
import { executionCollection } from '@tachybase/module-workflow/client';

import { message } from 'antd';

import { tval, useTranslation } from '../locale';

const NAMESPACE_WORKFLOW = 'workflow';
export const schemaExecution = {
  type: 'void',
  name: 'executionHistoryDrawer',
  title: `{{t("Execution history", { ns: "${NAMESPACE_WORKFLOW}" })}}`,
  'x-component': 'Action.Drawer',
  properties: {
    content: {
      type: 'void',
      'x-decorator': 'ExecutionResourceProvider',
      'x-decorator-props': {
        collection: executionCollection,
        dataSource: 'main',
        action: 'list',
        params: {
          appends: ['workflow.id', 'workflow.title'],
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
            clear: {
              type: 'void',
              title: '{{t("Clear")}}',
              'x-component': 'Action',
              'x-component-props': {
                isShow: false,
                useAction() {
                  const { t } = useTranslation();
                  const { refresh, params } = useDataBlockRequest();
                  const resource = useDataBlockResource();
                  const { setVisible } = useActionContext();
                  return {
                    async run() {
                      await resource.destroy({ filter: params?.filter });
                      message.success(t('Operation succeeded'));
                      refresh();
                      setVisible(false);
                    },
                  };
                },
                confirm: {
                  title: `{{t("Clear all executions", { ns: "${NAMESPACE_WORKFLOW}" })}}`,
                  content: `{{t("Clear executions will not reset executed count, and started executions will not be deleted, are you sure you want to delete them all?", { ns: "${NAMESPACE_WORKFLOW}" })}}`,
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
          },
          properties: {
            actions: {
              type: 'void',
              title: '{{ t("Actions") }}',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
                align: 'center',
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
                    retry: {
                      type: 'void',
                      title: tval('Retry'),
                      'x-component': 'Action.Link',
                      'x-use-component-props': 'ExecutionRetryAction',
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
                align: 'center',
              },
              properties: {
                id: {
                  type: 'number',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            approvalId: {
              type: 'void',
              title: tval('Approval ID'),
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
                align: 'center',
              },
              properties: {
                approvalId: {
                  type: 'number',
                  'x-component': 'ColumnShowApprovalId',
                  'x-read-pretty': true,
                },
              },
            },
            createdAt: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
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
              title: `{{t("Executed time", { ns: "${NAMESPACE_WORKFLOW}" })}}`,
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
              },
              properties: {
                executionCost: {
                  type: 'string',
                  // 'x-decorator': 'ExecutionTime',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            workflowId: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
                align: 'center',
              },
              properties: {
                workflowId: {
                  type: 'number',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            status: {
              type: 'void',
              title: `{{t("Status", { ns: "${NAMESPACE_WORKFLOW}" })}}`,
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
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
