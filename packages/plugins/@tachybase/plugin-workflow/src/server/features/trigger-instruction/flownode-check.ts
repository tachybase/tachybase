import { Context } from '@tachybase/actions';

import { WorkflowModel } from '../../types';

async function checkFlowNodeLoop(ctx: Context, currentWorkflow: WorkflowModel, rootKey: string, includeRoot = true) {
  if (includeRoot && currentWorkflow.key === rootKey) {
    return true;
  }
  const workflowNodes = currentWorkflow.nodes.filter((node) => node.type === 'trigger-instruction');

  if (!workflowNodes.length) {
    return false;
  }
  if (workflowNodes.some((node) => node?.config?.workflowKey === rootKey)) {
    return true;
  }

  for (const node of workflowNodes) {
    if (!node?.config?.workflowKey) {
      continue;
    }
    const nodeWorkflow = await ctx.db.getRepository('workflows').findOne({
      filter: {
        key: node.config.workflowKey,
        enabled: true,
      },
      appends: ['nodes'],
    });
    if (!nodeWorkflow) {
      continue;
    }
    const loop = await checkFlowNodeLoop(ctx, nodeWorkflow.toJSON(), rootKey);
    if (loop) {
      return true;
    }
  }
}

export async function flownodeCheck(ctx: Context, next) {
  const { resourceName, actionName } = ctx.action;

  if (resourceName === 'flow_nodes' && actionName === 'update') {
    const { filterByTk, values } = ctx.action.params;
    if (!values) {
      return next();
    }
    const { config } = values;
    if (!config?.workflowKey) {
      return next();
    }

    const node = await ctx.db.getRepository('flow_nodes').findOne({
      filterByTk,
      appends: ['workflow'],
    });
    if (!node) {
      return next();
    }
    const currentWorkflow = await ctx.db.getRepository('workflows').findOne({
      filter: {
        key: config.workflowKey,
        enabled: true,
      },
      appends: ['nodes'],
    });
    if (!currentWorkflow) {
      return next();
    }
    // 判断是否存在环调用, 在加入工作流节点的时候判断
    const loop = await checkFlowNodeLoop(ctx, currentWorkflow, node.workflow.key);
    if (loop) {
      ctx.throw(400, ctx.t('workflow loop!', { ns: 'workflow' }));
    }
  } else if (resourceName === 'workflows' && actionName === 'update') {
    const { filterByTk, values } = ctx.action.params;
    if (!values) {
      return next();
    }
    const { enabled } = values;
    if (!enabled) {
      return next();
    }

    const workflow = await ctx.db.getRepository('workflows').findOne({
      filterByTk,
      appends: ['nodes'],
    });
    const currentWorkflow = workflow.toJSON();
    const loop = await checkFlowNodeLoop(ctx, currentWorkflow, currentWorkflow.key, false);
    if (loop) {
      ctx.throw(400, ctx.t('workflow loop!', { ns: 'workflow' }));
    }
  }
  return next();
}
