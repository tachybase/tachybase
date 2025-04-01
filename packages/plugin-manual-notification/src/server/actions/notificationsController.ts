import { Context, Next } from '@tachybase/actions';
import { Repository } from '@tachybase/database';
import { WSServer } from '@tachybase/server';
import { Action, Controller } from '@tachybase/utils';

@Controller('notificationConfigs')
export class notificationsController {
  repo: Repository;
  ws: WSServer;

  @Action('send', { acl: 'private' })
  async send(ctx: Context, next: Next) {
    try {
      const { title = '', detail: content = '', level = 'open', duration = null } = ctx.action.params;
      ctx.app.noticeManager.broadcast(title, content, level, duration);
      await next();
    } catch (error) {
      ctx.throw(500, 'Failed to send notifications');
    }
  }
}
