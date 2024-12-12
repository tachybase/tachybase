import { Context, Next } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

@Controller('cronJobs')
export class CronJobsController {
  @Action('clearLimitExecuted')
  async clearLimitExecuted(ctx: Context, next: Next) {
    const { id } = ctx.action.params;
    await ctx.db.getRepository('cronJobs').update({
      values: {
        limitExecuted: 0,
      },
      filter: {
        id,
      },
    });
  }
}
