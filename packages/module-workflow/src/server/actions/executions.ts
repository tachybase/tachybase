import actions, { Context, Next, utils } from '@tachybase/actions';
import { Op } from '@tachybase/database';

import { EXECUTION_STATUS, JOB_STATUS } from '../constants';
import Plugin from '../Plugin';

export async function destroy(context: Context, next) {
  context.action.mergeParams({
    filter: {
      status: {
        [Op.ne]: EXECUTION_STATUS.STARTED,
      },
    },
  });

  await actions.destroy(context, next);
}

export async function cancel(context: Context, next) {
  const { filterByTk } = context.action.params;
  const ExecutionRepo = context.db.getRepository('executions');
  const JobRepo = context.db.getRepository('jobs');
  const execution = await ExecutionRepo.findOne({
    filterByTk,
    appends: ['jobs'],
  });
  if (!execution) {
    return context.throw(404);
  }
  if (execution.status) {
    return context.throw(400);
  }
  const cancelAt = new Date();
  const executionDuration = cancelAt.getTime() - execution.createdAt.getTime();
  await context.db.sequelize.transaction(async (transaction) => {
    await execution.update(
      {
        executionCost: executionDuration,
        updatedAt: cancelAt,
        status: EXECUTION_STATUS.CANCELED,
      },
      { transaction },
    );

    const pendingJobs = execution.jobs.filter((job) => job.status === JOB_STATUS.PENDING);
    await JobRepo.update({
      values: {
        status: JOB_STATUS.CANCELED,
      },
      filter: {
        id: pendingJobs.map((job) => job.id),
      },
      individualHooks: false,
      transaction,
    });
  });

  context.body = execution;
  await next();
}

export async function retry(context: Context, next: Next) {
  const plugin = context.app.getPlugin(Plugin);
  const repository = utils.getRepositoryFromParams(context);
  const { filterByTk, filter = {}, values = {} } = context.action.params;
  const WorkflowRepo = context.db.getRepository('workflows');

  if (!context.state) {
    context.state = {};
  }
  if (!context.state.messages) {
    context.state.messages = [];
  }
  if (!filterByTk) {
    context.throw(400, 'Execution ID is required');
  }
  const execution = await repository.findOne({
    filterByTk,
  });
  if (!execution) {
    context.throw(404, 'No execution records found for this workflow.');
  }
  const workflow = await WorkflowRepo.findOne({
    filterByTk: execution.workflowId,
    appends: ['nodes'],
    context,
  });
  if (!workflow) {
    context.throw(404, 'Associated workflow not found.');
  }
  try {
    const result = await plugin.trigger(workflow, execution.context, { httpContext: context });
    context.app.logger.info(result);
    context.state.messages.push({ message: 'Execute successfully' });
    context.body = { executionId: execution.id };
  } catch (error) {
    context.app.logger.error(`Failed to retry execution ${execution.id}: ${error.message}`);
    context.throw(500, 'Failed to retry execution');
  }

  await next();
}
