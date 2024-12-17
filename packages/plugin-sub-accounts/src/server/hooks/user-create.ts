import { CreateOptions, Model } from '@tachybase/database';

import { MergeRoleModel } from '../model/MergeRoleModel';

export async function createMergeRole(user: Model, options: CreateOptions) {
  const { transaction } = options;
  const roleRepo = user.db.getRepository('roles');
  const roleName = `m_${user.id}`;
  const mergeRole = {
    title: `{{${user.id} + '_' + t("All")}}`,
    name: roleName,
    ownerUserId: user.id,
  };
  const mergeRoleModel = (await roleRepo.create({ values: mergeRole, transaction })) as MergeRoleModel;
  await mergeRoleModel.resetAcl({ acl: this.acl, transaction });
}
