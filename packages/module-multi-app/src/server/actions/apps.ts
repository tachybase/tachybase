import { Context, Next } from '@tachybase/actions';
import { AppSupervisor } from '@tachybase/server';

import { NAMESPACE } from '../../constants';

export async function start(ctx: Context, next: Next) {
  const targetAppId = String(ctx.request.url.split('filterByTk=')[1]);
  const appSupervisor = AppSupervisor.getInstance();
  if (!appSupervisor.hasApp(targetAppId)) {
    appSupervisor.blockApps.delete(targetAppId);
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
    appSupervisor.blockApps.add(targetAppId);
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
    const startEnvs = params.values?.options?.startEnvs;
    if (startEnvs) {
      const dbDialect = startEnvs.split('\n').find((line) => line.startsWith('DB_DIALECT='));
      if (dbDialect) {
        const dbType = dbDialect.split('=')[1].trim();
        if (dbType !== 'postgres') {
          ctx.throw(
            400,
            ctx.t('This database does not support to create application using template', { ns: NAMESPACE }),
          );
        }
      }
    }
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
      createdBy: ctx.state.currentUser.id,
      updatedBy: ctx.state.currentUser.id,
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

async function startSingleSubApp(appSupervisor: AppSupervisor, name: string, options: any): Promise<number> {
  const subApp = await appSupervisor.getApp(name, { withOutBootStrap: true });
  if (subApp) {
    // TODO: 正在关闭的情况不做处理,防止冲突,用户可以再点一次
    return 0;
  }
  appSupervisor.blockApps.delete(name);
  await appSupervisor.bootStrapApp(name, options);
  return 1;
}

export async function startAll(ctx: Context, next: Next) {
  const db = ctx.db;
  const appSupervisor = AppSupervisor.getInstance();
  const existNames = await appSupervisor.getAppsNames();
  const applications = await db.getRepository('applications').find({
    fields: ['name', 'options'],
    filter: {
      name: {
        $notIn: existNames,
      },
    },
    raw: true,
  });
  let count = 0;
  let error;
  const all = applications.length;
  appSupervisor.blockApps.clear();
  if (all) {
    try {
      await Promise.all(
        applications.map((app) => appSupervisor.bootStrapApp(app.name, app.options).then(() => count++)),
      );
    } catch (err) {
      error = err;
    }
  }
  let errorMessage;
  if (error) {
    errorMessage = error?.message || 'server error';
  }
  ctx.body = {
    success: count,
    all,
    error: errorMessage,
  };
}

export async function stopAll(ctx: Context, next: Next) {
  const appSupervisor = AppSupervisor.getInstance();
  const subApps = await appSupervisor.getAppsNames();
  const promises = [];
  let count = 0;
  let all = 0;
  let error;
  for (const name of subApps) {
    if (name === 'main') {
      continue;
    }
    all++;
    promises.push(
      appSupervisor.removeApp(name).then(() => {
        appSupervisor.blockApps.add(name);
        count++;
      }),
    );
  }
  if (all) {
    try {
      await Promise.all(promises);
    } catch (err) {
      error = err;
    }
  }
  let errorMessage;
  if (error) {
    errorMessage = error?.message || 'server error';
  }
  ctx.body = {
    success: count,
    all,
    error: errorMessage,
  };
}
