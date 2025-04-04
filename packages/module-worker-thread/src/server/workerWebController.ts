import { Context, Next } from '@tachybase/actions';
import { Application } from '@tachybase/server';
import { Action, Controller } from '@tachybase/utils';

import { NAMESPACE } from '../constants';
import { WORKER_COUNT, WORKER_COUNT_MAX, WORKER_COUNT_MAX_SUB, WORKER_COUNT_SUB } from './constants';
import { WorkerWebInfo } from './workerTypes';

@Controller('worker_thread')
export class WorkerWebController {
  @Action('info', { acl: 'private' })
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
      const env = app.name === 'main' ? WORKER_COUNT : WORKER_COUNT_SUB;
      const max = app.name === 'main' ? WORKER_COUNT_MAX : WORKER_COUNT_MAX_SUB;
      ctx.body = {
        preset,
        current,
        busy,
        env,
        max,
      };
    }
    return next();
  }

  @Action('preset', { acl: 'private' })
  async preset(ctx: Context, next: Next) {
    const { count } = ctx.action.params.values;
    if (count < 0) {
      ctx.throw(400, ctx.t('Invalid worker count', { ns: NAMESPACE }));
    }
    const app = ctx.app as Application;
    const countMax = app.name === 'main' ? WORKER_COUNT_MAX : WORKER_COUNT_MAX_SUB;
    if (count > countMax) {
      ctx.throw(400, ctx.t('Too many workers', { ns: NAMESPACE }));
    }
    if (!app.worker) {
      ctx.throw(400, ctx.t('Worker thread plugin not start', { ns: NAMESPACE }));
    }
    await app.worker.resetWorkerNum(count);
    ctx.body = {
      success: true,
    };
    return next();
  }

  @Action('restartAllForcely', { acl: 'private' })
  async restartAllForcely(ctx: Context, next: Next) {
    const app = ctx.app as Application;
    await app.worker.restartAllForcely();
    ctx.body = {
      success: true,
    };
    return next();
  }
}
