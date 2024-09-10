import { Gateway, InstallOptions, Plugin } from '@tachybase/server';

import { authType } from '../constants';
import { getAuthCfg, redirect } from './actions';
import { WeChatAuth } from './wechat-auth';

export class WeChatAuthPlugin extends Plugin {
  afterAdd() {}

  beforeLoad() {}

  async load() {
    this.app.authManager.registerTypes(authType, {
      auth: WeChatAuth,
    });

    this.app.resourcer.define({
      name: 'wechatAuth',
      actions: {
        getAuthCfg,
        redirect,
      },
    });

    this.app.acl.allow('wechatAuth', '*', 'public');

    Gateway.getInstance().addAppSelectorMiddleware(async (ctx, next) => {
      const { req } = ctx;
      const url = new URL(req.url, `http://${req.headers.host}`);
      const params = url.searchParams;
      const state = params.get('state');
      if (!state) {
        return next();
      }
      const search = new URLSearchParams(state);
      const appName = search.get('app');
      if (appName) {
        ctx.resolvedAppName = appName;
      }
      await next();
    });
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default WeChatAuthPlugin;
