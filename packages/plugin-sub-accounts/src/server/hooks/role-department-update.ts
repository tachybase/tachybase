import { Application } from '@tachybase/server';

export async function roleDepartmentUpdate(model, option) {
  const app = this as Application;
  // TODO: 是否能获取
  const department = model.department;
  if (!department) {
    return;
  }
  const { transaction } = option;
  // 获取部门的所有用户
  const members = await department.getMembers({ transaction, append: ['selfRole'] });
  // 所有用户的selfRole需要重置
  for (const member of members) {
    await member.selfRole.resetAcl({ transaction, app });
    await member.selfRole.refreshDataSourcesAcl({ transaction, app });
  }
}
