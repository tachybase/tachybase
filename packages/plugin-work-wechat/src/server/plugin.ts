import { Gateway, Plugin } from '@tachybase/server';

import { authType } from '../constants';
import { getAuthUrl, redirect } from './actions/work';
import { WorkAuth } from './work-auth';

export class PluginWorkWeChatServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.authManager.registerTypes(authType, {
      auth: WorkAuth,
    });

    this.app.resourcer.define({
      name: 'workWeChat',
      actions: {
        getAuthUrl,
        redirect,
      },
    });

    this.app.acl.allow('workWeChat', '*', 'public');

    Gateway.getInstance().addAppSelectorMiddleware(async (ctx, next) => {
      const { req } = ctx;
      const url = new URL(req.url, `http://${req.headers.host}`);
      const params = url.searchParams;
      const state = params.get('state');
      if (state) {
        const search = new URLSearchParams(state);
        const appName = search.get('app');
        if (appName) {
          ctx.resolvedAppName = appName;
        }
      }
      await next();
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginWorkWeChatServer;
