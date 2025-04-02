import { Context, Next } from '@tachybase/actions';
import { Repository } from '@tachybase/database';
import { NoticeType, WSServer } from '@tachybase/server';
import { Action, Controller } from '@tachybase/utils';

@Controller('notificationConfigs')
export class notificationsController {
  repo: Repository;
  ws: WSServer;

  @Action('send', { acl: 'private' })
  async send(ctx: Context, next: Next) {
    try {
      const { title = '', detail: content = '', level = 'open', duration = null, notifyType } = ctx.action.params;
      switch (notifyType) {
        case NoticeType.MODAL:
          ctx.app.noticeManager.modal(title, content, level);
          break;
        case NoticeType.STATUS:
          ctx.app.noticeManager.status(content, level, duration);
          break;
        case NoticeType.TOAST:
          ctx.app.noticeManager.toast(content, level);
          break;
        case NoticeType.NOTIFICATION:
        default:
          ctx.app.noticeManager.notification(title, content, level, duration);
      }
      await next();
    } catch (error) {
      ctx.throw(500, 'Failed to send notifications');
    }
  }
}
