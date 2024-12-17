import actions, { Context, Next, utils } from '@tachybase/actions';
import { Op, Repository } from '@tachybase/database';

import Plugin from '../Plugin';
import { WorkflowModel } from '../types';

export async function update(context: Context, next) {
  const repository = utils.getRepositoryFromParams(context) as Repository;
  const { filterByTk, values } = context.action.params;
  context.action.mergeParams({
    whitelist: ['title', 'description', 'enabled', 'triggerTitle', 'config', 'options', 'type', 'sync', 'showName'],
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
          showName: origin.showName,
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
        showName: origin.showName,
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
      data: {
        ...values.data,
        user: context.state.currentUse,
      },
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
          showName: origin.showName,
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
