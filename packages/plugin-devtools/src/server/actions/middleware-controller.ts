import { Context } from '@tachybase/actions';

const MiddlewareOrderResource = {
  name: 'middlewares',
  actions: {
    get: async (ctx: Context, next: () => Promise<any>) => {
      const data = [
        {
          name: 'use-middleware',
          items: ctx.app.middleware._items,
        },
        {
          name: 'acl-middlewares',
          items: ctx.app.acl.middlewares._items,
        },
        {
          name: 'resourcer-middlewares',
          items: ctx.app.resourcer.middlewares._items,
        },
      ];
      const mergedItems = [];
      data.forEach((group) => {
        group.items.forEach((item) => {
          item.belongto = group.name;

          item.path =
            ctx.app.middlewareSourceMap.get(item.node) ||
            ctx.app.resourcer.middlewareSourceMap.get(item.node) ||
            ctx.app.acl.middlewareSourceMap.get(item.node) ||
            'Unknown Path'; // 默认值

          mergedItems.push(item);
        });
      });
      mergedItems.forEach((middleware) => {
        middleware.files = [];
      });
      mergedItems
        .filter((middleware) => middleware.belongto === 'acl-middlewares')
        .forEach((aclMiddleware) => {
          const aclGroup = mergedItems.find((middleware) => middleware.group === 'acl');
          if (aclGroup) {
            aclGroup.files.push(aclMiddleware);
          }
        });

      mergedItems
        .filter((middleware) => middleware.belongto === 'resourcer-middlewares')
        .forEach((resourcerMiddleware) => {
          const restAPIGroup = mergedItems.find((middleware) => middleware.group === 'restApi');
          if (restAPIGroup) {
            restAPIGroup.files.push(resourcerMiddleware);
          }
        });

      const useMiddlewares = mergedItems.filter((middleware) => middleware.belongto === 'use-middleware');

      function simplifyMiddlewareStructure(middleware) {
        return {
          name: middleware.group,
          path: middleware.path,
          seq: middleware.seq,
          belongto: middleware.belongto,
          files: middleware.files.map(simplifyMiddlewareStructure),
        };
      }

      const simplifiedResult = useMiddlewares.map(simplifyMiddlewareStructure);
      ctx.body = simplifiedResult;
    },
  },
  only: ['get'],
};

export { MiddlewareOrderResource };
