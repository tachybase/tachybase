import { Context } from '@tachybase/actions';
import { Application } from '@tachybase/server';

export async function handleCreate(ctx: Context, next) {
  await next();
  const { actionName, resourceName, params } = ctx.action;
  const currentTime = new Date().toISOString();
  const apilogsRepo = ctx.db.getRepository('apiLogs');
  const currentUserId = ctx.auth?.user.id;

  const app = ctx.app as Application;
  const collection = app.mainDataSource.collectionManager.getCollection(ctx.action.resourceName);

  const currentRecordId = ctx.body?.[collection.filterTargetKey];
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
  apilogsRepo.create({
    values: {
      action: actionName,
      createdAt: currentTime,
      collectionName: resourceName,
      recordId: currentRecordId,
      userId: currentUserId,
      changes,
    },
    hooks: false,
  });
}
