import { Application } from '@tachybase/server';

export async function roleDepartmentUpdate(model, option) {
  const app = this as Application;
  const { transaction } = option;
  const department = model.db.getRepository('departments').find({
    filter: {
      id: model.departmentId,
    },
    appends: ['members', 'members.selfRole'],
  });
  // TODO: 在更新所有用户之前做一次department的role前后对比，如果没有变化则不需要更新

  // 获取部门的所有用户
  const members = await department.getMembers({ transaction, append: ['selfRole'] });
  // 所有用户的selfRole需要重置
  for (const member of members) {
    await member.selfRole.resetAcl({ transaction, app });
    await member.selfRole.refreshDataSourcesAcl({ transaction, app });
  }
}
