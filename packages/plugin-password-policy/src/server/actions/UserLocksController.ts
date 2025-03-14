import { Context, Next } from '@tachybase/actions';
import { Action, Controller, Inject } from '@tachybase/utils';

@Controller('userLocks')
export class UserLocksController {
  @Action('create')
  async create(ctx: Context, next: Next) {
    const { db } = ctx;
    const now = new Date();
    const userLocksRepo = db.getRepository('userLocks');

    // 清理过期记录 TODO: 可能需要事务
    await userLocksRepo.destroy({
      filter: {
        expireAt: {
          $lt: now,
        },
      },
    });

    // 插入新记录
    const result = await userLocksRepo.create({
      values: ctx.action.params.values,
    });

    ctx.body = {
      success: true,
      data: result,
    };
  }
}
