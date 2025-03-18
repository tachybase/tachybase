import { NoPermissionError } from '@tachybase/acl';
import { snakeCase } from '@tachybase/database';

import lodash from 'lodash';

function createWithACLMetaMiddleware() {
  return async (ctx: any, next) => {
    await next();

    const dataSourceKey = ctx.get('x-data-source');
    const dataSource = ctx.app.dataSourceManager.dataSources.get(dataSourceKey);
    const db = dataSource ? dataSource.collectionManager.db : ctx.db;

    if (!db) {
      return;
    }

    const acl = dataSource ? dataSource.acl : ctx.app.acl;

    if (!ctx.action || !ctx.get('X-With-ACL-Meta') || ctx.status !== 200) {
      return;
    }

    const { resourceName, actionName } = ctx.permission;

    if (!['list', 'get'].includes(actionName)) {
      return;
    }

    const collection = db.getCollection(resourceName);

    if (!collection) {
      return;
    }

    const Model = collection.model;

    // @ts-ignore
    const primaryKeyField = Model.primaryKeyField || Model.primaryKeyAttribute;

    const dataPath = ctx.body?.rows ? 'body.rows' : 'body';
    let listData = lodash.get(ctx, dataPath);

    if (actionName === 'get') {
      listData = lodash.castArray(listData);
    }

    const inspectActions = ['view', 'update', 'destroy'];

    const actionsParams = [];

    for (const action of inspectActions) {
      const actionCtx: any = {
        db,
        get: () => {
          return undefined;
        },
        app: {
          getDb() {
            return db;
          },
        },
        getCurrentRepository: ctx.getCurrentRepository,
        action: {
          actionName: action,
          name: action,
          params: {},
          resourceName: ctx.action.resourceName,
          resourceOf: ctx.action.resourceOf,
          mergeParams() {},
        },
        state: {
          currentRole: ctx.state.currentRole,
          currentUser: (() => {
            if (!ctx.state.currentUser) {
              return null;
            }
            if (ctx.state.currentUser.toJSON) {
              return ctx.state.currentUser?.toJSON();
            }

            return ctx.state.currentUser;
          })(),
        },
        permission: {},
        throw(...args) {
          throw new NoPermissionError(...args);
        },
      };

      try {
        await acl.getActionParams(actionCtx);
      } catch (e) {
        if (e instanceof NoPermissionError) {
          continue;
        }

        throw e;
      }

      actionsParams.push([
        action,
        actionCtx.permission?.can === null && !actionCtx.permission.skip
          ? null
          : actionCtx.permission?.parsedParams || {},
        actionCtx,
      ]);
    }

    const ids = (() => {
      if (collection.options.tree) {
        if (listData.length === 0) return [];
        const getAllNodeIds = (data) => [data[primaryKeyField], ...(data.children || []).flatMap(getAllNodeIds)];
        return listData.map((tree) => getAllNodeIds(tree.toJSON())).flat();
      }

      return listData.filter(Boolean).map((item) => item[primaryKeyField]);
    })();

    // if all ids are empty, skip
    if (ids.filter(Boolean).length === 0) {
      return;
    }

    const conditions = [];

    const allAllowed = [];

    for (const [action, params, actionCtx] of actionsParams) {
      if (!params) {
        continue;
      }

      if (lodash.isEmpty(params) || lodash.isEmpty(params.filter)) {
        allAllowed.push(action);
        continue;
      }

      const queryParams = collection.repository.buildQueryOptions({
        ...params,
        context: actionCtx,
      });

      const actionSql = ctx.db.sequelize.queryInterface.queryGenerator.selectQuery(
        Model.getTableName(),
        {
          where: (() => {
            const filterObj = queryParams.where;

            if (!db.options.underscored) {
              return filterObj;
            }

            const isAssociationKey = (key) => {
              return key.startsWith('$') && key.endsWith('$');
            };

            // change camelCase to snake_case
            const iterate = (rootObj, path = []) => {
              const obj = path.length === 0 ? rootObj : lodash.get(rootObj, path);

              if (Array.isArray(obj)) {
                for (let i = 0; i < obj.length; i++) {
                  if (obj[i] === null) {
                    continue;
                  }

                  if (typeof obj[i] === 'object') {
                    iterate(rootObj, [...path, i]);
                  }
                }

                return;
              }

              Reflect.ownKeys(obj).forEach((key) => {
                if (Array.isArray(obj) && key === 'length') {
                  return;
                }

                if ((typeof obj[key] === 'object' && obj[key] !== null) || typeof obj[key] === 'symbol') {
                  iterate(rootObj, [...path, key]);
                }

                if (typeof key === 'string' && key !== snakeCase(key)) {
                  const setKey = isAssociationKey(key)
                    ? (() => {
                        const parts = key.split('.');

                        parts[parts.length - 1] = lodash.snakeCase(parts[parts.length - 1]);

                        const result = parts.join('.');

                        return result.endsWith('$') ? result : `${result}$`;
                      })()
                    : snakeCase(key);
                  const setValue = lodash.cloneDeep(obj[key]);
                  lodash.unset(rootObj, [...path, key]);

                  lodash.set(rootObj, [...path, setKey], setValue);
                }
              });
            };

            iterate(filterObj);

            return filterObj;
          })(),
          attributes: [primaryKeyField],
          includeIgnoreAttributes: false,
        },
        Model,
      );

      // like'("project->users"."id" = 17)' like'("users"."id" = 17)'
      const whereCase = actionSql.match(/WHERE (.*?);/)[1];

      conditions.push({
        whereCase,
        action,
        include: queryParams.include,
      });
    }

    let include = conditions.map((condition) => condition.include).flat();
    const whereCases = conditions.map((condition) => condition.whereCase);
    // 过滤include 根据whereCase . 或者 -> 之后第一个关联表 include才有效
    include = include.filter((inc) => {
      return conditions.some((condition) => {
        // FIXME: whereCases的格式很不固定 有 a->b 也有 a.b 至于a,b有没有引号也不确定,很奇怪,为防止报错只过滤一部分包含的情况
        // const regexWithQuotes = new RegExp(`"?${inc.association}"?[.]|"?${inc.association}"?->`);
        // return whereCases.some((whereCase) => regexWithQuotes.test(whereCase));
        return whereCases.some((whereCase) => whereCase.includes(inc.association));
      });
    });

    const results = await collection.model.findAll({
      where: {
        [primaryKeyField]: ids,
      },
      attributes: [
        primaryKeyField,
        ...conditions.map((condition) => {
          return [ctx.db.sequelize.literal(`CASE WHEN ${condition.whereCase} THEN 1 ELSE 0 END`), condition.action];
        }),
      ],
      include,
    });

    const allowedActions = inspectActions
      .map((action) => {
        if (allAllowed.includes(action)) {
          return [action, ids];
        }

        return [action, results.filter((item) => Boolean(item.get(action))).map((item) => item.get(primaryKeyField))];
      })
      .reduce((acc, [action, ids]) => {
        acc[action] = ids;
        return acc;
      }, {});

    if (actionName === 'get') {
      ctx.bodyMeta = {
        ...ctx.bodyMeta,
        allowedActions: allowedActions,
      };
    }

    if (actionName === 'list') {
      ctx.body.allowedActions = allowedActions;
    }
  };
}

export { createWithACLMetaMiddleware };
