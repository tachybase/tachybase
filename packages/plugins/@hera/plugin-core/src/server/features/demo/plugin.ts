import { resolve } from 'path';
import { CollectionRepository } from '@tachybase/plugin-collection-manager';
import PluginMultiAppManager from '@tachybase/plugin-multi-app-manager';
import { UiSchemaRepository } from '@tachybase/plugin-ui-schema-storage';
import { AppSupervisor, Gateway, Plugin } from '@tachybase/server';
import { uid } from '@tachybase/utils';

import { nanoid } from 'nanoid';
import { Sequelize } from 'sequelize';

import { createNotificationRecord } from './create-notification';
import { createAliCaptchaClient, createAliCaptchaRequest } from './services';

const userApplicationPrefix = 'a_';

export class PluginDemo extends Plugin {
  async afterAdd() {
    this.app.resourcer.use(async (ctx, next) => {
      if (this.app.name !== 'main' && ctx.action.actionName === 'disable' && ctx.action.resourceName === 'pm') {
        const { filterByTk } = ctx.action.params;
        if (['disable-pm-add', '@tachybase/plugin-disable-pm-add'].includes(filterByTk)) {
          ctx.throw(403, 'No permissions');
        }
      }
      await next();
      if (this.app.name === 'main') {
        return;
      }
      if (ctx.action.actionName === 'list' && ctx.action.resourceName === 'pm') {
        ctx.body = ctx.body?.filter((item) => {
          return ![
            '@tachybase/plugin-verdaccio',
            '@tachybase/plugin-demo-platform',
            '@tachybase/plugin-disable-pm-add',
            '@tachybase/plugin-notifications',
            '@tachybase/plugin-multi-app-manager',
            '@tachybase/plugin-multi-app-share-collection',
          ].includes(item.packageName);
        });
      }
    });
  }
  async beforeLoad() {
    this.app.cronJobManager.addJob({
      cronTime: '0 0 * * *',
      onTick: async () => {
        await this.cleanExpiredApplications();
      },
    });
    this.app.cronJobManager.addJob({
      cronTime: '0 */30 * * * *',
      onTick: async () => {
        const expiredAt = new Date(new Date().getTime() - 30 * 60 * 1e3);
        await this.removeAppInMemoryThatNotActiveAfterTime(expiredAt);
      },
    });
    this.db.on('applications.beforeCreate', async (model) => {
      if (!model.name) {
        model.set('name', `${userApplicationPrefix}${uid()}`);
      }
    });
    this.db.on('applications.afterDestroy', async (model, options) => {
      const transaction = options.transaction;
      const deleteDatabase = async () => {
        const sql = `DROP DATABASE IF EXISTS "${model.get('name')}"`;
        await this.db.sequelize.query(sql);
      };
      if (!transaction) {
        await deleteDatabase();
      } else {
        transaction.afterCommit(async () => {
          await deleteDatabase();
        });
      }
    });
    this.db.on('applicationForms.beforeCreate', async (model, options) => {
      if (!model.get('templateName')) {
        throw new Error('templateName is required');
      }
      if (!model.get('email')) {
        throw new Error('email is required');
      }
      model.set('applicationName', `${userApplicationPrefix}${uid()}`);
      model.set('url', `https://${model.get('applicationName')}.${process.env.DEMO_HOST}`);
    });
    this.db.on('applicationForms.afterCreate', async (model, options) => {
      const { transaction } = options;
      transaction.afterCommit(() => {
        this.db.sequelize.transaction(async (newTransaction) => {
          try {
            const application = await this.db.getRepository('applications').create({
              transaction: newTransaction,
              values: {
                name: model.get('applicationName'),
                options: {
                  templateName: model.get('templateName'),
                  authManager: {
                    jwt: {
                      secret: nanoid(48),
                    },
                  },
                },
              },
              context: {
                templateName: model.get('templateName'),
              },
            });
            await model.setApplication(application, { transaction: newTransaction });
            const notification = await this.db.getRepository('notifications').findOne({ transaction: newTransaction });
            notification
              .send({
                to: model.get('email'),
                appId: application.get('name'),
              })
              .catch((e) => console.log(e));
          } catch (e) {
            this.app.log.error(e);
          }
        });
      });
    });
    this.app.resourcer.registerActionHandler('updateTpl', async (ctx, next) => {
      const { resourceName } = ctx.action;
      if (resourceName !== 'applications') {
        return await next();
      }
      const { filterByTk } = ctx.action.params;
      const applicationName = filterByTk;
      if (!applicationName.startsWith('demo')) {
        throw new Error('Only template application can be update to tpl');
      }
      const templateName = `${applicationName}_tpl`;
      await ctx.db.sequelize.query(`DROP DATABASE IF EXISTS "${templateName}"`);
      await ctx.db.sequelize.query(`CREATE DATABASE "${templateName}" TEMPLATE "${applicationName}"`);
      ctx.body = 'ok';
      await next();
    });
  }
  async cleanExpiredApplications() {
    const now = new Date();
    const expiredTime = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1e3);
    const applications = await this.db.getRepository('applications').find({
      filter: {
        'createdAt.$lte': expiredTime,
        // 创建时间超过两天
        'options.templateName.$ne': null,
        // 非模板应用
        'options.persistent.$not': true,
        // 非持久化应用
      },
    });
    await this.db.getRepository('applications').destroy({
      filterByTk: applications.map((application) => application.get('name')),
    });
  }
  async removeAppInMemoryThatNotActiveAfterTime(expiredAt) {
    const expiredAtInUnix = Math.floor(expiredAt.getTime() / 1e3);
    const applications = await this.db.getRepository('applications').find({
      filter: {
        'options.templateName.$ne': null,
        'options.persistent.$not': true,
      },
    });
    for (const application of applications) {
      const lastSeenAt = AppSupervisor.getInstance().lastSeenAt.get(application.get('name'));
      if (lastSeenAt && lastSeenAt < expiredAtInUnix) {
        await AppSupervisor.getInstance().removeApp(application.get('name'));
      }
    }
  }
  async load() {
    await this.db.import({ directory: resolve(__dirname, 'collections') });
    Gateway.getInstance().addAppSelectorMiddleware(async (ctx, next) => {
      if (!ctx.resolvedAppName) {
        const req = ctx.req;
        const headers = req.headers;
        const hostname = headers['x-hostname'] || headers['host'];
        const firstPart = hostname.split('.')[0];
        if (firstPart.startsWith(userApplicationPrefix)) {
          ctx.resolvedAppName = firstPart;
        }
      }
      await next();
    });
    this.app.resourcer.registerActionHandler('applicationForms:getTemplateNameUiSchema', async (ctx, next) => {
      const uiSchemaTemplates = this.db.getRepository('uiSchemaTemplates');
      const uiSchemas = this.db.getRepository<UiSchemaRepository>('uiSchemas');
      const collection = this.db.getRepository('collections');
      const instance = await uiSchemaTemplates.findOne({
        filter: {
          name: 'demo',
          collectionName: 'applicationForms',
        },
      });
      ctx.body = {
        collection: await collection.findOne({
          filter: {
            name: 'applicationForms',
          },
          appends: ['fields'],
        }),
        schema: await uiSchemas.getJsonSchema(instance['uid']),
      };
      await next();
    });
    this.app.acl.allow('applicationForms', 'getTemplateNameUiSchema', 'public');
    this.app.acl.allow('applicationForms', 'create', 'public');
    const aliCaptchaClient = createAliCaptchaClient();
    this.app.resourcer.use(async (ctx, next) => {
      if (ctx.action.actionName === 'create' && ctx.action.resourceName === 'applicationForms') {
        const { senceId } = ctx.action.params;
        const { captchaVerifyParam } = ctx.action.params.values;
        delete ctx.action.params.values.captchaVerifyParam;
        const request = createAliCaptchaRequest({
          senceId,
          captchaVerifyParam,
        });
        const resp = await aliCaptchaClient.verifyIntelligentCaptcha(request);
        const captchaVerifyResult = resp.body.result.verifyResult;
        if (!captchaVerifyResult) {
          ctx.throw(400, 'captcha verify failed');
        }
      }
      await next();
    });
    const multiAppManager = this.pm.get('multi-app-manager') as PluginMultiAppManager;
    multiAppManager.setAppDbCreator(async (app, options) => {
      const { context = {} } = options;
      const databaseOptions = app.options.database;
      // @ts-ignore
      const { host, port, username, password, database } = databaseOptions;
      const { templateName } = context;
      const client = new Sequelize({
        dialect: 'postgres',
        host,
        port,
        username,
        password,
        database: 'postgres',
      });
      if (templateName) {
        let retryCount = 0;
        let success = false;
        const maxRetries = 5;
        const retryDelay = 1e3;
        while (retryCount < maxRetries && !success) {
          try {
            const res = await client.query(`CREATE DATABASE "${database}" TEMPLATE "${templateName}_tpl"`);
            success = true;
            console.log('Database created successfully');
          } catch (error) {
            console.error('Failed to create database:', error);
            retryCount++;
            console.log(`Retrying (${retryCount})...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }
        if (!success) {
          throw new Error('Failed to create database after multiple retries');
        }
      } else {
        await client.query(`DROP DATABASE IF EXISTS "${database}"`);
        await client.query(`CREATE DATABASE "${database}"`);
      }
      await client.close();
    });
    multiAppManager.setSubAppUpgradeHandler(async (mainApp) => {
      const templateApps = await mainApp.db.getRepository('applications').find({
        filter: {
          'options.isTemplate': true,
        },
      });
      const appSupervisor = AppSupervisor.getInstance();
      for (const instance of templateApps) {
        const subApp = await appSupervisor.getApp(instance.name, {
          upgrading: true,
        });
        await subApp.runAsCLI(['upgrade'], { from: 'user' });
      }
    });
  }
  async install(options) {
    if (!this.db.inDialect('postgres')) {
      return;
    }
    if (!this.pm.get('multi-app-manager').enabled) {
      return;
    }
    await createNotificationRecord(this.app);
    const repo = this.db.getRepository<CollectionRepository>('collections');
    if (repo) {
      await repo.db2cm('applicationForms');
    }
  }
  async beforeEnable() {
    if (!this.db.inDialect('postgres')) {
      throw new Error('demo-platform plugin only support postgres');
    }
    if (!this.pm.get('multi-app-manager')?.enabled) {
      throw new Error(`${this.name} plugin need multi-app-manager plugin enabled`);
    }
    if (!this.pm.get('notifications')?.enabled && !this.pm.get('@tachybase/plugin-notifications')?.enabled) {
      throw new Error(`${this.name} plugin need notifications plugin enabled`);
    }
  }
}
