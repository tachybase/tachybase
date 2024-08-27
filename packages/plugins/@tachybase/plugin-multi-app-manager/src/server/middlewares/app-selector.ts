export function appSelectorMiddleware(app) {
  return async (ctx, next) => {
    const { req } = ctx;

    if (!ctx.resolvedAppName && req.headers['x-hostname']) {
      const repository = app.db.getRepository('applications');
      if (!repository) {
        await next();
        return;
      }

      const appInstance = await repository.findOne({
        filter: {
          cname: req.headers['x-hostname'],
        },
      });

      if (appInstance) {
        ctx.resolvedAppName = appInstance.name;
      }
    }

    await next();
  };
}
