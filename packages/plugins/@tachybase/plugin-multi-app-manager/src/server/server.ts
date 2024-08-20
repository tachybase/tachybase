import path from 'path';
import { Database, IDatabaseOptions, Transactionable } from '@tachybase/database';
import Application, { AppSupervisor, Gateway, Plugin } from '@tachybase/server';

import lodash from 'lodash';

import { NAMESPACE } from '../constants';
import { ApplicationModel } from '../server';

export type AppDbCreator = (app: Application, options?: Transactionable & { context?: any }) => Promise<void>;
export type AppOptionsFactory = (appName: string, mainApp: Application, preset: string) => any;
export type SubAppUpgradeHandler = (mainApp: Application) => Promise<void>;

const defaultSubAppUpgradeHandle: SubAppUpgradeHandler = async (mainApp: Application) => {
  const repository = mainApp.db.getRepository('applications');
  const findOptions = {};

  const appSupervisor = AppSupervisor.getInstance();

  if (appSupervisor.runningMode == 'single') {
    findOptions['filter'] = {
      name: appSupervisor.singleAppName,
    };
  }

  const instances = await repository.find(findOptions);

  for (const instance of instances) {
    const instanceOptions = instance.get('options');

    // skip standalone deployment application
    if (instanceOptions?.standaloneDeployment && appSupervisor.runningMode !== 'single') {
      continue;
    }

    const beforeSubAppStatus = AppSupervisor.getInstance().getAppStatus(instance.name);

    const subApp = await appSupervisor.getApp(instance.name, {
      upgrading: true,
    });

    console.log({ beforeSubAppStatus });
    try {
      mainApp.setMaintainingMessage(`upgrading sub app ${instance.name}...`);
      console.log(`${instance.name}: upgrading...`);

      await subApp.runAsCLI(['upgrade'], { from: 'user' });
      if (!beforeSubAppStatus && AppSupervisor.getInstance().getAppStatus(instance.name) === 'initialized') {
        await AppSupervisor.getInstance().removeApp(instance.name);
      }
    } catch (error) {
      console.log(`${instance.name}: upgrade failed`);
      mainApp.logger.error(error);
      console.error(error);
    }
  }
};

