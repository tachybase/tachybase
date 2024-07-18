import { Gateway, Plugin } from '@tachybase/server';

import { authType } from '../constants';
import { getAuthUrl, redirect } from './actions/dingding';
import { DingtalkAuth } from './dingtalk-auth';

export class PluginDingdingServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.authManager.registerTypes(authType, {
      auth: DingtalkAuth,
    });
    this.app.resourcer.define({
      name: 'dingtalk',
      actions: {
        getAuthUrl: getAuthUrl,
        redirect: redirect,
      },
    });
    this.app.acl.allow('dingtalk', '*', 'public');
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

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginDingdingServer;
