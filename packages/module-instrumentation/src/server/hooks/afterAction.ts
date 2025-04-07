import { Context } from '@tachybase/actions';
import { Application } from '@tachybase/server';

export async function handleOtherAction(ctx: Context, next) {
  await next();
  const { actionName, resourceName, params } = ctx.action;
  // const repo = ctx.db.getRepository('serverTracking');
  const repo = ctx.db.getRepository('trackingEvents');
  const Config = await ctx.db.getRepository('serverTrackingConfig').findOne({
    filter: {
      resourceName: resourceName,
      action: actionName,
    },
  });
  const configKeys = {
    meta: Config?.keys?.meta || [],
    payload: Config?.keys?.payload || [],
  };
  const app = ctx.app as Application;
  const collection = app.mainDataSource.collectionManager.getCollection(ctx.action.resourceName);
  const currentRecordId = ctx.body?.[collection.filterTargetKey];
  const currentUserId = ctx.auth?.user.id;
  const currentTime = new Date().toISOString();

  const baseValues: Record<string, any> = {};
  if (configKeys.meta.includes('userId')) baseValues.userId = currentUserId;
  if (configKeys.meta.includes('recordId')) baseValues.recordId = currentRecordId;
  if (configKeys.meta.includes('createdAt')) baseValues.createdAt = currentTime;

  function findValuesByKeys(obj: any, keys: string[]): Record<string, any[]> {
    const result: Record<string, any[]> = {};

    const traverse = (current: any) => {
      if (typeof current !== 'object' || current === null) return;

      for (const [k, v] of Object.entries(current)) {
        if (keys.includes(k)) {
          if (!result[k]) result[k] = [];
          result[k].push(v);
        }
        traverse(v);
      }
    };

    traverse(obj);
    return result;
  }

  const nestedValuesMap = findValuesByKeys(params, configKeys.payload);

  const finalValues = {
    meta: baseValues,
    payload: Object.fromEntries(
      Object.entries(nestedValuesMap).map(([key, value]) => [
        key,
        Array.isArray(value) && value.length === 1 ? value[0] : value,
      ]),
    ),
  };

  repo.create({
    values: {
      key: resourceName,
      type: actionName,
      values: finalValues,
    },
  });
}