const defaultDbCreator = async (app: Application) => {
  const databaseOptions = app.options.database as any;
  const { host, port, username, password, dialect, database } = databaseOptions;
  const tmpl = app.options?.tmpl;
  // NOTE: 数据库复制的实现暂时只支持 postgres

  if (dialect === 'mysql') {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host, port, user: username, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.close();
  }

  if (dialect === 'mariadb') {
    const mariadb = require('mariadb');
    const connection = await mariadb.createConnection({ host, port, user: username, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();
  }

  if (dialect === 'postgres') {
    const { Client } = require('pg');

    const client = new Client({
      host,
      port,
      user: username,
      password,
      database: 'postgres',
    });

    await client.connect();

    try {
      if (tmpl) {
        app.log.info(`create new app db ${database} with tmpl db ${tmpl}...`);
        const tmplExists = await client.query(`SELECT 1 FROM pg_database WHERE datname='${tmpl}'`);
        if (tmplExists.rows.length === 0) {
          // 模板不存在，报错结束
          const errMsg = `template database ${tmpl} not exists.`;
          app.log.error(errMsg);
          AppSupervisor.getInstance().setAppError(database, new Error(errMsg));
        } else {
          // 模板存在，需要先判断是否需要暂时转换为模板数据库，解除占用，禁止连接，然后开始复制，完成后撤销这些操作
          const result = await client.query(`SELECT datistemplate FROM pg_database WHERE datname='${tmpl}'`);
          const tmplDbIsTmpl = result.rows.length > 0 && result.rows[0].datistemplate;
          if (!tmplDbIsTmpl) await client.query(`ALTER DATABASE "${tmpl}" IS_TEMPLATE true`);
          await client.query(`ALTER DATABASE "${tmpl}" ALLOW_CONNECTIONS false`);
          let tmplDbInUse = true;
          do {
            const tmp = await client.query(
              `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='${tmpl}' AND pid<>pg_backend_pid()`,
            );
            tmplDbInUse = tmp.rows.length > 0;
          } while (tmplDbInUse);
          await client.query(`CREATE DATABASE "${database}" WITH TEMPLATE "${tmpl}"`);
          if (!tmplDbIsTmpl) await client.query(`ALTER DATABASE "${tmpl}" IS_TEMPLATE false`);
          await client.query(`ALTER DATABASE "${tmpl}" ALLOW_CONNECTIONS true`);
        }
      } else {
        await client.query(`CREATE DATABASE "${database}"`);
      }
    } catch (e) {
      app.log.error(JSON.stringify(e));
      AppSupervisor.getInstance().setAppError(database, e);
    }

    await client.end();
  }
};

const defaultAppOptionsFactory = (appName: string, mainApp: Application, preset: string) => {
  const rawDatabaseOptions = PluginMultiAppManager.getDatabaseConfig(mainApp);

  if (rawDatabaseOptions.dialect === 'sqlite') {
    const mainAppStorage = rawDatabaseOptions.storage;
    if (mainAppStorage !== ':memory:') {
      const mainStorageDir = path.dirname(mainAppStorage);
      rawDatabaseOptions.storage = path.join(mainStorageDir, `${appName}.sqlite`);
    }
  } else {
    rawDatabaseOptions.database = appName;
  }

  return {
    database: {
      ...rawDatabaseOptions,
      tablePrefix: '',
    },
    plugins: [preset],
    resourcer: {
      prefix: process.env.API_BASE_PATH,
    },
  };
};

export class PluginMultiAppManager extends Plugin {
  appDbCreator: AppDbCreator = defaultDbCreator;
  appOptionsFactory: AppOptionsFactory = defaultAppOptionsFactory;
  subAppUpgradeHandler: SubAppUpgradeHandler = defaultSubAppUpgradeHandle;

  static getDatabaseConfig(app: Application): IDatabaseOptions {
    let oldConfig =
      app.options.database instanceof Database
        ? (app.options.database as Database).options
        : (app.options.database as IDatabaseOptions);

    if (!oldConfig && app.db) {
      oldConfig = app.db.options;
    }

    return lodash.cloneDeep(lodash.omit(oldConfig, ['migrator']));
  }

  setSubAppUpgradeHandler(handler: SubAppUpgradeHandler) {
    this.subAppUpgradeHandler = handler;
  }

  setAppOptionsFactory(factory: AppOptionsFactory) {
    this.appOptionsFactory = factory;
  }

  setAppDbCreator(appDbCreator: AppDbCreator) {
    this.appDbCreator = appDbCreator;
  }

  beforeLoad() {
    this.db.registerModels({
      ApplicationModel,
    });
  }

  async load() {
    // after application created
    this.db.on(
      'applications.afterCreateWithAssociations',
      async (model: ApplicationModel, options: Transactionable & { context?: any }) => {
        const { transaction } = options;

        const subApp = model.registerToSupervisor(this.app, {
          appOptionsFactory: this.appOptionsFactory,
        });

        // create database
        await this.appDbCreator(subApp, {
          transaction,
          context: options.context,
        });

        const startPromise = subApp.runCommand('start', '--quickstart');

        if (options?.context?.waitSubAppInstall) {
          await startPromise;
        }
      },
    );

    this.db.on('applications.afterDestroy', async (model: ApplicationModel) => {
      await AppSupervisor.getInstance().removeApp(model.get('name') as string);
    });

    const self = this;

    async function LazyLoadApplication({
      appSupervisor,
      appName,
      options,
    }: {
      appSupervisor: AppSupervisor;
      appName: string;
      options: any;
    }) {
      const loadButNotStart = options?.upgrading;

      const name = appName;
      if (appSupervisor.hasApp(name)) {
        return;
      }

      const applicationRecord = (await self.app.db.getRepository('applications').findOne({
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

      const subApp = applicationRecord.registerToSupervisor(self.app, {
        appOptionsFactory: self.appOptionsFactory,
      });

      // must skip load on upgrade
      if (!loadButNotStart) {
        await subApp.runCommand('start', '--quickstart');
      }
    }

    AppSupervisor.getInstance().setAppBootstrapper(LazyLoadApplication);

    Gateway.getInstance().addAppSelectorMiddleware(async (ctx, next) => {
      const { req } = ctx;

      if (!ctx.resolvedAppName && req.headers['x-hostname']) {
        const repository = this.db.getRepository('applications');
        if (!repository) {
          await next();
          return;
        }

        const appInstance = await repository.findOne({
          filter: {
            cname: req.headers['x-hostname'],
          },
        });

        if (appInstance) {
          ctx.resolvedAppName = appInstance.name;
        }
      }

      await next();
    });

    this.app.on('afterStart', async (app) => {
      const repository = this.db.getRepository('applications');
      const appSupervisor = AppSupervisor.getInstance();

      this.app.setMaintainingMessage('starting sub applications...');

      if (appSupervisor.runningMode == 'single') {
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
              } else if (appSupervisor.getAppStatus(subAppInstance.name) === 'initialized') {
                (await AppSupervisor.getInstance().getApp(subAppInstance.name)).runCommand('start', '--quickstart');
              }
            })(),
          );
        }

        await Promise.all(promises);
      } catch (err) {
        console.error('Auto register sub applications failed: ', err);
      }
    });

    this.app.on('afterUpgrade', async (app, options) => {
      await this.subAppUpgradeHandler(app);
    });

    this.app.resourcer.registerActionHandlers({
      'applications:listPinned': async (ctx, next) => {
        const items = await this.db.getRepository('applications').find({
          filter: {
            pinned: true,
          },
        });
        ctx.body = items;
      },
    });

    this.app.acl.allow('applications', 'listPinned', 'loggedIn');

    this.app.acl.registerSnippet({
      name: `pm.${this.name}.applications`,
      actions: ['applications:*'],
    });

    // 注入 APP 运行状态，替换 tmpl 为 displayName(name) 的格式
    this.app.resourcer.use(async (ctx, next) => {
      await next();
      const { actionName, resourceName, params } = ctx.action;
      if (actionName === 'list' && resourceName === 'applications') {
        const applications = ctx.body.rows;
        for (const application of applications) {
          const appStatus = AppSupervisor.getInstance().getAppStatus(application.name, 'stopped');
          application.status = appStatus;
          if (application.tmpl) {
            const matchedApp = applications.find((app) => app.name === application.tmpl);
            if (matchedApp) {
              application.tmpl = `${matchedApp.displayName}(${application.tmpl})`;
            } else {
              application.tmpl = `Not Exists(${application.tmpl})`;
            }
          }
        }
      }
    });

    // 基于模板创建应用时防止使用不适配的数据库，防止存入不存在的模板
    this.app.resourcer.use(async (ctx, next) => {
      const { actionName, resourceName, params } = ctx.action;
      if (actionName === 'create' && resourceName === 'applications') {
        const tmpl = params.values?.tmpl;
        if (tmpl) {
          const dbType = (this.app.options.database as any).dialect;
          if (dbType !== 'postgres') {
            ctx.withoutDataWrapping = true;
            ctx.status = 400;
            ctx.body = {
              errors: [
                {
                  message: ctx.t('This database does not support to create application using template', {
                    ns: NAMESPACE,
                  }),
                },
              ],
            };
            return;
          }
          const matchedApp = await this.db.getRepository('applications').find({
            filter: {
              name: tmpl,
            },
          });
          if (matchedApp.length === 0) {
            ctx.withoutDataWrapping = true;
            ctx.status = 400;
            ctx.body = {
              errors: [
                {
                  message: ctx.t('Template not exists', { ns: NAMESPACE }),
                },
              ],
            };
            return;
          }
        }
      }
      await next();
    });
  }
}
