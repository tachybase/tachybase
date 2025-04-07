import { Plugin } from '@tachybase/server';

import { create, destroy } from './actions/api-keys';

export class PluginAPIKeysServer extends Plugin {
  resourceName = 'apiKeys';

  async beforeLoad() {
    this.app.resourcer.define({
      name: this.resourceName,
      actions: {
        create,
        destroy,
      },
      only: ['list', 'create', 'destroy'],
    });

    this.app.acl.registerSnippet({
      name: ['pm', this.name, 'configuration'].join('.'),
      actions: ['apiKeys:list', 'apiKeys:create', 'apiKeys:destroy'],
    });
  }

  async load() {
    const repo = this.db.getRepository('apiKeys');
    this.app.resourcer.use(
      async (ctx, next) => {
        const token = ctx.getBearerToken();
        // TODO 固定长度判断来优化性能
        if (token?.length !== 64) {
          return await next();
        }
        const key = await repo.findOne({
          filter: {
            accessToken: token,
          },
        });
        ctx.getBearerToken = () => {
          if (key) {
            return key.token;
          }
          return token;
        };

        await next();
      },
      { tag: 'api-access-token', before: 'auth' },
    );
    this.app.resourcer.use(
      async (ctx, next) => {
        const { resourceName, actionName } = ctx.action;
        if (resourceName === this.resourceName && ['list', 'destroy'].includes(actionName)) {
          ctx.action.mergeParams({
            filter: {
              createdById: ctx.auth.user.id,
            },
          });
        }
        await next();
      },
      { tag: 'resourceNameListDestroyFilter', after: 'auth' },
    );
  }
}

export default PluginAPIKeysServer;
