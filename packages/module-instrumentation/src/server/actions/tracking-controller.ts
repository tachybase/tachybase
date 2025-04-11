import { Context, Next } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

import { checkEntryExists } from 'apps/build/src/utils/buildPluginUtils';

import { getDailyActiveUser } from '../hooks/getActiveUser';
import { countDataByEventFrequency } from '../hooks/getStatistics';

@Controller('instrumentation')
export class TrackingController {
  @Action('create', { acl: 'public' })
  async create(ctx: Context, next: () => Promise<any>) {
    const repo = await ctx.db.getRepository('trackingEvents');
    const version = process.env.npm_package_version;
    const currentTime = new Date().toISOString();
    const values = ctx.action.params.values.values
      ? {
          ...ctx.action.params.values,
          values: {
            ...ctx.action.params.values.values,
            version,
            createdAt: currentTime,
          },
        }
      : { ...ctx.action.params.values, createdAt: currentTime };
    await repo.create({
      values,
    });
    return next();
  }

  @Action('list', { acl: 'private' })
  async list(ctx: Context, next: () => Promise<any>) {
    const userCount = await ctx.db.getRepository('users').count();
    const ActiveUsers = await getDailyActiveUser(ctx);
    const allData = await ctx.db.getRepository('trackingEvents').find();
    const configs = await ctx.db.getRepository('statisticsConfig').find();
    let customData = {};
    for (const config of configs) {
      const count = countDataByEventFrequency(allData, config.statisticsOptions);
      customData[config.title] = count;
    }

    const result = {
      users: { ...ActiveUsers, userCount },
      customData,
    };
    ctx.body = result;
    return next();
  }
}
