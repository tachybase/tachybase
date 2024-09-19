import actions, { utils } from '@tachybase/actions';

import { PluginWorkflow } from '../../..';
import { ERROR_CODE_MAP } from '../constants/error-code';
import { APPROVAL_ACTION_STATUS } from '../constants/status';

export const approvalRecords = {
  async listCentralized(context, next) {
    const centralizedApprovalFlow = await context.db.getRepository('workflows').find({
      filter: {
        type: 'approval',
        'config.centralized': true,
      },
      fields: ['id'],
    });
    context.action.mergeParams({
      filter: {
        workflowId: centralizedApprovalFlow.map((item) => item.id),
      },
    });
    return actions.list(context, next);
  },
  async submit(context, next) {
    const repository = utils.getRepositoryFromParams(context);
    const { filterByTk, values } = context.action.params;
    const { data, status, needUpdateRecord } = values || {};
    const { currentUser } = context.state;
    if (!currentUser) {
      return context.throw(401);
    }
    const approvalRecord = await repository.findOne({
      filterByTk,
      filter: {
        userId: currentUser == null ? void 0 : currentUser.id,
      },
      appends: ['job', 'node', 'execution', 'workflow', 'approval'],
      context,
    });
    if (!approvalRecord) {
      return context.throw(404);
    }

    // NOTE: 为了更改设定, 让切换版本后, 已经在进程中的审批流程也可以执行下去. 所以这里先注释掉.
    // 原设定是, 切换版本后, 已经在流程中的, 置为未处理状态, 然后禁止继续执行.
    switch (true) {
      // case !approvalRecord.workflow.enabled:
      //   return context.throw(400, ERROR_CODE_MAP['not_enable_workflow']);
      case approvalRecord.execution?.status:
        return context.throw(400, ERROR_CODE_MAP['execution_finished']);
      case approvalRecord.job?.status:
        return context.throw(400, ERROR_CODE_MAP['job_finished']);
      case approvalRecord.status !== APPROVAL_ACTION_STATUS.PENDING:
        return context.throw(400, ERROR_CODE_MAP['not_approval_pending']);
      case !needUpdateRecord && !(approvalRecord.node.config.actions ?? []).includes(status):
        return context.throw(400, ERROR_CODE_MAP['not_need_update']);
      default:
        break;
    }

    await approvalRecord.update({
      status: status,
      comment: data.comment,
      snapshot: approvalRecord.approval.data,
      summary: approvalRecord.approval.summary,
      collectionName: approvalRecord.approval.collectionName,
    });
    context.body = approvalRecord.get();
    context.status = 202;
    await next();
    approvalRecord.execution.workflow = approvalRecord.workflow;
    approvalRecord.job.execution = approvalRecord.execution;
    approvalRecord.job.latestUserJob = approvalRecord.get();
    const workflow = context.app.getPlugin(PluginWorkflow);
    const processor = workflow.createProcessor(approvalRecord.execution);
    processor.logger.info(
      `approval node (${approvalRecord.nodeId}) action trigger execution (${approvalRecord.execution.id}) to resume`,
    );
    workflow.resume(approvalRecord.job);
  },
};
