import { CreateOptions } from '@tachybase/database';
import { Application } from '@tachybase/server';

import { MergeRoleModel } from '../model/MergeRoleModel';

/**
 * 原始角色变化会导致合成角色也发生变化
 */
export async function mergeRoleCreate(app: Application, model: MergeRoleModel, options: CreateOptions) {
  if (!model.ownerUserId) {
    return;
  }
  await model.resetAcl({ app, transaction: options.transaction });
  await model.refreshDataSourcesAcl({ app, transaction: options.transaction });
}
