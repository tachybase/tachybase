import { Context, Next } from '@tachybase/actions';
import { Repository } from '@tachybase/database';
import { NoticeType, WSServer } from '@tachybase/server';
import { Action, Controller } from '@tachybase/utils';

type NotificationLog = {
  title: string;
  content: string;
  level: string;
  duration: number;
  notifyType: string;
  startTime: Date;
  endTime: Date;
};

@Controller('notificationConfigs')
export class notificationsController {
  repo: Repository;
  ws: WSServer;

  recentNotification: NotificationLog[] = [];

  @Action('send', { acl: 'private' })
  async send(ctx: Context, next: Next) {
    try {
      const { title = '', detail: content = '', level = 'open', duration = null, notifyType } = ctx.action.params;
      if (ctx.app.name !== 'main') {
        ctx.throw(403, ctx.t('Forbidden broadcast in sub application'));
      }
      switch (notifyType) {
        case NoticeType.MODAL:
          ctx.app.noticeManager.modal(title, content, level, duration);
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
      const startTime = new Date();
      let endTime = ctx.action.params.endTime;
      if (!endTime) {
        endTime = new Date(Date.now() + duration * 1000);
      }
      const item: NotificationLog = {
        content,
        duration,
        level,
        notifyType,
        startTime,
        title,
        endTime,
      };
      await ctx.db.getRepository('notificationLogs').create({
        values: {
          content,
          duration,
          level,
          notifyType,
          startTime,
          title,
        },
      });
      this.recentNotification.push(item);
      await next();
    } catch (error) {
      ctx.throw(500, 'Failed to send notifications');
    }
  }

  @Action('getRecent', { acl: 'public' })
  async getRecent(ctx: Context, next: Next) {
    if (!this.recentNotification.length) {
      ctx.body = [];
      return next();
    }
    let hasChange = false;
    const list = [];
    const now = new Date();
    for (const item of this.recentNotification) {
      if (item.endTime > now) {
        list.push(item);
      } else {
        hasChange = true;
      }
    }
    if (hasChange) {
      this.recentNotification = list;
    }
    ctx.body = list;
    await next();
  }
}
