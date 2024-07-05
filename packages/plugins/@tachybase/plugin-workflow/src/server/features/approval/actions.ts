import actions, { utils } from '@tachybase/actions';
import { parseCollectionName } from '@tachybase/data-source-manager';

import { EXECUTION_STATUS, JOB_STATUS, PluginWorkflow } from '../..';
import { appends } from '../../../client/schemas/collection';
import { APPROVAL_ACTION_STATUS, APPROVAL_STATUS } from './constants';
import { getSummary } from './tools';
import { getAssociationName, jsonParse } from './utils';

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
    if (!workflow?.enabled) {
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
    const summary = getSummary({
      summaryConfig: workflow.config.summary,
      data: {
        ...instance,
        ...data,
      },
    });
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
        summary,
      },
    });
    return actions.create(context, next);
  },
  async update(context, next) {
    const { collectionName, data, status, schemaFormId, summaryConfig } = context.action.params.values ?? {};
    const [dataSourceName, cName] = parseCollectionName(collectionName);
    const dataSource = context.app.dataSourceManager.dataSources.get(dataSourceName);
    const collection = dataSource.collectionManager.getCollection(cName);

    /** 以下为,处理子表单子表格等关联字段的更新逻辑 */
    const schemaOfForm = await context.db.getRepository('uiSchemas').getJsonSchema(schemaFormId);
    const itemsOfSchema = await jsonParse(`**["x-component-props".mode]`, schemaOfForm);
    const fieldAssociationName = itemsOfSchema
      .filter((item) => {
        return ['Nester', 'SubTable', 'PopoverNester'].includes(item?.['x-component-props']?.mode);
      })
      .map((item) => getAssociationName(item['x-collection-field']));
    const updateAssociationValues = [...new Set(fieldAssociationName)];
    /** 以上为,处理子表单子表格等关联字段的更新逻辑 */

    const [target] = await collection.repository.update({
      filterByTk: data[collection.filterTargetKey],
      values: data,
      updateAssociationValues,
    });

    const summary = getSummary({
      summaryConfig,
      data: data,
    });

    context.action.mergeParams({
      values: {
        status: status ?? APPROVAL_STATUS.SUBMITTED,
        data: data,
        applicantRoleName: context.state.currentRole,
        summary,
      },
    });
    return actions.update(context, next);
  },

  // NOTE: 和 create 逻辑雷同, 但是 因为原本的 create 并非纯操作, 因此拷贝一份以便方便改动
  async reSubmit(context, next) {
    const { status, collectionName, data, workflowId, collectionAppends } = context.action.params.values ?? {};
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
    if (!workflow?.enabled) {
      return context.throw(400, 'Current workflow not found or disabled, please refresh and try again');
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

    // NOTE: 这里需要取出关联字段, 用于摘要的构造;
    // 有点奇怪的方式, 但是没想到更好的处理方式, 也许应该改造摘要的构造方式, 存储关联字段的id, 在前端请求具体数据.
    const valuesWithAppends = await repository.findOne({
      filterByTk: values.id,
      appends: [...collectionAppends],
    });
    const summary = getSummary({
      summaryConfig: workflow.config.summary,
      data: valuesWithAppends,
    });
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
        summary,
      },
    });
    return actions.create(context, next);
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
    if (approval.createdById !== context.state.currentUser?.id) {
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
      }, new Map());
      return Array.from(jobsMap.values());
    });
    context.body = approval;
    context.status = 202;
    await next();
    const workflowPlugin = context.app.getPlugin(PluginWorkflow) as PluginWorkflow;

    /** FIXME: 这里 workflowPlugin.resume 内部有独特的异步逻辑, 并非用 await 能确保其完全执行结束.
     * 需要更好的方案, 去解决这里的问题.
     * 问题表现是: 有时候会出现, 撤销动作, 无法确保能将待办里的目标事项销毁
     */
    // if (jobs.length) {
    //   const promises = jobs.map(async (job) => {
    //     job.set('status', JOB_STATUS.CANCELED);
    //     await workflowPlugin.resume(job);
    //   });
    //   await Promise.all(promises); // 等待所有的 resume 操作完成
    // }
    // if (jobs.length) {
    //   const waitList = [];
    //   jobs.forEach((job) => {
    //     job.set('status', JOB_STATUS.CANCELED);
    //     waitList.push(workflowPlugin.resume(job));
    //   });
    //   // await Promise.all(waitList)
    // } else {
    await execution.update({
      status: EXECUTION_STATUS.CANCELED,
    });
    // }
    /** FIXME: 以上 */
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
    if (
      !approvalRecord.workflow.enabled ||
      approvalRecord.execution.status ||
      approvalRecord.job.status ||
      approvalRecord.status !== APPROVAL_ACTION_STATUS.PENDING ||
      (!needUpdateRecord && !(approvalRecord.node.config.actions ?? []).includes(status))
    ) {
      return context.throw(400);
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
