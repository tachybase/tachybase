import { Context } from '@tachybase/actions';
import Database from '@tachybase/database';
import { Application } from '@tachybase/server';

import { getChanged } from './getFieldChange';

type insertDestroyValueType = {
  action: string;
  createdAt: Date;
  collectionName: string;
  recordId: string | number;
  userId: number;
  changes: any[];
};

export async function handleDestroy(ctx, next) {
  const insertValues: insertDestroyValueType[] = [];
  if (Array.isArray(ctx.action?.params?.filterByTk)) {
    const promises = ctx.action.params.filterByTk.map((tk) => handleGetInsertValues(ctx, tk, insertValues));
    await Promise.all(promises);
  } else {
    await handleGetInsertValues(ctx, ctx.action.params.filterByTk, insertValues);
  }
  await next();

  if (insertValues.length) {
    // 此处不再await,不应该阻塞主线程
    insertDestoryValues(ctx.db, insertValues);
  }
}

async function handleGetInsertValues(ctx, tk: string, insertValues: insertDestroyValueType[]) {
  try {
    const values = await getInsertValues(ctx, tk);
    insertValues.push(values);
  } catch (error) {
    this.app.logger.error('handleDestroy error, getInsertValues: ', {
      param: ctx.action.params,
      error,
    });
  }
}

async function getInsertValues(ctx, tk: string): Promise<insertDestroyValueType> {
  const { actionName, resourceName, params } = ctx.action;
  const apilogsRepo = ctx.db.getRepository('apiLogs');
  const currentUserId = ctx.auth?.user.id;
  const app = ctx.app as Application;

  const collection = app.mainDataSource.collectionManager.getCollection(ctx.action.resourceName);
  const changes = [];
  const { changed, data: dataBefore } = await getChanged(ctx, tk);
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
  if (changes.length) {
    return {
      action: actionName,
      createdAt: new Date(),
      collectionName: resourceName,
      recordId: tk,
      userId: currentUserId,
      changes,
    };
  }
}

async function insertDestoryValues(db: Database, records: insertDestroyValueType[]) {
  const apilogsRepo = db.getRepository('apiLogs');
  await apilogsRepo.createMany({
    records,
    hooks: false,
  });
}
