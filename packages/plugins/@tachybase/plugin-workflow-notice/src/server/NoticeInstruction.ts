import { UiSchemaRepository } from '@tachybase/plugin-ui-schema-storage';
import { Instruction, JOB_STATUS } from '@tachybase/plugin-workflow';
import { uid } from '@tachybase/utils';

import { COLLECTION_NOTICE_NAME } from '../common/constants';
import { NOTICE_ACTION_STATUS, NOTICE_STATUS } from './constants';
import { getNegotiationMode, NoticeJobStatusMap, parsePerson } from './tools';

class NoticeInstruction extends Instruction {
  async run(node, prevJob, processor) {
    const job = await processor.saveJob({
      status: JOB_STATUS.RESOLVED,
      nodeId: node.id,
      nodeKey: node.key,
      upstreamId: prevJob?.id ?? null,
    });
    const notifiedPerson = await parsePerson(node, processor);
    if (notifiedPerson && notifiedPerson.length > 0) {
      const { db } = processor.options.plugin;
      // TODO-A: 改成取上一个节点的数据集, 或者当前执行流数据源的数据集, 目前是对审批事件做了特化处理; 需要理解下其他类型的触发事件, 怎么拿数据
      const ApprovalRepo = db.getRepository('approvals');
      const approval = await ApprovalRepo.findOne({
        filter: {
          'executions.id': processor.execution.id,
        },
        fields: ['id', 'status', 'data', 'summary', 'collectionName'],
        appends: ['approvalExecutions'],
        except: ['data'],
      });

      const NoticeModel = db.getModel(COLLECTION_NOTICE_NAME);

      const notifiedPersonMapData = notifiedPerson.map((userId, index) => ({
        userId,
        jobId: job.id,
        nodeId: node.id,
        executionId: job.executionId,
        workflowId: node.workflowId,
        index,
        status: node.config.order && index ? NOTICE_ACTION_STATUS.ASSIGNED : NOTICE_ACTION_STATUS.APPROVED,
        snapshot: approval.data,
        summary: approval.summary,
        collectionName: approval.collectionName,
        dataKey: approval.dataKey,
      }));

      await NoticeModel.bulkCreate(notifiedPersonMapData, {
        transaction: processor.transaction,
      });
    }

    // notify
    this.workflow.noticeManager.notify('workflow:regular', { msg: 'done' });

    return job;
  }
  // NOTE: 目前没有用处, 不过留着作为未来如果有动作的实现的参考
  async resume(node, job, processor) {
    if (job.nodeId !== node.id) {
      const nodeJob = processor.findBranchParentJob(job, node);
      if (job.status === JOB_STATUS.RESOLVED) {
        const jobNode = processor.nodesMap.get(job.nodeId);
        const branchStart = processor.findBranchStartNode(jobNode);
        if (branchStart.branchIndex === NOTICE_ACTION_STATUS.RETURNED) {
          nodeJob.set('status', JOB_STATUS.RETRY_NEEDED);
        } else if (branchStart.branchIndex === NOTICE_ACTION_STATUS.REJECTED && node.config.endOnReject) {
          nodeJob.set('status', JOB_STATUS.REJECTED);
        }
        return nodeJob;
      }
      return processor.exit(job.status);
    }

    const { branchMode, negotiation, order } = node.config;

    const notifiedPerson = await parsePerson(node, processor);
    const NoticeRepo = this.workflow.app.db.getRepository(COLLECTION_NOTICE_NAME);
    const records = await NoticeRepo.find({
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
    const processing = Boolean(distribution.find((item) => item.status !== NOTICE_ACTION_STATUS.PENDING));

    const status =
      job.status ||
      (getNegotiationMode(negotiation).getStatus(distribution, notifiedPerson, negotiation) ?? JOB_STATUS.PENDING);

    const result = NoticeJobStatusMap[status];

    processor.logger.debug(`notice resume job and next status: ${status}`);

    job.set({
      status: status && status !== JOB_STATUS.CANCELED ? (branchMode ? JOB_STATUS.RESOLVED : status) : status,
      result,
    });

    if ((status && status !== JOB_STATUS.CANCELED) || (negotiation && processing)) {
      await job.latestUserJob.approval.update(
        {
          status: NOTICE_STATUS.PROCESSING,
        },
        { transaction: processor.transaction },
      );
    }
    const nextPerson = notifiedPerson[notifiedPerson.indexOf(job.latestUserJob.userId) + 1];

    if (!status && negotiation && order && nextPerson) {
      await NoticeRepo.update({
        values: {
          status: NOTICE_ACTION_STATUS.PENDING,
        },
        filter: {
          jobId: job.id,
          userId: nextPerson,
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
    const uiSchemaRepo = this.workflow.app.db.getRepository<UiSchemaRepository>('uiSchemas');
    if (!node.config.showNoticeDetail) {
      return node.config;
    }
    const result = await uiSchemaRepo.duplicate(node.config.showNoticeDetail, {
      transaction,
    });
    return {
      ...node.config,
      showNoticeDetail: result?.['x-uid'] ?? uid(),
    };
  }
}

export default NoticeInstruction;
