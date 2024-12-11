import { Instruction, JOB_STATUS } from '@tachybase/module-workflow';
import { UiSchemaRepository } from '@tachybase/plugin-ui-schema-storage';

import { COLLECTION_NAME_APPROVAL_CARBON_COPY } from '../../common/collection-name';
import { APPROVAL_STATUS } from '../constants/status';
import { parsePerson } from '../tools';

/** 工作流节点: 审批抄送节点 */
export default class ApprovalCarbonCopyInstruction extends Instruction {
  async run(node, prevJob, processor) {
    const context = processor.execution.context;

    const job = await processor.saveJob({
      status: JOB_STATUS.RESOLVED,
      nodeId: node.id,
      nodeKey: node.key,
      upstreamId: prevJob?.id ?? null,
    });
    const targetPersonList = await parsePerson({ node, processor, keyName: 'carbonCopyPerson' });
    if (targetPersonList && targetPersonList.length > 0) {
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
      // NOTE: 只有新发起审批的时候, 才生成抄送副本. 否则, 会生成不必要的重复副本
      if ([APPROVAL_STATUS.SUBMITTED].includes(approval.status)) {
        const CarbonCopyModel = db.getModel(COLLECTION_NAME_APPROVAL_CARBON_COPY);
        const notifiedPersonDataMap = targetPersonList.map((userId, index) => ({
          userId,
          jobId: job.id,
          nodeId: node.id,
          executionId: job.executionId,
          workflowId: node.workflowId,
          index,
          createdById: approval.createdBy?.id,
          approvalId: approval.id,
          status: approval.status,
          snapshot: approval.data,
          summary: approval.summary,
          collectionName: approval.collectionName,
          dataKey: approval.dataKey,
        }));

        await CarbonCopyModel.bulkCreate(notifiedPersonDataMap, {
          transaction: processor.transaction,
        });

        // 构造好数据后, 依次通知审批人审批
        for (const userId of targetPersonList) {
          const message = {
            userId,
            title: '{{t("Approval Carbon Copy", { ns: "@tachybase/plugin-workflow-approval" })}}',
            content: '',
            jsonContent: approval.summary,
            collectionName: approval.collectionName,
            schemaName: node.config.showCarbonCopyDetail,
          };
          this.workflow.app.messageManager.sendMessage(+userId, message);
        }
      }
    }

    return job;
  }

  async duplicateConfig(node, { transaction }) {
    const keyName = 'showCarbonCopyDetail';
    const uiSchemaRepo = this.workflow.app.db.getRepository<UiSchemaRepository>('uiSchemas');
    if (!node.config[keyName]) {
      return node.config;
    }
    const resultSchema = await uiSchemaRepo.duplicate(node.config[keyName], {
      transaction,
    });

    return {
      ...node.config,
      [keyName]: resultSchema?.['x-uid'],
    };
  }
}
