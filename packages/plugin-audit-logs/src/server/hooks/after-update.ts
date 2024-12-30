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
  const AuditLog = model.constructor.database.getCollection('auditLogs');
  const currentUserId = options?.context?.state?.currentUser?.id;
  const changes = [];
  changed.forEach((key: string) => {
    const field = collection.findField((field) => {
      return field.name === key || field.options.field === key;
    });
    if (field && !field.options.hidden) {
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
