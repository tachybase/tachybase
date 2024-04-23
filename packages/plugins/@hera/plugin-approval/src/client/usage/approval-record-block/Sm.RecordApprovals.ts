import { NAMESPACE } from '../../locale';
import { ApprovalCommon } from '../approval-common/map';

export const SchemaRecordApprovals = {
  type: 'void',
  name: 'recordApprovals',
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
    list: {
      type: 'array',
      'x-component': 'List',
      'x-component-props': { locale: { emptyText: `{{ t("No data yet", { ns: "${NAMESPACE}" }) }}` } },
      properties: {
        item: {
          type: 'object',
          'x-component': 'List.Item',
          'x-use-component-props': 'useListItemProps',
          'x-read-pretty': true,
          properties: {
            grid: {
              type: 'void',
              'x-component': 'Space',
              'x-component-props': { direction: 'vertical' },
              properties: {
                row: {
                  type: 'void',
                  'x-component': 'Space',
                  'x-component-props': { size: 'large', wrap: true },
                  properties: {
                    id: {
                      type: 'number',
                      title: '{{t("ID")}}',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-read-pretty': true,
                    },
                    workflow: {
                      type: 'string',
                      title: '{{t("Workflow", { ns: "workflow" })}}',
                      'x-decorator': 'FormItem',
                      'x-component': 'WorkflowColumn',
                      'x-read-pretty': true,
                    },
                    status: {
                      type: 'number',
                      title: `{{t("Current status", { ns: "${NAMESPACE}" })}}`,
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                      'x-read-pretty': true,
                    },
                    createdBy: {
                      type: 'string',
                      title: `{{t("Initiator", { ns: "${NAMESPACE}" })}}`,
                      'x-decorator': 'FormItem',
                      'x-component': 'UserColumn',
                      'x-read-pretty': true,
                    },
                    createdAt: {
                      type: 'string',
                      title: '{{t("Created at")}}',
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                      'x-read-pretty': true,
                    },
                  },
                },
                processRow: {
                  type: 'void',
                  // 'x-decorator': 'ApprovalBlock.ApprovalDataProvider',
                  'x-decorator': ApprovalCommon.PathNameMap.Provider.ApprovalDataProvider,
                  'x-component': ApprovalCommon.PathNameMap.ViewComponent.ApprovalProcess,
                  'x-component-props': {
                    actionEnabled: true,
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
