import { Application } from '@tachybase/server';

import { MergeRoleModel } from '../model/MergeRoleModel';

export async function userDepartmentUpdate(app: Application, model, option) {
  const { userId, departmentId } = model;
  const { transaction } = option;
  const user = await model.db.getRepository('users').findOne({
    filter: {
      id: userId,
    },
    appends: ['selfRole'],
  });
  const mergeRole = user.selfRole as MergeRoleModel;
  await mergeRole.resetAcl({ transaction, app });
  await mergeRole.refreshDataSourcesAcl({ transaction, app });
}
