import { Context, Next } from '@tachybase/actions';
import { Application } from '@tachybase/server';
import { Action, Controller } from '@tachybase/utils';

import { NAMESPACE } from '../constants';
import { WORKER_COUNT_MAX } from './constants';
import { WorkerWebInfo } from './workerTypes';

@Controller('worker_thread')
export class WorkerWebController {
  @Action('info', { acl: 'blocked' })
  async info(ctx: Context, next: Next) {
    const app = ctx.app as Application;
    if (!app.worker) {
      ctx.body = {
        preset: 0,
        current: 0,
        busy: 0,
      } as WorkerWebInfo;
    } else {
      const preset = app.worker.getPresetWorkerNum();
      const current = app.worker.getCurrentWorkerNum();
      const busy = app.worker.getBusyWorkerNum();
      ctx.body = {
        preset,
        current,
        busy,
      };
    }
  }

  @Action('preset', { acl: 'blocked' })
  async preset(ctx: Context, next: Next) {
    const { count } = ctx.action.params.values;
    if (count < 0) {
      ctx.throw(400, ctx.t('Invalid worker count', { ns: NAMESPACE }));
    }
    const app = ctx.app as Application;
    if (count > WORKER_COUNT_MAX) {
      ctx.throw(400, ctx.t('Too many workers', { ns: NAMESPACE }));
    }
    if (!app.worker) {
      ctx.throw(400, ctx.t('Worker thread plugin not start', { ns: NAMESPACE }));
    }
    await app.worker.resetWorkerNum(count);
    ctx.body = {
      success: true,
    };
  }
}
