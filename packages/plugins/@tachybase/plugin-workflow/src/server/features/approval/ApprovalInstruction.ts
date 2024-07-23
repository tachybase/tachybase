import { parseCollectionName } from '@tachybase/data-source-manager';
import { UiSchemaRepository } from '@tachybase/plugin-ui-schema-storage';
import { uid } from '@tachybase/utils';

import { JOB_STATUS } from '../../constants';
import Instruction from '../../instructions';
import { toJSON } from '../../utils';
import ApprovalTrigger from './ApprovalTrigger';
import { APPROVAL_ACTION_STATUS, APPROVAL_STATUS } from './constants';

const NEGOTIATION_MODE = {
  SINGLE: Symbol('single'),
  ALL: Symbol('all'),
  ANY: Symbol('any'),
  PERCENTAGE: Symbol('percentage'),
};
const JobStatusMap = {
  [APPROVAL_ACTION_STATUS.PENDING]: JOB_STATUS.PENDING,
  [APPROVAL_ACTION_STATUS.APPROVED]: JOB_STATUS.RESOLVED,
  [APPROVAL_ACTION_STATUS.REJECTED]: JOB_STATUS.REJECTED,
  [APPROVAL_ACTION_STATUS.RETURNED]: JOB_STATUS.RETRY_NEEDED,
};
const ApprovalJobStatusMap = {
  [JOB_STATUS.PENDING]: APPROVAL_ACTION_STATUS.PENDING,
  [JOB_STATUS.RESOLVED]: APPROVAL_ACTION_STATUS.APPROVED,
  [JOB_STATUS.REJECTED]: APPROVAL_ACTION_STATUS.REJECTED,
  [JOB_STATUS.RETRY_NEEDED]: APPROVAL_ACTION_STATUS.RETURNED,
  [JOB_STATUS.CANCELED]: APPROVAL_ACTION_STATUS.CANCELED,
};
const Modes = {
  [NEGOTIATION_MODE.SINGLE]: {
    getStatus(distribution, assignees, mode) {
      const done = distribution.find((item) => item.status !== APPROVAL_ACTION_STATUS.PENDING && item.count > 0);
      return done ? JobStatusMap[done.status] : null;
    },
  },
  [NEGOTIATION_MODE.ALL]: {
    getStatus(distribution, assignees, mode) {
      const rejected = distribution.find((item) =>
        [APPROVAL_ACTION_STATUS.REJECTED, APPROVAL_ACTION_STATUS.RETURNED].includes(item.status),
      );
      if (rejected && rejected.count) {
        return JobStatusMap[rejected.status];
      }
      const approved = distribution.find((item) => item.status === APPROVAL_ACTION_STATUS.APPROVED);
      if (approved && approved.count === assignees.length) {
        return JOB_STATUS.RESOLVED;
      }
      return null;
    },
  },
  [NEGOTIATION_MODE.ANY]: {
    getStatus(distribution, assignees, mode) {
      const returned = distribution.find((item) => item.status === APPROVAL_ACTION_STATUS.RETURNED);
      if (returned && returned.count) {
        return JOB_STATUS.RETRY_NEEDED;
      }
      const approved = distribution.find((item) => item.status === APPROVAL_ACTION_STATUS.APPROVED);
      if (approved && approved.count) {
        return APPROVAL_ACTION_STATUS.APPROVED;
      }
      const rejectedCount = distribution.reduce(
        (count, item) => (item.status === APPROVAL_ACTION_STATUS.REJECTED ? count + item.count : count),
        0,
      );
      if (rejectedCount === assignees.length) {
        return JOB_STATUS.REJECTED;
      }
      return null;
    },
  },
  [NEGOTIATION_MODE.PERCENTAGE]: {
    getStatus(distribution, assignees, mode) {
      const returned = distribution.find((item) => item.status === APPROVAL_ACTION_STATUS.RETURNED);
      if (returned && returned.count) {
        return JOB_STATUS.RETRY_NEEDED;
      }
      const approved = distribution.find((item) => item.status === APPROVAL_ACTION_STATUS.APPROVED);
      if (approved && approved.count / assignees.length > mode) {
        return JOB_STATUS.RESOLVED;
      }
      const rejected = distribution.find((item) => item.status === APPROVAL_ACTION_STATUS.REJECTED);
      if (rejected && rejected.count / assignees.length >= 1 - mode) {
        return JOB_STATUS.REJECTED;
      }
      return null;
    },
  },
};
function getNegotiationMode(mode) {
  switch (true) {
    case mode === 1:
      return Modes[NEGOTIATION_MODE.ALL];
    case 0 < mode && mode < 1:
      return Modes[NEGOTIATION_MODE.PERCENTAGE];
    default:
      return Modes[NEGOTIATION_MODE.SINGLE];
  }
}
async function parseAssignees(node, processor) {
  const configAssignees = processor
    .getParsedValue(node.config.assignees ?? [], node.id)
    .flat()
    .filter(Boolean);
  const assignees = new Set();
  const UserRepo = processor.options.plugin.app.db.getRepository('users');
  for (const item of configAssignees) {
    if (typeof item === 'object') {
      const result = await UserRepo.find({
        ...item,
        fields: ['id'],
        transaction: processor.transaction,
      });
      result.forEach((item2) => assignees.add(item2.id));
    } else {
      assignees.add(item);
    }
  }
  return [...assignees];
}
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
