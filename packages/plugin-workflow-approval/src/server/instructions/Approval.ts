import { parseCollectionName } from '@tachybase/data-source-manager';
import { Instruction, JOB_STATUS, toJSON } from '@tachybase/module-workflow';
import { UiSchemaRepository } from '@tachybase/plugin-ui-schema-storage';
import { uid } from '@tachybase/utils';

import { APPROVAL_ACTION_STATUS, APPROVAL_STATUS } from '../constants/status';
import ApprovalTrigger from '../triggers/Approval';
import { ApprovalJobStatusMap, getNegotiationMode, parseAssignees } from './tools';

/** 工作流节点:审批节点  */
export default class ApprovalInstruction extends Instruction {
  async run(node, prevJob, processor) {
    const job = await processor.saveJob({
      status: JOB_STATUS.PENDING,
      nodeId: node.id,
      nodeKey: node.key,
      upstreamId: (prevJob == null ? void 0 : prevJob.id) ?? null,
    });
    const assignees = await parseAssignees(node, processor);
    const { db } = processor.options.plugin;
    const ApprovalRepo = db.getRepository('approvals');
    const approval = await ApprovalRepo.findOne({
      filter: {
        'executions.id': processor.execution.id,
      },
      fields: ['id', 'status', 'data', 'summary', 'collectionName'],
      appends: ['approvalExecutions', 'createdBy'],
      except: ['data'],
    });
    const approvalExecution = approval.approvalExecutions.find((item) => item.executionId === processor.execution.id);
    // NOTE: 属于重新提交的情况时候, 不必进入待办列表, 应该由用户手动提交
    if ([APPROVAL_STATUS.RESUBMIT, APPROVAL_STATUS.DRAFT].includes(approval.status)) {
      return job;
    }
    const RecordModel = db.getModel('approvalRecords');
    await RecordModel.bulkCreate(
      assignees.map((userId, index) => ({
        approvalId: approval.id,
        approvalExecutionId: approvalExecution.id,
        createdById: approval.createdBy?.id,
        userId,
        jobId: job.id,
        nodeId: node.id,
        executionId: job.executionId,
        workflowId: node.workflowId,
        index,
        status: node.config.order && index ? APPROVAL_ACTION_STATUS.ASSIGNED : APPROVAL_ACTION_STATUS.PENDING,
        snapshot: approvalExecution.snapshot,
        summary: approval.summary,
        collectionName: approval.collectionName,
      })),
      {
        transaction: processor.transaction,
      },
    );

    // 构造好审批数据后, 依次通知审批人审批
    for (const userId of assignees) {
      const message = {
        userId,
        title: '{{t("Approval", { ns: "@tachybase/plugin-workflow-approval" })}}',
        content: '',
        collectionName: approval.collectionName,
        jsonContent: approval.summary,
        schemaName: node.config.applyDetail,
      };
      this.workflow.app.messageManager.sendMessage(+userId, message);
    }

    return job;
  }
  async resume(node, job, processor) {
    if (job.nodeId !== node.id) {
      const nodeJob = processor.findBranchParentJob(job, node);
      if (job.status === JOB_STATUS.RESOLVED) {
        const jobNode = processor.nodesMap.get(job.nodeId);
        const branchStart = processor.findBranchStartNode(jobNode);
        if (branchStart.branchIndex === APPROVAL_ACTION_STATUS.RETURNED) {
          nodeJob.set('status', JOB_STATUS.RETRY_NEEDED);
        } else if (branchStart.branchIndex === APPROVAL_ACTION_STATUS.REJECTED && node.config.endOnReject) {
          nodeJob.set('status', JOB_STATUS.REJECTED);
        }
        return nodeJob;
      }
      return processor.exit(job.status);
    }
    const { branchMode, negotiation, order } = node.config;
    const assignees = await parseAssignees(node, processor);
    const RecordRepo = this.workflow.app.db.getRepository('approvalRecords');
    const records = await RecordRepo.find({
      filter: {
        jobId: job.id,
      },
      appends: ['approval'],
      except: ['snapshot'],
      sort: ['index'],
      transaction: processor.transaction,
    });
    const distribution = records.reduce((prev, record) => {
      const item = prev.find((item2) => item2.status === record.status);
      if (item) {
        item.count += 1;
      } else {
        prev.push({
          status: record.status,
          count: 1,
        });
      }
      return prev;
    }, []);
    const processing = Boolean(distribution.find((item) => item.status !== APPROVAL_ACTION_STATUS.PENDING));
    const status =
      getNegotiationMode(+negotiation).getStatus(distribution, assignees, negotiation) ?? JOB_STATUS.PENDING;
    const result = ApprovalJobStatusMap[status];
    processor.logger.debug(`approval resume job and next status: ${status}`);
    job.set({
      status: status && status !== JOB_STATUS.CANCELED ? (branchMode ? JOB_STATUS.RESOLVED : status) : status,
      result,
    });
    if ((status && status !== JOB_STATUS.CANCELED) || (negotiation && processing)) {
      await job.latestUserJob.approval.update(
        {
          status: APPROVAL_STATUS.PROCESSING,
        },
        { transaction: processor.transaction },
      );
    }
    const nextAssignee = assignees[assignees.indexOf(job.latestUserJob.userId) + 1];
    if (!status && negotiation && order && nextAssignee) {
      await RecordRepo.update({
        values: {
          status: APPROVAL_ACTION_STATUS.PENDING,
        },
        filter: {
          jobId: job.id,
          userId: nextAssignee,
        },
        transaction: processor.transaction,
      });
    }
    if (branchMode) {
      const branchNode = processor.nodes.find((item) => item.upstream === node && item.branchIndex === result);
      if (branchNode) {
        await processor.saveJob(job);
        await processor.run(branchNode, job);
        return null;
      }
    }
    // NOTE: 审批对象数据, 可能在此期间变更, 需要拿到最新的审批对象数据, 更新到最新的 snapshot
    /** 以下为更新 snapshot 逻辑 */
    try {
      const approval = records[0].approval;
      const [dataSourceName, collectionName] = parseCollectionName(approval.collectionName);
      const { repository } = this.workflow.app.dataSourceManager.dataSources
        .get(dataSourceName)
        .collectionManager.getCollection(collectionName);

      const workflow = await approval.getWorkflow({
        where: {
          id: approval.get('workflowId'),
          type: ApprovalTrigger.TYPE,
          enabled: true,
          'config.collection': approval.collectionName,
        },
        transaction: processor.transaction,
      });

      const data = await repository.findOne({
        filterByTk: approval.get('dataKey'),
        appends: workflow.config.appends,
        transaction: this.workflow.useDataSourceTransaction(dataSourceName, processor.transaction),
      });

      await RecordRepo.update({
        values: {
          snapshot: toJSON(data),
        },
        filter: {
          jobId: job.id,
        },
        transaction: processor.transaction,
      });
    } catch (error) {
      console.log('%c Line:269 🥛 error', error);
    }
    /** 以上为更新 snapshot 逻辑 */
    return job;
  }
  async duplicateConfig(node, { transaction }) {
    const uiSchemaRepo = this.workflow.app.db.getRepository<UiSchemaRepository>('uiSchemas');
    if (!node.config.applyDetail) {
      return node.config;
    }
    const result = await uiSchemaRepo.duplicate(node.config.applyDetail, {
      transaction,
    });
    return {
      ...node.config,
      applyDetail: (result == null ? void 0 : result['x-uid']) ?? uid(),
    };
  }
}
