import Application, { AppSupervisor, Gateway } from '@tachybase/server';

import { ApplicationModel } from './models/application';

export type AppOptionsFactory = (appName: string, mainApp: Application, preset: string) => any;

export function LazyLoadApplication(context: any) {
  return async ({
    appSupervisor,
    appName,
    options,
  }: {
    appSupervisor: AppSupervisor;
    appName: string;
    options: any;
  }) => {
    const loadButNotStart = options?.upgrading;

    const name = appName;
    if (appSupervisor.hasApp(name)) {
      return;
    }

    const applicationRecord = (await context.app.db.getRepository('applications').findOne({
      filter: {
        name,
      },
    })) as ApplicationModel | null;

    if (!applicationRecord) {
      return;
    }

    const instanceOptions = applicationRecord.get('options');

    if (instanceOptions?.standaloneDeployment && appSupervisor.runningMode !== 'single') {
      return;
    }

    if (!applicationRecord) {
      return;
    }

    const subApp = applicationRecord.registerToSupervisor(context.app, {
      appOptionsFactory: context.appOptionsFactory,
    });

    // must skip load on upgrade
    if (!loadButNotStart) {
      await subApp.runCommand('start', '--quickstart');
    }
  };
}

export function onAfterStart(db: any) {
  return async (app: Application) => {
    const repository = db.getRepository('applications');
    const appSupervisor = AppSupervisor.getInstance();

    app.setMaintainingMessage('starting sub applications...');

    if (appSupervisor.runningMode === 'single') {
      Gateway.getInstance().addAppSelectorMiddleware((ctx) => (ctx.resolvedAppName = appSupervisor.singleAppName));

      // If the sub application is running in single mode, register the application automatically
      try {
        await AppSupervisor.getInstance().getApp(appSupervisor.singleAppName);
      } catch (err) {
        console.error('Auto register sub application in single mode failed: ', appSupervisor.singleAppName, err);
      }
      return;
    }

    try {
      const subApps = await repository.find({
        filter: {
          'options.autoStart': true,
        },
      });

      const promises = [];

      for (const subAppInstance of subApps) {
        promises.push(
          (async () => {
            if (!appSupervisor.hasApp(subAppInstance.name)) {
              await AppSupervisor.getInstance().getApp(subAppInstance.name);
            }
          })(),
        );
      }

      await Promise.all(promises);
    } catch (err) {
      console.error('Auto register sub applications failed: ', err);
    }
  };
}
