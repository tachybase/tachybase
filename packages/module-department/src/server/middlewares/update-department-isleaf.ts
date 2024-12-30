import type { Context, Next } from '@tachybase/actions';

const updateIsLeafWhenAddChild = async (repo, parent) => {
  if (parent && parent.isLeaf !== false) {
    await repo.update({
      filter: {
        id: parent.id,
      },
      values: {
        isLeaf: false,
      },
    });
  }
};
const updateIsLeafWhenChangeChild = async (repo, oldParentId, newParentId) => {
  if (oldParentId && oldParentId !== newParentId) {
    const hasChild = await repo.count({
      filter: {
        parentId: oldParentId,
      },
    });
    if (!hasChild) {
      await repo.update({
        filter: {
          id: oldParentId,
        },
        values: {
          isLeaf: true,
        },
      });
    }
  }
};
export const updateDepartmentIsLeaf = async (ctx: Context, next: Next) => {
  const { filterByTk, values = {}, resourceName, actionName } = ctx.action.params;
  const repo = ctx.db.getRepository('departments');
  const { parent } = values;
  if (resourceName === 'departments' && actionName === 'create') {
    ctx.action.params.values = { ...values, isLeaf: true };
    await next();
    await updateIsLeafWhenAddChild(repo, parent);
    return;
  }
  if (resourceName === 'departments' && actionName === 'update') {
    const department = await repo.findOne({ filterByTk });
    await next();
    await Promise.all([
      updateIsLeafWhenChangeChild(repo, department.parentId, parent == null ? void 0 : parent.id),
      updateIsLeafWhenAddChild(repo, parent),
    ]);
    return;
  }
  if (resourceName === 'departments' && actionName === 'destroy') {
    const department = await repo.findOne({ filterByTk });
    await next();
    await updateIsLeafWhenChangeChild(repo, department.parentId, null);
    return;
  }
  return next();
};
