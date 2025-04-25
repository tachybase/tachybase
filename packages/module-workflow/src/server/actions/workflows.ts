import actions, { Context, Next, utils } from '@tachybase/actions';
import { Op, Repository } from '@tachybase/database';

import Plugin from '../Plugin';
import { WorkflowModel } from '../types';

export async function update(context: Context, next) {
  const repository = utils.getRepositoryFromParams(context) as Repository;
  const { filterByTk, values } = context.action.params;
  context.action.mergeParams({
    whitelist: [
      'title',
      'description',
      'enabled',
      'triggerTitle',
      'config',
      'options',
      'type',
      'sync',
      'category',
      // TODO: 这里的 icon 和 color 是审批插件的特有字段，后续办法是在审批里覆盖这个方法, 以便分离扩展字段和核心字段
      'color',
      'icon',
    ],
  });
  // only enable/disable
  if (Object.keys(values).includes('config')) {
    const workflow = await repository.findById(filterByTk);
    if (workflow.get('executed')) {
      return context.throw(400, 'config of executed workflow can not be updated');
    }
  }
  return actions.update(context, next);
}

export async function destroy(context: Context, next) {
  const repository = utils.getRepositoryFromParams(context) as Repository;
  const { filterByTk, filter } = context.action.params;

  await context.db.sequelize.transaction(async (transaction) => {
    const items = await repository.find({
      filterByTk,
      filter,
      fields: ['id', 'key', 'current'],
      transaction,
    });
    const ids = new Set<number>(items.map((item) => item.id));
    const keysSet = new Set<string>(items.filter((item) => item.current).map((item) => item.key));
    const revisions = await repository.find({
      filter: {
        key: Array.from(keysSet),
        current: { [Op.not]: true },
      },
      fields: ['id'],
      transaction,
    });

    revisions.forEach((item) => ids.add(item.id));

    context.body = await repository.destroy({
      filterByTk: Array.from(ids),
      individualHooks: true,
      transaction,
    });
  });

  next();
}

export async function dump(context: Context, next: Next) {
  const repository = utils.getRepositoryFromParams(context);
  const { filterByTk, filter = {}, values = {} } = context.action.params;

  context.body = await context.db.sequelize.transaction(async (transaction) => {
    const origin = await repository.findOne({
      filterByTk,
      filter,
      appends: ['nodes'],
      context,
      transaction,
    });

    const revisionData = filter.key
      ? {
          key: filter.key,
          title: origin.title,
          triggerTitle: origin.triggerTitle,
          allExecuted: origin.allExecuted,
          sync: origin.sync,
          initAt: origin.initAt,
        }
      : values;

    const dumpOne = {
      ...origin.toJSON(),
      ...revisionData,
    };

    return dumpOne;
  });

  await next();
}

export async function load(context: Context, next: Next) {
  const plugin = context.app.getPlugin(Plugin);
  const repository = utils.getRepositoryFromParams(context);
  const { values = {} } = context.action.params;

  context.body = await context.db.sequelize.transaction(async (transaction) => {
    const origin = values.workflow;

    const trigger = plugin.triggers.get(origin.type);

    const instance = await repository.create({
      values: {
        title: values.title,
        description: origin.description,
        type: origin.type,
        triggerTitle: origin.triggerTitle,
        allExecuted: origin.allExecuted,
        sync: origin.sync,
        initAt: origin.initAt,
        config:
          typeof trigger.duplicateConfig === 'function'
            ? await trigger.duplicateConfig(origin, { transaction })
            : origin.config,
      },
      transaction,
    });

    const originalNodesMap = new Map();
    origin.nodes.forEach((node) => {
      originalNodesMap.set(node.id, node);
    });

    const oldToNew = new Map();
    const newToOld = new Map();
    for await (const node of origin.nodes) {
      const instruction = plugin.instructions.get(node.type);
      const newNode = await instance.createNode(
        {
          type: node.type,
          key: node.key,
          config:
            typeof instruction.duplicateConfig === 'function'
              ? await instruction.duplicateConfig(node, { transaction })
              : node.config,
          title: node.title,
          branchIndex: node.branchIndex,
        },
        { transaction },
      );
      // NOTE: keep original node references for later replacement
      oldToNew.set(node.id, newNode);
      newToOld.set(newNode.id, node);
    }

    for await (const [oldId, newNode] of oldToNew.entries()) {
      const oldNode = originalNodesMap.get(oldId);
      const newUpstream = oldNode.upstreamId ? oldToNew.get(oldNode.upstreamId) : null;
      const newDownstream = oldNode.downstreamId ? oldToNew.get(oldNode.downstreamId) : null;

      await newNode.update(
        {
          upstreamId: newUpstream?.id ?? null,
          downstreamId: newDownstream?.id ?? null,
        },
        { transaction },
      );
    }

    return instance;
  });

  await next();
}

