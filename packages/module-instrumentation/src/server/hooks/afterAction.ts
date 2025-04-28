import { Context } from '@tachybase/actions';
import { Application } from '@tachybase/server';

import { WhiteListItem } from '../ServerTrackingFilter';
import { filterMatch } from './filterMatch';

export async function handleOtherAction(ctx: Context, next, whiteList: WhiteListItem[]) {
  const { actionName, resourceName, params } = ctx.action;
  const data = ctx.response?.body || null;
  const repo = ctx.db.getRepository('trackingEvents');

  const allConfigs = whiteList.filter((item) => item.resourceName === resourceName && item.action === actionName);

  function findValuesByKeys(obj: any, trackingOptions: string[]): Record<string, any[]> {
    const result: Record<string, any[]> = {};

    const traverse = (current: any) => {
      if (typeof current !== 'object' || current === null) return;

      for (const [k, v] of Object.entries(current)) {
        if (trackingOptions.includes(k)) {
          if (!result[k]) result[k] = [];
          result[k].push(v);
        }
        traverse(v);
      }
    };

    traverse(obj);

    for (const key in result) {
      const seen = new Set<string>();
      result[key] = result[key].filter((item) => {
        const str = JSON.stringify(item);
        if (seen.has(str)) return false;
        seen.add(str);
        return true;
      });
    }

    return result;
  }

  for (const Config of allConfigs) {
    const configTitle = Config?.title || '';
    const configKeys = {
      meta: Config?.options?.meta || [],
      payload: Config?.options?.payload || [],
      filter: Config?.options?.filter || {},
    };
    const app = ctx.app as Application;
    const collection = app.mainDataSource.collectionManager.getCollection(ctx.action.resourceName);
    const currentRecordId = ctx.body?.[collection?.filterTargetKey] || null;
    const currentUserId = ctx.auth?.user?.id || null;
    const currentTime = new Date().toISOString();
    const currentUserDevice = ctx.req?.headers?.['user-agent'] || null;

    const baseValues: Record<string, any> = {};
    if (configKeys.meta.includes('userId')) baseValues.userId = currentUserId;
    if (configKeys.meta.includes('recordId')) baseValues.recordId = currentRecordId;
    if (configKeys.meta.includes('createdAt')) baseValues.createdAt = currentTime;
    if (configKeys.meta.includes('user-agent')) baseValues.userAgent = currentUserDevice;

    const nestedValuesMap = findValuesByKeys({ params, data }, configKeys.payload);

    const finalValues = {
      meta: baseValues,
      payload: Object.fromEntries(
        Object.entries(nestedValuesMap).map(([key, value]) => [
          key,
          Array.isArray(value) && value.length === 1 ? value[0] : value,
        ]),
      ),
    };

    if (filterMatch(finalValues, configKeys.filter)) {
      await repo.create({
        values: {
          key: configTitle,
          type: `${resourceName}-${actionName}`,
          values: finalValues,
        },
      });
    }
  }
}
