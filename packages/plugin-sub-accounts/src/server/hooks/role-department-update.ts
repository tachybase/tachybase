import { Application } from '@tachybase/server';

import { MergeRoleModel } from '../model/MergeRoleModel';

export async function roleDepartmentUpdate(app: Application, model, option) {
  const { transaction } = option;

  // TODO: 这样写效率有问题
  // 获取部门及其所有子孙部门的ID
  const deptRepo = model.db.getRepository('departments');
  const dept = await deptRepo.findOne({
    filter: {
      id: model.departmentId,
    },
    appends: ['children'], // Start with immediate children
  });

  // Function to recursively fetch children
  async function fetchAllChildren(department) {
    if (department.children && department.children.length) {
      for (const child of department.children) {
        const childDept = await deptRepo.findOne({
          filter: {
            id: child.id,
          },
          appends: ['children'],
        });
        child.children = childDept.children;
        await fetchAllChildren(child);
      }
    }
  }

  await fetchAllChildren(dept);

  const deptIds = [model.departmentId];

  // 递归获取所有子孙部门的ID
  function getDescendantIds(department) {
    if (department.children && department.children.length) {
      for (const child of department.children) {
        deptIds.push(child.id);
        getDescendantIds(child);
      }
    }
  }

  if (dept.children?.length) {
    getDescendantIds(dept);
  }

  // 查询这些部门下的所有用户
  const users = await model.db.getRepository('users').find({
    filter: {
      departments: {
        id: {
          $in: deptIds,
        },
      },
    },
    appends: ['selfRole'],
    transaction,
  });

  // 所有用户的selfRole需要重置
  for (const member of users) {
    const selfRole = member.selfRole as MergeRoleModel;
    await selfRole.resetAcl({ transaction, app });
    await selfRole.refreshDataSourcesAcl({ transaction, app });
  }
}
