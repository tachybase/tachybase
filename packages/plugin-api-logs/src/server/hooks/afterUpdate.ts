import { Context } from '@tachybase/actions';
import { Application } from '@tachybase/server';

import { getChanged } from './getFieldChange';

export async function handleUpdate(ctx: Context, next) {
  const { actionName, resourceName, params } = ctx.action;
  const currentTime = new Date().toISOString();
  const apilogsRepo = ctx.db.getRepository('apiLogs');
  const currentUserId = ctx.auth?.user.id;
  const app = ctx.app as Application;
  const collection = app.mainDataSource.collectionManager.getCollection(ctx.action.resourceName);
  const changes = [];
  const { changed, data: dataBefore } = await getChanged(ctx, params.filterByTk);
  if (!changed) {
    return next();
  }
  changed.forEach((key: string) => {
    const field = collection.findField((field) => {
      return field.name === key || field.options.field === key;
    });
    if (field && !field.options.hidden) {
      let before = dataBefore[key];
      let after = params.values[key];
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
        after: params.values[key],
        before: dataBefore[key],
      });
    }
  });
  if (!changes.length) {
    return next();
  }
  await next();
  apilogsRepo.create({
    values: {
      action: actionName,
      createdAt: currentTime,
      collectionName: resourceName,
      recordId: params.filterByTk,
      userId: currentUserId,
      changes,
    },
    hooks: false,
  });
}
