import { Context, Next } from '@tachybase/actions';
import { Action, Controller, Inject } from '@tachybase/utils';

import { IPFilterService } from '../services/IPFilterService';

@Controller('ipFilter')
export class IpFilterController {
  @Inject(() => IPFilterService)
  ipFilterService: IPFilterService;

  @Action('get')
  async getConfig(ctx: Context, next: Next) {
    const repo = ctx.db.getRepository('ipFilter');
    const data = await repo.findOne();
    ctx.body = data;
    return next();
  }

  @Action('put')
  async setConfig(ctx: Context, next: Next) {
    const { values } = ctx.action.params;
    let transaction;
    try {
      transaction = await ctx.db.sequelize.transaction();
      const repo = ctx.db.getRepository('ipFilter');
      const existOne = await repo.findOne({
        transaction,
      });
      let data;
      if (!existOne) {
        data = await repo.create({
          values,
          transaction,
        });
      } else {
        data = await repo.update({
          filterByTk: values?.id,
          values,
          transaction,
        });
      }
      await transaction.commit();
      // IPFilterService 会通过事件监听器自动重新加载配置
      ctx.body = data;
    } catch (err) {
      ctx.app.logger.error('put ip filter config error', err);
      if (transaction) await transaction.rollback();
      throw err;
    }
    return next();
  }
}
