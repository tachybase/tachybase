import { uid } from '@nocobase/utils';
import { Instruction, JOB_STATUS } from '@nocobase/plugin-workflow';
import { APPROVAL_STATUS, APPROVAL_ACTION_STATUS } from './constants';
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
  const assignees = /* @__PURE__ */ new Set();
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
      fields: ['id', 'status', 'data'],
      appends: ['approvalExecutions'],
      except: ['data'],
    });
    const approvalExecution = approval.approvalExecutions.find((item) => item.executionId === processor.execution.id);
    const RecordModel = db.getModel('approvalRecords');
    await RecordModel.bulkCreate(
      assignees.map((userId, index) => ({
        approvalId: approval.id,
        approvalExecutionId: approvalExecution.id,
        userId,
        jobId: job.id,
        nodeId: node.id,
        executionId: job.executionId,
        workflowId: node.workflowId,
        index,
        status: node.config.order && index ? APPROVAL_ACTION_STATUS.ASSIGNED : APPROVAL_ACTION_STATUS.PENDING,
        snapshot: approvalExecution.snapshot,
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
      job.status ||
      (getNegotiationMode(negotiation).getStatus(distribution, assignees, negotiation) ?? JOB_STATUS.PENDING);
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
    return job;
  }
  async duplicateConfig(node, { transaction }) {
    const uiSchemaRepo = this.workflow.app.db.getRepository('uiSchemas');
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
