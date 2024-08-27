import { Context, Next } from '@tachybase/actions';
import { AppSupervisor } from '@tachybase/server';

import { NAMESPACE } from '../../constants';

export async function start(ctx: Context, next: Next) {
  const targetAppId = String(ctx.request.url.split('filterByTk=')[1]);
  const appSupervisor = AppSupervisor.getInstance();
  if (!appSupervisor.hasApp(targetAppId)) {
    await AppSupervisor.getInstance().getApp(targetAppId);
    ctx.body = 'ok';
    await next();
  } else {
    ctx.throw(400, ctx.t('App already started', { ns: NAMESPACE }));
  }
}

export async function stop(ctx: Context, next: Next) {
  const targetAppId = String(ctx.request.url.split('filterByTk=')[1]);
  const appSupervisor = AppSupervisor.getInstance();
  if (appSupervisor.hasApp(targetAppId)) {
    await appSupervisor.removeApp(targetAppId);
    ctx.body = 'ok';
    await next();
  } else {
    ctx.throw(400, ctx.t('App already stopped', { ns: NAMESPACE }));
  }
}

export async function listPinned(ctx: Context, next: Next) {
  const items = await ctx.db.getRepository('applications').find({
    filter: {
      pinned: true,
    },
  });
  ctx.body = items;
  await next();
}

export async function create(ctx: Context, next: Next) {
  const params = ctx.action.params;
  const tmpl = params.values?.tmpl;
  if (tmpl) {
    const dbType = ctx.db.options.dialect;
    if (dbType !== 'postgres') {
      ctx.throw(400, ctx.t('This database does not support to create application using template', { ns: NAMESPACE }));
    }
    const matchedApp = await ctx.db.getRepository('applications').find({
      filter: {
        name: tmpl,
      },
    });
    if (matchedApp.length === 0) {
      ctx.throw(400, ctx.t('Template not exists', { ns: NAMESPACE }));
    }
    const appStatus = AppSupervisor.getInstance().getAppStatus(tmpl, 'initialized');
    if (appStatus !== 'stopped' && appStatus !== 'initialized') {
      ctx.throw(400, ctx.t('Template is in use', { ns: NAMESPACE }));
    }
  }
  await ctx.db.getRepository('applications').create({
    values: {
      ...params.values,
    },
  });
  const app = await ctx.db.getRepository('applications').find({
    filter: {
      name: (ctx.request.body as any).name,
    },
  });
  ctx.body = app;
  await next();
}
