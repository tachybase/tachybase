import { approvalStatusOptions } from '../constants';
import { NAMESPACE, tval } from '../locale';

export const CollectionApprovalTodos = {
  title: `{{t("Approval todos", { ns: "${NAMESPACE}" })}}`,
  name: 'approvalRecords',
  fields: [
    {
      type: 'bigInt',
      name: 'approvalId',
      interface: 'number',
      uiSchema: {
        type: 'number',
        title: 'ID',
        'x-component': 'InputNumber',
      },
    },
    {
      type: 'belongsTo',
      name: 'user',
      target: 'users',
      foreignKey: 'userId',
      interface: 'm2o',
      uiSchema: {
        type: 'number',
        title: `{{t("Assignee", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'RemoteSelect',
        'x-component-props': { fieldNames: { label: 'nickname', value: 'id' }, service: { resource: 'users' } },
      },
    },
    {
      type: 'belongsTo',
      name: 'node',
      target: 'flow_nodes',
      foreignKey: 'nodeId',
      interface: 'm2o',
      isAssociation: true,
      uiSchema: {
        type: 'number',
        title: `{{t("Task node", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'RemoteSelect',
        'x-component-props': { fieldNames: { label: 'title', value: 'id' }, service: { resource: 'flow_nodes' } },
      },
    },
    {
      type: 'belongsTo',
      name: 'workflow',
      target: 'workflows',
      foreignKey: 'workflowId',
      interface: 'm2o',
      uiSchema: {
        type: 'number',
        title: '{{t("Workflow", { ns: "workflow" })}}',
        'x-component': 'RemoteSelect',
        'x-component-props': { fieldNames: { label: 'title', value: 'id' }, service: { resource: 'workflows' } },
      },
    },
    {
      type: 'integer',
      name: 'status',
      interface: 'select',
      uiSchema: {
        type: 'number',
        title: '{{t("Status", { ns: "workflow" })}}',
        'x-component': 'Select',
        enum: approvalStatusOptions,
      },
    },
    {
      type: 'text',
      name: 'comment',
      interface: 'markdown',
      uiSchema: { type: 'string', 'x-component': 'Markdown', title: `{{t("Comment", { ns: "${NAMESPACE}" })}}` },
    },
    {
      name: 'createdAt',
      type: 'date',
      interface: 'createdAt',
      uiSchema: {
        type: 'datetime',
        title: '{{t("Created at")}}',
        'x-component': 'DatePicker',
        'x-component-props': { showTime: true },
      },
    },
    {
      name: 'updatedAt',
      type: 'date',
      interface: 'updatedAt',
      uiSchema: {
        type: 'datetime',
        title: '{{t("Updated at")}}',
        'x-component': 'DatePicker',
        'x-component-props': { showTime: true },
      },
    },
    {
      type: 'string',
      name: 'summaryString',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: tval('Summary'),
        'x-component': 'ApprovalsSummary',
        'x-component-props': {
          style: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
      },
    },
  ],
};
