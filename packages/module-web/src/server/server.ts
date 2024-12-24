import { Context } from '@tachybase/actions';
import { Application, Plugin } from '@tachybase/server';

import { getAntdLocale } from './antd';
import { getCronLocale } from './cron';
import { getCronstrueLocale } from './cronstrue';

async function getLang(ctx: Context) {
  const SystemSetting = ctx.db.getRepository('systemSettings');
  const systemSetting = await SystemSetting.findOne();
  const enabledLanguages: string[] = systemSetting.get('enabledLanguages') || [];
  const currentUser = ctx.state.currentUser;
  let lang = enabledLanguages?.[0] || process.env.APP_LANG || 'en-US';
  if (enabledLanguages.includes(currentUser?.appLang)) {
    lang = currentUser?.appLang;
  }
  if (ctx.request.query.locale && enabledLanguages.includes(ctx.request.query.locale as string)) {
    lang = ctx.request.query.locale as string;
  }
  return lang;
}

export class ModuleWeb extends Plugin {
  async beforeLoad() {}

  async install() {
    const uiSchemas = this.db.getRepository<any>('uiSchemas');
    await uiSchemas.insert({
      type: 'void',
      'x-uid': 'default-admin-menu',
      'x-component': 'Menu',
      'x-designer': 'Menu.Designer',
      'x-initializer': 'MenuItemInitializers',
      'x-component-props': {
        mode: 'mix',
        theme: 'dark',
        onSelect: '{{ onSelect }}',
        sideMenuRefScopeKey: 'sideMenuRef',
      },
      properties: {},
    });

    await uiSchemas.insert({
      type: 'void',
      'x-uid': 'default-admin-mobile',
      'x-component': 'MContainer',
      'x-designer': 'MContainer.Designer',
      'x-component-props': {},
      properties: {
        page: {
          type: 'void',
          'x-component': 'MPage',
          'x-designer': 'MPage.Designer',
          'x-component-props': {},
          properties: {
            grid: {
              type: 'void',
              'x-component': 'Grid',
              'x-initializer': 'mobilePage:addBlock',
              'x-component-props': {
                showDivider: false,
              },
            },
          },
        },
      },
    });
  }

  async load() {
    this.app.localeManager.setLocaleFn('antd', async (lang) => getAntdLocale(lang));
    this.app.localeManager.setLocaleFn('cronstrue', async (lang) => getCronstrueLocale(lang));
    this.app.localeManager.setLocaleFn('cron', async (lang) => getCronLocale(lang));
    this.app.acl.allow('app', 'getLang');
    this.app.acl.allow('app', 'getInfo');
    this.app.acl.allow('plugins', '*', 'public');
    this.app.acl.registerSnippet({
      name: 'app',
      actions: ['app:restart', 'app:clearCache'],
    });
    const dialect = this.app.db.sequelize.getDialect();

    this.app.resourcer.define({
      name: 'app',
      actions: {
        async getInfo(ctx, next) {
          const SystemSetting = ctx.db.getRepository('systemSettings');
          const systemSetting = await SystemSetting.findOne();
          const enabledLanguages: string[] = systemSetting.get('enabledLanguages') || [];
          const currentUser = ctx.state.currentUser;
          let lang = enabledLanguages?.[0] || process.env.APP_LANG || 'en-US';
          if (enabledLanguages.includes(currentUser?.appLang)) {
            lang = currentUser?.appLang;
          }
          ctx.body = {
            database: {
              dialect,
            },
            version: await ctx.app.version.get(),
            lang,
            name: ctx.app.name,
            theme: currentUser?.systemSettings?.theme || systemSetting?.options?.theme || 'default',
          };
          await next();
        },
        async getLang(ctx: Context, next) {
          const lang = await getLang(ctx);
          const app = ctx.app as Application;
          const eTag = await app.localeManager.getETag(lang);
          const resources = await app.localeManager.get(lang);
          // UUID 前36位
          const requestETag = ctx.get('If-None-Match');
          if (eTag && eTag === requestETag.substring(0, 36)) {
            ctx.status = 304;
            ctx.set('ETag', requestETag);
          } else {
            const newTag = `${eTag}-${requestETag.substring(36 + 1)}`;
            ctx.set('ETag', newTag);
            console.log(ctx.get('ETag'));
          }
          // TODO: 因为有下一个本地化插件,所以这里依然考虑要装载,不直接返回304
          ctx.body = {
            lang,
            ...resources,
          };
          await next();
        },
        async clearCache(ctx, next) {
          await ctx.cache.reset();
          await next();
        },
        async restart(ctx, next) {
          ctx.app.runAsCLI(['restart'], { from: 'user' });
          await next();
        },
      },
    });
  }
}

export default ModuleWeb;
