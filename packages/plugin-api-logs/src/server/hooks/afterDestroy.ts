import { Application } from '@tachybase/server';

import { getChanged } from './getFieldChange';

export async function handleDestroy(ctx) {
  const { actionName, resourceName, params } = ctx.action;
  const currentTime = new Date().toISOString();
  const apilogsRepo = ctx.db.getRepository('apiLogs');
  const currentUserId = ctx.auth?.user.id;
  const app = ctx.app as Application;
  const collection = app.mainDataSource.collectionManager.getCollection(ctx.action.resourceName);
  const changes = [];
  const { changed, data: dataBefore } = await getChanged(ctx);
  Object.keys(dataBefore).forEach((key: string) => {
    const field = collection.findField((field) => {
      return field.name === key || field.options.field === key;
    });
    if (dataBefore[key] && field && !field.options.hidden) {
      changes.push({
        field: field.options,
        before: dataBefore[key],
      });
    }
  });
  if (!changes.length) {
    return;
  }
  try {
    await apilogsRepo.create({
      values: {
        action: actionName,
        createdAt: currentTime,
        collectionName: resourceName,
        recordId: params.filterByTk,
        userId: currentUserId,
        changes,
      },
    });
  } catch (error) {
    throw new Error('Failed to create API log');
  }
}
