import actions, { utils } from '@nocobase/actions';
import WorkflowPlugin, { EXECUTION_STATUS, JOB_STATUS } from '@nocobase/plugin-workflow';
import { APPROVAL_STATUS, APPROVAL_ACTION_STATUS } from './constants';
import { parseCollectionName } from '@nocobase/data-source-manager';

const workflows = {
  async listApprovalFlows(context, next) {
    context.action.mergeParams({
      filter: {
        type: 'approval',
        enabled: true,
        // TODO: 仅显示当前用户有权限的流程
      },
    });
    return actions.list(context, next);
  },
};
const approvals = {
  async create(context, next) {
    const { status, collectionName, data, workflowId } = context.action.params.values ?? {};
    const [dataSourceName, cName] = parseCollectionName(collectionName);
    const dataSource = context.app.dataSourceManager.dataSources.get(dataSourceName);
    if (!dataSource) {
      return context.throw(400, `Data source "${dataSourceName}" not found`);
    }
    const collection = dataSource.collectionManager.getCollection(cName);
    if (!collection) {
      return context.throw(400, `Collection "${cName}" not found`);
    }
    const workflow = await context.db.getRepository('workflows').findOne({
      filterByTk: workflowId,
    });
    if (!(workflow == null ? void 0 : workflow.enabled)) {
      return context.throw(400, 'Current workflow not found or disabled, please refresh and try again');
    }
    if (status !== APPROVAL_STATUS.DRAFT) {
      context.action.mergeParams({
        values: {
          status: APPROVAL_STATUS.SUBMITTED,
        },
      });
    }
    const { repository, model } = collection;
    const values = await repository.create({
      values: {
        ...data,
        createdBy: context.state.currentUser.id,
        updatedBy: context.state.currentUser.id,
      },
      context,
    });
    const instance = values.get();
    Object.keys(model.associations).forEach((key) => {
      delete instance[key];
    });
    context.action.mergeParams({
      values: {
        collectionName,
        data: instance,
        dataKey: values[collection.filterTargetKey],
        workflowKey: workflow.key,
        applicantRoleName: context.state.currentRole,
      },
    });
    return actions.create(context, next);
  },
  async update(context, next) {
    const { collectionName, data, status } = context.action.params.values ?? {};
    const [dataSourceName, cName] = parseCollectionName(collectionName);
    const dataSource = context.app.dataSourceManager.dataSources.get(dataSourceName);
    const collection = dataSource.collectionManager.getCollection(cName);
    const [target] = await collection.repository.update({
      filterByTk: data[collection.filterTargetKey],
      values: data,
    });
    context.action.mergeParams({
      values: {
        status: status ?? APPROVAL_STATUS.SUBMITTED,
        data: target.toJSON(),
        applicantRoleName: context.state.currentRole,
      },
    });
    return actions.update(context, next);
  },
  async destroy(context, next) {
    const {
      filterByTk,
      values: { status },
    } = context.action.params ?? {};
    if (status !== APPROVAL_STATUS.DRAFT) {
      return context.throw(400);
    }
    const repository = utils.getRepositoryFromParams(context);
    const approval = await repository.findOne({
      filterByTk,
      filter: {
        createdById: context.state.currentUser.id,
      },
    });
    if (!approval) {
      return context.throw(404);
    }
    return actions.destroy(context, next);
  },
  async withdraw(context, next) {
    let _a;
    const { filterByTk } = context.action.params;
    const repository = utils.getRepositoryFromParams(context);
    const approval = await repository.findOne({
      filterByTk,
      appends: ['workflow'],
      except: ['workflow.options'],
    });
    if (!approval) {
      return context.throw(404);
    }
    if (approval.createdById !== ((_a = context.state.currentUser) == null ? void 0 : _a.id)) {
      return context.throw(403);
    }
    if (approval.status !== APPROVAL_STATUS.SUBMITTED || !approval.workflow.config.withdrawable) {
      return context.throw(400);
    }
    const [execution] = await approval.getExecutions({
      where: {
        status: EXECUTION_STATUS.STARTED,
      },
      limit: 1,
    });
    execution.workflow = approval.workflow;
    const jobs = await context.db.sequelize.transaction(async (transaction) => {
      const records = await approval.getRecords({
        where: {
          executionId: execution.id,
        },
        include: [
          {
            association: 'job',
            where: {
              status: JOB_STATUS.PENDING,
            },
            required: true,
          },
        ],
        transaction,
      });
      await context.db.getRepository('approvalRecords').destroy({
        filter: {
          id: records.map((record) => record.id),
        },
        transaction,
      });
      const jobsMap = records.reduce((map, record) => {
        if (!map.has(record.job.id)) {
          record.job.execution = execution;
          record.job.latestUserJob = record.get();
          record.job.latestUserJob.approval = approval;
          map.set(record.job.id, record.job);
        }
        return map;
      }, /* @__PURE__ */ new Map());
      return Array.from(jobsMap.values());
    });
    context.body = approval;
    context.status = 202;
    await next();
    const workflowPlugin = context.app.getPlugin(WorkflowPlugin);
    if (jobs.length) {
      jobs.forEach((job) => {
        job.set('status', JOB_STATUS.CANCELED);
        workflowPlugin.resume(job);
      });
    } else {
      await execution.update({
        status: EXECUTION_STATUS.CANCELED,
      });
    }
  },
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
};
const approvalRecords = {
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
    if (
      !approvalRecord.workflow.enabled ||
      approvalRecord.execution.status ||
      approvalRecord.job.status ||
      approvalRecord.status !== APPROVAL_ACTION_STATUS.PENDING ||
      !(approvalRecord.node.config.actions ?? []).includes(values.status)
    ) {
      return context.throw(400);
    }
    await approvalRecord.update({
      status: values.status,
      comment: values.comment,
      snapshot: approvalRecord.approval.data,
    });
    context.body = approvalRecord.get();
    context.status = 202;
    await next();
    approvalRecord.execution.workflow = approvalRecord.workflow;
    approvalRecord.job.execution = approvalRecord.execution;
    approvalRecord.job.latestUserJob = approvalRecord.get();
    const workflow = context.app.getPlugin(WorkflowPlugin);
    const processor = workflow.createProcessor(approvalRecord.execution);
    processor.logger.info(
      `approval node (${approvalRecord.nodeId}) action trigger execution (${approvalRecord.execution.id}) to resume`,
    );
    workflow.resume(approvalRecord.job);
  },
};
function make(name, mod) {
  return Object.keys(mod).reduce(
    (result, key) => ({
      ...result,
      [`${name}:${key}`]: mod[key],
    }),
    {},
  );
}
export function init({ app }) {
  app.actions({
    ...make('workflows', workflows),
    ...make('approvals', approvals),
    ...make('approvalRecords', approvalRecords),
  });
}
