export async function userDepartmentUpdate(model, option) {
  const { userId, departmentId } = model;
  const { transaction } = option;
  const user = await model.db.getRepository('users').findOne({
    filter: {
      id: userId,
    },
    appends: ['selfRole'],
  });
  await user.selfRole.resetAcl({ transaction });
  await user.selfRole.refreshDataSourcesAcl({ transaction });
}
