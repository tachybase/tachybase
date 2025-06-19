import qs from 'qs';

export function appSelectorMiddleware(app) {
  return async (ctx, next) => {
    const { req } = ctx;

    let subAppName;
    if (!ctx.resolvedAppName) {
      if (req.headers['x-hostname']) {
        subAppName = req.headers['x-hostname'];
      } else {
        // 类似/ws?__hostname=bbb.localhost
        const url = req.url;
        // 获取path和query,通过query.__hostname即为子应用的cname
        const [path, query] = url.split('?');
        if (path === '/ws' && query) {
          const queryObj = qs.parse(query);
          subAppName = queryObj.__hostname;
        }
      }

      if (!subAppName) {
        return next();
      }
      const repository = app.db.getRepository('applications');
      if (!repository) {
        await next();
        return;
      }

      try {
        const appInstance = await repository.findOne({
          filter: {
            cname: subAppName,
          },
        });
        if (appInstance) {
          ctx.resolvedAppName = appInstance.name;
        }
      } catch (error) {
        app.logger.error('Error selecting app', error);
      }
    }

    await next();
  };
}
