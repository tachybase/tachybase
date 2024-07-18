import { tval } from '@tachybase/client';
import { Gateway, Plugin } from '@tachybase/server';

import { authType, namespace } from '../constants';
import { getAuthUrl, redirect } from './actions/dingding';
import { Auth } from './auth';

export class PluginDingdingServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    console.log('hello world  dingding');
    this.app.authManager.registerTypes(authType, {
      auth: Auth,
      title: tval('DingTalk', { ns: namespace }),
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
