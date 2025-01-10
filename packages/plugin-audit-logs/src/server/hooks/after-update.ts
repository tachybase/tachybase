import { Plugin } from '@tachybase/server';

import { LOG_TYPE_UPDATE } from '../constants';

export async function afterUpdate(model, options, plugin: Plugin) {
  const { collection } = model.constructor;
  if (!collection || !collection.options.logging) {
    return;
  }
  const changed = model.changed();
  if (!changed) {
    return;
  }
  const transaction = options.transaction;
  const currentUserId = options?.context?.state?.currentUser?.id;
  const changes = [];
  changed.forEach((key: string) => {
    const field = collection.findField((field) => {
      return field.name === key || field.options.field === key;
    });
    if (field && !field.options.hidden) {
      let before = model.previous(key);
      let after = model.get(key);
      // 出现updateById 重复一致的情况导致重复创建
      if (before === after) {
        return;
      }
      if ((before === null || before === undefined) && (after === null || after === undefined)) {
        return;
      }
      if (field.type === 'bigInt' && field.options?.isForeignKey && +before === +after) {
        return;
      }
      changes.push({
        field: field.options,
        after: model.get(key),
        before: model.previous(key),
      });
    }
  });
  if (!changes.length) {
    return;
  }
  try {
    // await AuditLog.repository.create({
    //   values: {
    //     type: LOG_TYPE_UPDATE,
    //     collectionName: model.constructor.name,
    //     recordId: model.get(model.constructor.primaryKeyAttribute),
    //     createdAt: model.get('updatedAt'),
    //     userId: currentUserId,
    //     changes,
    //   },
    //   transaction,
    //   hooks: false,
    // });

    const values = {
      type: LOG_TYPE_UPDATE,
      collectionName: model.constructor.name,
      recordId: model.get(model.constructor.primaryKeyAttribute),
      createdAt: model.get('updatedAt'),
      userId: currentUserId,
      changes,
    };

    plugin.sendSyncMessage(
      {
        type: 'auditLog',
        values,
      },
      {
        transaction,
        onlySelf: true,
      },
    );

    // if (!options.transaction) {
    //   await transaction.commit();
    // }
  } catch (error) {
    // if (!options.transaction) {
    //   await transaction.rollback();
    // }
  }
}
