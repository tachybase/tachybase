import { Application } from '@tachybase/server';

export async function handleCreate(ctx) {
  const { actionName, resourceName, params } = ctx.action;
  const currentTime = new Date().toISOString();
  const apilogsRepo = ctx.db.getRepository('apiLogs');
  const currentUserId = ctx.auth?.user.id;
  const currentRecordId = params.filterByTk;
  const app = ctx.app as Application;
  const collection = app.mainDataSource.collectionManager.getCollection(ctx.action.resourceName);
  const changes = [];
  const changed = params.values;
  if (changed) {
    Object.keys(changed).forEach((key: string) => {
      const field = collection.findField((field) => {
        return field.name === key || field.options.field === key;
      });
      if (changed[key] && field && !field.options.hidden) {
        changes.push({
          field: field.options,
          after: changed[key],
        });
      }
    });
  }
  if (!changes.length) {
    return;
  }
  try {
    await apilogsRepo.create({
      values: {
        action: actionName,
        createdAt: currentTime,
        collectionName: resourceName,
        recordId: currentRecordId,
        userId: currentUserId,
        changes,
      },
    });
  } catch (error) {
    throw new Error('Failed to create API log');
  }
}
