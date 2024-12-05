export async function userDepartmentUpdate(model, option) {
  // TODO: 是否能获取
  const department = model.department;
  const { transaction } = option;
  const departmentRoles = await department.getRoles({ transaction });
  if (!departmentRoles.length) {
    return;
  }
  const selfRole = await model.user.getSelfRole({ transaction });
  await selfRole.resetAcl({ transaction });
  await selfRole.refreshDataSourcesAcl({ transaction });
}
