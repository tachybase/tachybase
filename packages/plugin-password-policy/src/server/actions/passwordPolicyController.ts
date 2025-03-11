import { Context, Next } from '@tachybase/actions';
import { Action, Controller, Inject } from '@tachybase/utils';

import { PasswordPolicyService } from '../services/PasswordPolicyService';

@Controller('password-policy')
export class PasswordPolicyController {
  @Inject(() => PasswordPolicyService)
  passwordPolicyService: PasswordPolicyService;

  @Action('get')
  async getConfig(ctx: Context, next: Next) {
    const repo = ctx.db.getRepository('passwordPolicyConfig');
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
      const repo = ctx.db.getRepository('passwordPolicyConfig');
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
      await this.passwordPolicyService.refreshConfig(data);
      ctx.body = data;
    } catch (err) {
      ctx.app.logger.error('put password policy config error', err);
      transaction?.rollback();
    }
    return next();
  }

  @Action('blockList')
  async getBlockList(ctx: Context, next: Next) {
    const { page = 1, pageSize = 20, filter } = ctx.action.params;
    const repo = ctx.db.getRepository('users');
    const blockUsers = await repo.find({
      filter: {
        $and: [
          {
            blockExpireAt: {
              $gt: new Date(),
            },
          },
          filter,
        ],
      },
    });
    ctx.body = blockUsers;
    return next();
  }

  @Action('updateBlockUser')
  async updateBlockUser(ctx: Context, next: Next) {
    const {
      filterByTk,
      values: { blockExpireAt },
    } = ctx.action.params;
    const repo = ctx.db.getRepository('users');
    const blockUsers = await repo.update({
      filterByTk, // TODO: 判断还是user.id还是userId
      values: {
        blockExpireAt,
      },
    });
    ctx.body = blockUsers;
    return next();
  }
}
