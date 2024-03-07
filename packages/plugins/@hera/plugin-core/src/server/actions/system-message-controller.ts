import { Context } from '@nocobase/actions';
import { Action, Controller } from '@nocobase/utils';

@Controller('system_notifications')
export class SystemMessageController {
  @Action('get')
  async getNotificationList(ctx: Context, next: () => Promise<any>) {
    const data = await ctx.db.sequelize.query(`
      select sm.*
      from system_message sm
      where sm.user_id = ${ctx.state.currentUser.id} and sm.read is not true
    `);
    ctx.body = data[0];
    return next();
  }
  @Action('update')
  async updateNotificationList(ctx: Context, next: () => Promise<any>) {
    const {
      params: { ids },
    } = ctx.action;
    if (ids?.length) {
      await ctx.db.sequelize.query(`
      update system_message
      set read = true
      where id in (${ids?.map(Number).join(',')})
    `);
    }
    return next();
  }
}
