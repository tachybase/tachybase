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
      if (ctx.app.name !== 'main') {
        ctx.throw(403, ctx.t('Forbidden broadcast in sub application'));
      }
      const { title = '', detail: content = '', level = 'open', notifyType } = ctx.action.params;
      let { duration } = ctx.action.params;
      if (duration < 0) {
        ctx.throw(400, ctx.t('Invalid duration', { ns: 'manual-notification' }));
      }
      const startTime = new Date();
      let endTime = ctx.action.params.endTime;
      if (!endTime) {
        endTime = new Date(Date.now() + duration * 1000);
      } else {
        endTime = new Date(endTime);
        const endDuration = (endTime.getTime() - startTime.getTime()) / 1000;
        if (endDuration < 0) {
          ctx.throw(400, ctx.t('Invalid end time', { ns: 'manual-notification' }));
        }
        duration = Math.min(duration, endDuration);
      }
      switch (notifyType) {
        case NoticeType.MODAL:
          ctx.app.noticeManager.modal(title, content, level, duration);
          break;
        case NoticeType.STATUS:
          ctx.app.noticeManager.status(content, level, duration);
          break;
        case NoticeType.TOAST:
          ctx.app.noticeManager.toast(content, level, duration);
          break;
        case NoticeType.NOTIFICATION:
        default:
          ctx.app.noticeManager.notification(title, content, level, duration);
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
