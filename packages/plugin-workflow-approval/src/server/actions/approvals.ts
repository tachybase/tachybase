import actions, { utils } from '@tachybase/actions';
import { parseCollectionName } from '@tachybase/data-source-manager';
import { traverseJSON } from '@tachybase/database';
import { EXECUTION_STATUS, JOB_STATUS, PluginWorkflow } from '@tachybase/module-workflow';

import { APPROVAL_STATUS } from '../constants/status';
import { getSummary, searchSummaryQuery } from '../tools';

export const approvals = {
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
        ...traverseJSON(data, { collection }),
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
    const { collectionName, data, status, updateAssociationValues, summaryConfig } = context.action.params.values ?? {};
    const [dataSourceName, cName] = parseCollectionName(collectionName);
    const dataSource = context.app.dataSourceManager.dataSources.get(dataSourceName);
    const collection = dataSource.collectionManager.getCollection(cName);

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
  async resubmit(context, next) {
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

    await execution.update({
      status: EXECUTION_STATUS.CANCELED,
    });
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

    /**
     * 以下为摘要搜索逻辑, 由于 summary 在不同的 workflow 中可能有不同的结构,
     * 因此在构造查询条件反而比较麻烦, 因此不分页, 直接在返回结果里筛选.
     * XXX: 大量数据时,怎么办
     */
    const summaryQueryValue = context.action?.params.summaryQueryValue;
    if (summaryQueryValue) {
      await searchSummaryQuery(context, next, summaryQueryValue);
      return;
    }
    /** 以上为摘要搜索逻辑 */

    return await actions.list(context, next);
  },
};