export async function test(context: Context, next: Next) {
  const plugin = context.app.getPlugin(Plugin);
  const repository = utils.getRepositoryFromParams(context);
  const { filterByTk, filter = {}, values = {} } = context.action.params;

  if (!context.state) {
    context.state = {};
  }
  if (!context.state.messages) {
    context.state.messages = [];
  }

  const workflow = await repository.findOne({
    filterByTk,
    filter,
    appends: ['nodes'],
    context,
  });

  const result = await plugin.trigger(
    workflow,
    {
      data: values.data,
      user: context.state.currentUser,
    },
    { httpContext: context },
  );

  context.app.logger.info(result);

  context.state.messages.push({ message: 'testing' });

  context.body = 'here???';
}

export async function revision(context: Context, next: Next) {
  const plugin = context.app.getPlugin(Plugin);
  const repository = utils.getRepositoryFromParams(context);
  const { filterByTk, filter = {}, values = {} } = context.action.params;

  context.body = await context.db.sequelize.transaction(async (transaction) => {
    const origin = await repository.findOne({
      filterByTk,
      filter,
      appends: ['nodes'],
      context,
      transaction,
    });

    const trigger = plugin.triggers.get(origin.type);

    const revisionData = filter.key
      ? {
          key: filter.key,
          title: origin.title,
          triggerTitle: origin.triggerTitle,
          allExecuted: origin.allExecuted,
          sync: origin.sync,
          initAt: origin.initAt,
        }
      : values;

    const instance = await repository.create({
      values: {
        title: `${origin.title} copy`,
        description: origin.description,
        ...revisionData,
        type: origin.type,
        config:
          typeof trigger.duplicateConfig === 'function'
            ? await trigger.duplicateConfig(origin, { transaction })
            : origin.config,
      },
      transaction,
    });

    const originalNodesMap = new Map();
    origin.nodes.forEach((node) => {
      originalNodesMap.set(node.id, node);
    });

    const oldToNew = new Map();
    const newToOld = new Map();
    for await (const node of origin.nodes) {
      const instruction = plugin.instructions.get(node.type);
      const newNode = await instance.createNode(
        {
          type: node.type,
          key: node.key,
          config:
            typeof instruction.duplicateConfig === 'function'
              ? await instruction.duplicateConfig(node, { transaction })
              : node.config,
          title: node.title,
          branchIndex: node.branchIndex,
        },
        { transaction },
      );
      // NOTE: keep original node references for later replacement
      oldToNew.set(node.id, newNode);
      newToOld.set(newNode.id, node);
    }

    for await (const [oldId, newNode] of oldToNew.entries()) {
      const oldNode = originalNodesMap.get(oldId);
      const newUpstream = oldNode.upstreamId ? oldToNew.get(oldNode.upstreamId) : null;
      const newDownstream = oldNode.downstreamId ? oldToNew.get(oldNode.downstreamId) : null;

      await newNode.update(
        {
          upstreamId: newUpstream?.id ?? null,
          downstreamId: newDownstream?.id ?? null,
        },
        { transaction },
      );
    }

    return instance;
  });

  await next();
}

