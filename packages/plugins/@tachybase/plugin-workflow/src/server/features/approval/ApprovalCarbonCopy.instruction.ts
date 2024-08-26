import { UiSchemaRepository } from '@tachybase/plugin-ui-schema-storage';

import { JOB_STATUS } from '../../constants';
import Instruction from '../../instructions';
import { COLLECTION_NAME_APPROVAL_CARBON_COPY } from '../common/constants';
import { APPROVAL_STATUS } from './constants/status';
import { parsePerson } from './tools';

export default class ApprovalCarbonCopyInstruction extends Instruction {
  async run(node, prevJob, processor) {
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
