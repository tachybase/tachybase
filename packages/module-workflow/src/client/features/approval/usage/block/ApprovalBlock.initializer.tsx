import { COLLECTION_NAME_APPROVAL_CARBON_COPY } from '../../../common/constants';
import { NAMESPACE, tval } from '../../locale';

export const initializerName = 'otherBlocks.workflow.approval';

export const initializerApprovalBlock = {
  key: 'approvalBlock',
  name: 'approvalBlock',
  type: 'itemGroup',
  title: tval('Approval'),
  icon: 'AuditOutlined',
  children: [
    {
      type: 'item',
      icon: 'ClockCircleOutlined',
      title: `{{t("Initiate Request", { ns: "${NAMESPACE}" })}}`,
      'x-component': 'ApprovalBlock.Launch.Application',
      collection: 'workflows',
      action: 'list',
      Component: 'ApprovalBlock.BlockInitializer',
      useInsert: () => {
        return (schema) => {};
      },
    },
    {
      type: 'item',
      icon: 'AuditOutlined',
      Component: 'ApprovalBlock.BlockInitializer',
      title: `{{t("My Requests", { ns: "${NAMESPACE}" })}}`,
      'x-component': 'ApprovalBlock.Launch',
      collection: 'approvals',
      params: {
        appends: [
          'createdBy.nickname',
          'workflow.title',
          'workflow.enabled',
          'records.id',
          'records.status',
          'records.node.title',
        ],
        except: ['data'],
      },
    },
    {
      type: 'item',
      icon: 'FormOutlined',
      Component: 'ApprovalBlock.BlockInitializer',
      title: `{{t("My Pending Tasks", { ns: "${NAMESPACE}" })}}`,
      'x-component': 'ApprovalBlock.Todos',
      collection: 'approvalRecords',
      params: {
        appends: [
          'createdBy.id',
          'createdBy.nickname',
          'user.id',
          'user.nickname',
          'node.id',
          'node.title',
          'job.id',
          'job.status',
          'job.result',
          'workflow.id',
          'workflow.title',
          'workflow.enabled',
          'execution.id',
          'execution.status',
        ],
      },
    },
    {
      type: 'item',
      icon: 'MailOutlined',
      Component: 'ApprovalBlock.BlockInitializer',
      title: `{{t("CC'd to Me", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'CarbonCopyBlockProvider',
      'x-component': 'CarbonCopyCenter',
      'x-toolbar': 'BlockSchemaToolbar',
      'x-settings': 'blockSettings:table',
      collection: COLLECTION_NAME_APPROVAL_CARBON_COPY,
      params: {
        appends: [
          'createdBy.id',
          'createdBy.nickname',
          'approval.status',
          'user.id',
          'user.nickname',
          'node.id',
          'node.title',
          'job.id',
          'job.status',
          'job.result',
          'workflow.id',
          'workflow.title',
          'workflow.enabled',
          'execution.id',
          'execution.status',
        ],
      },
    },
  ],
};