export async function retry(context: Context, next: Next) {
  const plugin = context.app.getPlugin(Plugin);
  const repository = utils.getRepositoryFromParams(context);
  const { filterByTk, filter = {}, values = {} } = context.action.params;
  const ExecutionRepo = context.db.getRepository('executions');

  if (!context.state) {
    context.state = {};
  }
  if (!context.state.messages) {
    context.state.messages = [];
  }
  const workflow = await repository.findOne({
    filterByTk,
    filter,
    appends: ['nodes'],
    context,
  });

  const execution = await ExecutionRepo.findOne({
    filter: { key: workflow.key },
    sort: ['-createdAt'],
  });
  if (!execution) {
    context.state.messages.push({ message: 'No execution records found for this workflow.' });
  }
  const executionId = execution.id;
  const result = await plugin.trigger(workflow, execution.context, { httpContext: context });
  context.app.logger.info(result);
  context.state.messages.push({ message: 'Execute successfully' });
  context.body = { executionId: executionId };

  await next();
}

export async function sync(context: Context, next) {
  const plugin = context.app.getPlugin(Plugin);
  const repository = utils.getRepositoryFromParams(context);
  const { filterByTk, filter = {} } = context.action.params;

  const workflows = await repository.find({
    filterByTk,
    filter,
  });

  workflows.forEach((workflow) => {
    plugin.toggle(workflow, false);
    plugin.toggle(workflow);
  });

  context.status = 204;

  await next();
}

export async function trigger(ctx: Context, next: Next) {
  if (!ctx.action.params.triggerWorkflows) {
    const plugin = ctx.app.getPlugin(Plugin) as Plugin;
    const workflow = (await ctx.db.getRepository('workflows').findById(ctx.action.params.filterByTk)) as WorkflowModel;
    // NOTE: 这里的updateData是通过前端传过来的，需要 decodeURIComponent,
    //  updateData 的约定结构是形如: updateData: { primaryKey: "id", targetKeys: []}
    const updateData = JSON.parse(decodeURIComponent(ctx.action.params?.updateData || ''));
    plugin.trigger(
      workflow,
      {
        data: {
          updateData,
          httpContext: ctx,
          user: ctx?.auth?.user,
        },
      },
      { httpContext: ctx },
    );
  } else {
    await next();
  }
}

export async function moveWorkflow(ctx: Context, next: Next) {
  const { id, targetKey } = ctx.action.params;
  if (!id || !targetKey) {
    ctx.throw(400, 'params error');
  }
  const workflowRepo = ctx.db.getRepository('workflows');
  // 为了防止出现问题,目标workflow必须是启用的
  const targetWorkflow = await workflowRepo.findOne({
    filter: {
      key: targetKey,
      enabled: true,
    },
  });
  if (!targetWorkflow) {
    ctx.throw(400, 'target workflow not found');
  }
  const sourceWorkflow = await workflowRepo.findOne({
    filter: {
      id,
    },
  });
  if (!sourceWorkflow) {
    ctx.throw(400, 'source workflow not found');
  }
  if (sourceWorkflow.key === targetKey) {
    ctx.throw(400, 'same workflow');
  }
  if (sourceWorkflow.current) {
    ctx.throw(400, 'cannot move current workflow');
  }
  if (sourceWorkflow.type !== targetWorkflow.type) {
    ctx.throw(400, 'the type is different');
  }
  const { allExecuted } = targetWorkflow;
  const transaction = await ctx.db.sequelize.transaction();
  await workflowRepo.update({
    values: { key: targetKey, current: null, allExecuted },
    filter: { id },
    hooks: false, // 不触发钩子
    transaction,
  });

  // 执行记录的key也要更新,方便查看执行记录
  const executionRepo = ctx.db.getRepository('executions');
  await executionRepo.update({
    values: { key: targetKey },
    filter: { workflow: { id } },
    silent: true, // 不修改updatedAt等数据
    hooks: false, // 不触发钩子
    transaction,
  });
  // 允许未启动/或者关闭approvals的也能平稳move
  const repo = ctx.db.getRepository('approvals');
  if (repo) {
    // resubmit就是workflow最新的,而不是move的那一份
    await repo.update({
      values: { workflowKey: targetKey },
      filter: { workflowId: id },
      hooks: false, // 不触发钩子
      transaction,
    });
  }
  await transaction.commit();
  ctx.body = {};
}
