import { Context, Next } from '@tachybase/actions';
import { AuthManager } from '@tachybase/auth';
import { Model, MultipleRelationRepository, Repository } from '@tachybase/database';

import { namespace } from '../../preset';

async function checkCount(repository: Repository, id: number[]) {
  // TODO(yangqia): This is a temporary solution, may cause concurrency problem.
  const count = await repository.count({
    filter: {
      enabled: true,
      id: {
        $ne: id,
      },
    },
  });
  if (count <= 0) {
    throw new Error('Please keep and enable at least one authenticator');
  }
}

export default {
  listTypes: async (ctx: Context, next: Next) => {
    ctx.body = ctx.app.authManager.listTypes();
    await next();
  },
  publicList: async (ctx: Context, next: Next) => {
    const repo = ctx.db.getRepository('authenticators');
    const authManager = ctx.app.authManager as AuthManager;
    const authenticators = await repo.find({
      fields: ['name', 'authType', 'title', 'options', 'sort'],
      filter: {
        enabled: true,
      },
      sort: 'sort',
    });
    ctx.body = authenticators.map((authenticator: Model) => {
      const authType = authManager.getAuthConfig(authenticator.authType);
      return {
        name: authenticator.name,
        authType: authenticator.authType,
        authTypeTitle: authType?.title || '',
        title: authenticator.title,
        options: authenticator.options?.public || {},
      };
    });
    await next();
  },
  destroy: async (ctx: Context, next: Next) => {
    const repository = ctx.db.getRepository('authenticators');
    const { filterByTk, filter } = ctx.action.params;
    try {
      await checkCount(repository, filterByTk);
    } catch (err) {
      ctx.throw(400, ctx.t(err.message, { ns: namespace }));
    }
    const instance = await repository.destroy({
      filter,
      filterByTk,
      context: ctx,
    });

    ctx.body = instance;
    await next();
  },
  update: async (ctx: Context, next: Next) => {
    const repository = ctx.db.getRepository('authenticators');
    const { forceUpdate, filterByTk, values, whitelist, blacklist, filter, updateAssociationValues } =
      ctx.action.params;

    if (!values.enabled) {
      try {
        await checkCount(repository, values.id);
      } catch (err) {
        ctx.throw(400, ctx.t(err.message, { ns: namespace }));
      }
    }

    ctx.body = await repository.update({
      filterByTk,
      values,
      whitelist,
      blacklist,
      filter,
      updateAssociationValues,
      context: ctx,
      forceUpdate,
    });

    await next();
  },
  bindTypes: async (ctx: Context, next: Next) => {
    const userId = ctx.auth?.user?.id;
    if (!userId) {
      ctx.throw(400, ctx.t('User not found', { ns: namespace }));
    }
    const repository = ctx.db.getRepository('authenticators');
    const list = await repository.find({
      fields: ['name', 'authType', 'title', 'description', 'sort'],
      filter: {
        enabled: true,
        'options.public.configBind': true,
      },
      sort: 'sort',
      raw: true,
    });
    if (!list.length) {
      ctx.body = list;
      return next();
    }

    const nameList = list.map((item) => item.name);

    const thirdRepo = ctx.db.getRepository('usersAuthenticators');
    const userInfo = await thirdRepo.find({
      fields: ['authenticator', 'nickname'],
      filter: {
        userId,
        authenticator: {
          $in: nameList,
        }
      },
      raw: true,
    });
    for (const item of list) {
      const userItem = userInfo.find((info) => info.authenticator === item.name)
      item.bind = userItem? true : false;
      item.nickname = userItem? userItem.nickname : '';
    }
    ctx.body = list;
    await next();
  },
  unbind: async (ctx: Context, next: Next) =>  {
    const userId = ctx.auth?.user?.id;
    const { authenticator } = ctx.action.params;
    if (!userId) {
      ctx.throw(400, ctx.t('User not found', { ns: namespace }));
    }
    await ctx.db.getRepository<MultipleRelationRepository>('authenticators.users', authenticator).remove([ userId ]);
    return next();
  }
};
