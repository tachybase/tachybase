import actions, { utils } from '@tachybase/actions';
import WorkflowPlugin from '@tachybase/plugin-workflow';

import { COLLECTION_NOTICE_NAME, NOTICE_INSTRUCTION_NAMESPACE } from '../common/constants';
import { COLLECTION_WORKFLOWS_NAME } from './collections/workflowNotice';
import { NOTICE_ACTION_STATUS } from './constants';

const workflows = {
  async listWorkflowNoticeFlows(context, next) {
    context.action.mergeParams({
      filter: {
        type: NOTICE_INSTRUCTION_NAMESPACE,
        enabled: true,
      },
    });
    return actions.list(context, next);
  },
};

const workflowNotice = {
  async listCentralized(context, next) {
    const centralizedNoticeFlow = await context.db.getRepository(COLLECTION_WORKFLOWS_NAME).find({
      filter: {
        'config.centralized': true,
      },
      fields: ['id'],
    });
    context.action.mergeParams({
      filter: {
        workflowId: centralizedNoticeFlow.map((item) => item.id),
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
    const workflowNotice = await repository.findOne({
      filterByTk,
      filter: {
        userId: currentUser == null ? void 0 : currentUser.id,
      },
      appends: ['job', 'node', 'execution', 'workflow'],
      context,
    });

    if (!workflowNotice) {
      return context.throw(404);
    }

    if (
      !workflowNotice.workflow.enabled ||
      workflowNotice.execution.status ||
      workflowNotice.job.status ||
      workflowNotice.status !== NOTICE_ACTION_STATUS.PENDING ||
      !(workflowNotice.node.config.actions ?? []).includes(values.status)
    ) {
      return context.throw(400);
    }

    // TODO: 完善这里的取值逻辑
    await workflowNotice.update({
      status: values.status,
      //   comment: values.comment,
      //   snapshot: workflowNotice.approval.data,
      //   summary: workflowNotice.approval.summary,
      //   collectionName: workflowNotice.approval.collectionName,
    });

    context.body = workflowNotice.get();
    context.status = 202;

    await next();

    workflowNotice.execution.workflow = workflowNotice.workflow;
    workflowNotice.job.execution = workflowNotice.execution;
    workflowNotice.job.latestUserJob = workflowNotice.get();
    const workflow = context.app.getPlugin(WorkflowPlugin);
    const processor = workflow.createProcessor(workflowNotice.execution);

    processor.logger.info(
      `notice node (${workflowNotice.nodeId}) action trigger execution (${workflowNotice.execution.id}) to resume`,
    );
    workflow.resume(workflowNotice.job);
  },
};

export function init({ app }) {
  app.actions({
    ...make(COLLECTION_WORKFLOWS_NAME, workflows),
    ...make(COLLECTION_NOTICE_NAME, workflowNotice),
  });
}

function make(name, mod) {
  return Object.keys(mod).reduce(
    (result, key) => ({
      ...result,
      [`${name}:${key}`]: mod[key],
    }),
    {},
  );
}
