import { Context } from '@tachybase/actions';
import { Op } from '@tachybase/database';

import { SEARCH_KEYWORDS_MAX } from '../../constants';
import { FieldBase } from '../dialects/FieldBase';
import { FieldMariadb } from '../dialects/FieldMariadb';
import { FieldPostgres } from '../dialects/FieldPostgres';
import { FieldSqlite } from '../dialects/FieldSqlite';
import { processField } from '../searchField';

function getDialect(dbType: string): FieldBase {
  const handlers: { [key: string]: () => FieldBase } = {
    postgres: () => new FieldPostgres(),
    mysql: () => new FieldMariadb(), // TODO: 考虑mysql5.7的兼容性
    mariadb: () => new FieldMariadb(),
    sqlite: () => new FieldSqlite(),
  };

  const handler = handlers[dbType];
  if (!handler) {
    throw new Error(`Unsupported database type: ${dbType}`);
  }
  return handler();
}

export async function searchMiddleware(ctx: Context, next: Function) {
  const params = ctx.action.params;
  if (params.search?.keywords) {
    // 去除字符串首尾空格 并删除无效字符串
    params.search.keywords = params.search.keywords.map((v) => v.trim()).filter((v) => v);
  }
  if (!params.search?.keywords?.length) {
    return next();
  }

  // 最多关键词OR 不能超过10个
  if (params.search.keywords.length > SEARCH_KEYWORDS_MAX) {
    ctx.throw(500, `keywords max length is ${SEARCH_KEYWORDS_MAX}`);
  }

  // 指定搜索的字段
  let fields = [];
  const collection = ctx.db.getCollection(ctx.action.resourceName);
  if (params.search.fields && !params.search.isSearchAllFields) {
    fields = params.search.fields;
  } else {
    fields = [...collection.fields.keys()];
  }

  const dbType = ctx.db.sequelize.getDialect();
  // TODO: oracle,mariadb等类型支持
  const handler = getDialect(dbType);
  // 获取请求中的时区
  const timezone = ctx.get('X-Timezone') || '+00:00'; // 默认时区为零

  const searchFilterList = [];
  for (const field of fields) {
    searchFilterList.push(
      ...processField({
        field,
        handler,
        collection,
        ctx,
        search: params.search,
        timezone,
      }),
    );
  }
  if (!searchFilterList.length) {
    return next();
  }

  const searchFilter = { $or: searchFilterList };
  if (params.filter && Object.keys(params.filter).length) {
    if (Array.isArray(params.filter.$and)) {
      params.filter.$and.push(searchFilter);
    } else {
      params.filter = {
        $and: [params.filter, searchFilter],
      };
    }
  } else {
    params.filter = searchFilter;
  }

  // TODO: 后续日志会产生大量filter日志
  await next();
}
