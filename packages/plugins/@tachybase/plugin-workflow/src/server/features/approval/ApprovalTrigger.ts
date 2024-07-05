import { parseCollectionName } from '@tachybase/data-source-manager';
import { modelAssociationByKey } from '@tachybase/database';
import { UiSchemaRepository } from '@tachybase/plugin-ui-schema-storage';

import { get } from 'lodash';
import { BelongsTo, HasOne, Op } from 'sequelize';

import { EXECUTION_STATUS, JOB_STATUS } from '../../constants';
import Trigger from '../../triggers';
import { toJSON } from '../../utils';
import { APPROVAL_ACTION_STATUS, APPROVAL_STATUS } from './constants';
import { getSummary } from './tools';

const ExecutionStatusMap = {
  [EXECUTION_STATUS.RESOLVED]: APPROVAL_STATUS.APPROVED,
  [EXECUTION_STATUS.REJECTED]: APPROVAL_STATUS.REJECTED,
  [EXECUTION_STATUS.CANCELED]: APPROVAL_STATUS.DRAFT,
  [EXECUTION_STATUS.RETRY_NEEDED]: APPROVAL_STATUS.RETURNED,
  // FAILED: -1,
  // ERROR: -2,
  // ABORTED: -3,
};
const ApprovalJobStatusMap = {
  [APPROVAL_ACTION_STATUS.APPROVED]: APPROVAL_STATUS.APPROVED,
  [APPROVAL_ACTION_STATUS.REJECTED]: APPROVAL_STATUS.REJECTED,
  [APPROVAL_ACTION_STATUS.RETURNED]: APPROVAL_STATUS.RETURNED,
};
export default class ApprovalTrigger extends Trigger {
  static TYPE = 'approval';
  sync = false;
  triggerHandler = async (approval, { transaction }) => {
    const workflow = await approval.getWorkflow({
      where: {
        id: approval.get('workflowId'),
        type: ApprovalTrigger.TYPE,
        enabled: true,
        'config.collection': approval.collectionName,
      },
      transaction,
    });
    const isChangedStatus = approval.changed('status');
    const isAllowStatusList = [APPROVAL_STATUS.DRAFT, APPROVAL_STATUS.SUBMITTED, APPROVAL_STATUS.RESUBMIT].includes(
      approval.status,
    );
    if (!workflow || !isChangedStatus || !isAllowStatusList) {
      return;
    }
    const [dataSourceName, collectionName] = parseCollectionName(approval.collectionName);
    const { repository } = this.workflow.app.dataSourceManager.dataSources
      .get(dataSourceName)
      .collectionManager.getCollection(collectionName);
    const data = await repository.findOne({
      filterByTk: approval.get('dataKey'),
      appends: workflow.config.appends,
      transaction: this.workflow.useDataSourceTransaction(dataSourceName, transaction),
    });
    this.workflow.trigger(
      workflow,
      {
        data: toJSON(data),
        approvalId: approval.id,
        applicantRoleName: approval.applicantRoleName,
        summary: getSummary({
          summaryConfig: workflow.config.summary,
          data,
        }),
        collectionName: approval.collectionName,
      },
      { transaction },
    );
  };
  onExecutionCreate = async (execution, { transaction }) => {
    const workflow = await execution.getWorkflow({ transaction });
    if (workflow.type !== ApprovalTrigger.TYPE) {
      return;
    }
    const { approvalId, data, summary, collectionName } = execution.context;

    // FIXME: 因为这里的原本的 data, 在重新提交后再次重新提交, 丢失了审批人之类的多对多关系数据
    // 找不到上下文传递数据的来源在哪里, 因此在这里重新取数据.因为存储的是快照, 这样是有其合理性的.
    // 不合理, 会导致其他错误出现. 从非审批中心发起的单子, 拿到的是错误的数据.
    // 现在的问题是, 多次复制后, 丢失了审批人, 等多对多的关联字段.

    const approvalExecution = await this.workflow.db.getRepository('approvalExecutions').create({
      values: {
        approvalId,
        executionId: execution.id,
        status: execution.status,
        snapshot: data,
        summary,
        collectionName,
      },
      transaction,
    });
    await this.workflow.db.getRepository('approvals').update({
      filterByTk: approvalId,
      values: { latestExecutionId: approvalExecution.id },
      transaction,
    });
  };
  onExecutionUpdate = async (execution, { transaction }) => {
    if (!execution.workflow) {
      execution.workflow = await execution.getWorkflow({ transaction });
    }
    if (!execution.status || execution.workflow.type !== ApprovalTrigger.TYPE) {
      return;
    }
    const approvalExecution = await this.workflow.db.getRepository('approvalExecutions').findOne({
      filter: {
        executionId: execution.id,
        approvalId: execution.context.approvalId,
      },
      appends: ['approval'],
      transaction,
    });
    const { approval } = approvalExecution;
    if (![APPROVAL_STATUS.SUBMITTED, APPROVAL_STATUS.PROCESSING].includes(approval.status)) {
      return;
    }
    let status = APPROVAL_STATUS.APPROVED;
    if (execution.status === EXECUTION_STATUS.RESOLVED) {
      const [approvalNodeJob] = await execution.getJobs({
        where: {
          status: {
            [Op.ne]: JOB_STATUS.PENDING,
          },
        },
        include: [
          {
            association: 'node',
            where: {
              type: 'approval',
            },
            required: true,
          },
        ],
        order: [['updatedAt', 'DESC']],
        limit: 1,
        transaction,
      });
      if (approvalNodeJob && ApprovalJobStatusMap[approvalNodeJob.result] != null) {
        status = ApprovalJobStatusMap[approvalNodeJob.result];
      }
    } else {
      if (ExecutionStatusMap[execution.status] != null) {
        status = ExecutionStatusMap[execution.status];
      }
    }
    await approval.update({ status }, { transaction });
    await approvalExecution.update({ status: execution.status }, { transaction });
  };
  middleware = async (context, next) => {
    const {
      resourceName,
      actionName,
      params: { triggerWorkflows },
    } = context.action;
    if (resourceName === 'workflows' && actionName === 'trigger') {
      return this.workflowTriggerAction(context, next);
    }
    await next();
    if (!triggerWorkflows || !['create', 'update'].includes(actionName)) {
      return;
    }
    this.collectionTriggerAction(context);
  };
  constructor(workflow) {
    super(workflow);
    const { db } = workflow.app;
    db.on('approvals.afterSave', this.triggerHandler);
    db.on('executions.afterCreate', this.onExecutionCreate);
    db.on('executions.afterUpdate', this.onExecutionUpdate);
    workflow.app.use(this.middleware, { after: 'dataSource' });
  }
  async workflowTriggerAction(context, next) {
    const { triggerWorkflows, values } = context.action.params;
    if (!triggerWorkflows) {
      return context.throw(400);
    }
    const triggers = triggerWorkflows.split(',').map((trigger) => trigger.split('!'));
    const workflowRepo = this.workflow.db.getRepository('workflows');
    const workflows = await workflowRepo.find({
      filter: {
        type: ApprovalTrigger.TYPE,
        key: triggers.map((trigger) => trigger[0]),
        current: true,
        enabled: true,
      },
    });
    context.status = 202;
    await next();
    workflows.forEach(async (workflow) => {
      const trigger = triggers.find((trigger2) => trigger2[0] === workflow.key);
      const [dataSourceName, collectionName] = parseCollectionName(workflow.config.collection);
      const collecton = this.workflow.app.dataSourceManager.dataSources
        .get(dataSourceName)
        .collectionManager.getCollection(collectionName);
      const data = await collecton.repository.create({
        values: {
          ...(trigger[1] ? get(values, trigger[1]) : values),
          // createdBy: currentUser.id,
          // updatedById: currentUser.id,
        },
        context,
      });
      const approvalRepo = this.workflow.db.getRepository('approvals');
      await approvalRepo.create({
        values: {
          collectionName: workflow.config.collection,
          data: toJSON(data),
          dataKey: data.get(collecton.filterTargetKey),
          status: APPROVAL_STATUS.SUBMITTED,
          // createdBy: currentUser.id,
          // updatedById: currentUser.id,
          workflowId: workflow.id,
          workflowKey: workflow.key,
          summary: getSummary({
            summaryConfig: workflow.config.summary,
            data,
          }),
        },
        context,
      });
    });
  }
  async collectionTriggerAction(context) {
    const { triggerWorkflows = '' } = context.action.params;
    const dataSourceHeader = context.get('x-data-source') || 'main';
    const approvalRepo = this.workflow.db.getRepository('approvals');
    const triggers = triggerWorkflows.split(',').map((trigger) => trigger.split('!'));
    const triggersKeysMap = new Map(triggers);
    const workflows = Array.from(this.workflow.enabledCache.values()).filter(
      (item) => item.type === ApprovalTrigger.TYPE && triggersKeysMap.has(item.key),
    );
    for (const workflow of workflows) {
      const [dataSourceName, collectionName] = parseCollectionName(workflow.config.collection);
      const trigger = triggers.find((trigger2) => trigger2[0] === workflow.key);
      const { body: data } = context;
      if (!data) {
        return;
      }
      if (dataSourceName !== dataSourceHeader) {
        continue;
      }

      (Array.isArray(data) ? data : [data]).forEach(async (row) => {
        let dataCurrent = {};
        if (row.id) {
          // XXX: 丑陋的实现, 应该从 data 直接获取的就是有值的 data, 走通优先.
          const { repository } = this.workflow.app.dataSourceManager.dataSources
            .get(dataSourceName)
            .collectionManager.getCollection(collectionName);
          dataCurrent = await repository.findOne({
            filterByTk: data.id,
            appends: [...workflow.config.appends],
          });
        }
        let payload = row;
        if (trigger[1]) {
          const paths = trigger[1].split('.');
          for await (const field of paths) {
            if (payload.get(field)) {
              payload = payload.get(field);
            } else {
              const association = <HasOne | BelongsTo>modelAssociationByKey(payload, field);
              payload = await payload[association.accessors.get]();
            }
          }
        }
        const collection = context.app.dataSourceManager.dataSources
          .get(dataSourceName)
          .collectionManager.getCollection(collectionName);
        if (!collection || collection.model !== payload.constructor) {
          return;
        }

        // 以上是 审批摘要取值逻辑
        await approvalRepo.create({
          values: {
            collectionName: workflow.config.collection,
            data: toJSON(payload),
            dataKey: payload.get(collection.filterTargetKey),
            status: APPROVAL_STATUS.SUBMITTED,
            // createdBy: currentUser.id,
            // updatedBy: currentUser.id,
            workflowId: workflow.id,
            workflowKey: workflow.key,
            applicantRoleName: context.state.currentRole,
            summary: getSummary({
              summaryConfig: workflow.config.summary,
              data: dataCurrent,
            }),
          },
          context,
        });
      });
    }
  }
  on(workflow) {}
  off(workflow) {}
  async duplicateConfig(workflow, { transaction }) {
    const { db } = this.workflow;
    const uiSchemaRepo = db.getRepository<UiSchemaRepository>('uiSchemas');
    if (!workflow.config.applyForm) {
      return workflow.config;
    }
    const result = await uiSchemaRepo.duplicate(workflow.config.applyForm, {
      transaction,
    });
    return {
      ...workflow.config,
      applyForm: result['x-uid'],
    };
  }
}
