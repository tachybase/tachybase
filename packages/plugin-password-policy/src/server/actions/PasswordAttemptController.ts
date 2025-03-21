import { Context, Next } from '@tachybase/actions';
import { Action, Controller, Inject } from '@tachybase/utils';

import { PasswordAttemptService } from '../services/PasswordAttemptService';

@Controller('passwordAttempt')
export class PasswordAttemptController {
  @Inject(() => PasswordAttemptService)
  passwordAttemptService: PasswordAttemptService;

  @Action('get')
  async getConfig(ctx: Context, next: Next) {
    const repo = ctx.db.getRepository('passwordAttempt');
    const data = await repo.findOne();
    ctx.body = data;
    return next();
  }

  @Action('put')
  async setConfiguration(ctx: Context, next: Next) {
    const params = ctx.action.params;
    let transaction;
    try {
      const transaction = await ctx.db.sequelize.transaction();
      const repo = ctx.db.getRepository('passwordAttempt');
      const existOne = await repo.findOne({
        transaction,
      });
      let data;
      if (!existOne) {
        data = await repo.create({
          values: params.values,
          transaction,
        });
      } else {
        data = await repo.update({
          filterByTk: params.values.id,
          values: params.values,
          transaction,
        });
      }
      await transaction.commit();
      ctx.body = data;
    } catch (err) {
      ctx.app.logger.error('put password policy config error', err);
      transaction?.rollback();
    }
    return next();
  }
}
