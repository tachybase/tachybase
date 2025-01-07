import { Context } from '@tachybase/actions';
import { fn, literal, Op, where } from '@tachybase/database';
import { Plugin } from '@tachybase/server';

import { SEARCH_KEYWORDS_MAX } from '../constants';

function escapeLike(value: string) {
  return value.replace(/[_%]/g, '\\$&');
}

const stringFields = ['string', 'text', 'sequence', 'uid', 'integer', 'float'];
const numberFields = ['bigInt', 'double']; // 目前支持转成字符串全文搜索
const dateFields = ['date', 'datetime', 'timestamp']; // 目前支持转成字符串全文搜索
const jsonFields = ['json', 'jsonb']; // Add json and jsonb field types to the list

function handleJsonQuery(field: string, dbType: string, keyword: string) {
  if (dbType === 'postgres') {
    // PostgreSQL - Use ->> to extract the text value from a JSON/JSONB field
    return where(
      literal(`"${field}"->>0`), // Assuming the key is '0', adjust for your actual key
      {
        [Op.iLike]: `%${escapeLike(keyword)}%`,
      },
    );
  } else if (dbType === 'mysql') {
    // MySQL - Use JSON_UNQUOTE and JSON_EXTRACT to query JSON fields
    return where(literal(`JSON_UNQUOTE(JSON_EXTRACT(\`${field}\`, '$'))`), {
      [Op.like]: `%${escapeLike(keyword)}%`,
    });
  } else if (dbType === 'sqlite') {
    // SQLite - Use json_extract to extract data from JSON field
    return where(literal(`json_extract("${field}", '$')`), {
      [Op.like]: `%${escapeLike(keyword)}%`,
    });
  } else {
    // Default case, not supporting JSON fields for this DB
    return field; // Return the field as is if not supported
  }
}

function convertTimezoneOffset(offset) {
  // 匹配时区字符串，例如 '+08:00' 或 '-05:00'
  const regex = /^([+-])(\d{2}):(\d{2})$/;

  const match = offset.match(regex);
  if (match) {
    // 提取符号、小时、分钟部分
    const sign = match[1];
    const hours = parseInt(match[2], 10); // 小时部分
    // const minutes = parseInt(match[3], 10); // 分钟部分，不需要在 'hours' 字符串中显示

    // 返回 '+8 hours' 或 '-5 hours' 格式
    return `${sign}${hours} hours`;
  }

  // 如果时区格式不符合预期，返回原始值
  return offset;
}

export class PluginFullTextSearchServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    // 针对list增加全字段搜索的能力
    this.app.resourcer.use(
      async (ctx: Context, next) => {
        if (ctx.action.actionName !== 'list') {
          return next();
        }
        const params = ctx.action.params;
        if (!params.search || !params.search?.keywords?.length) {
          return next();
        }

        if (params.search.keywords.length > SEARCH_KEYWORDS_MAX) {
          ctx.throw(500, `keywords max length is ${SEARCH_KEYWORDS_MAX}`);
        }

        let fields = [];
        const collection = ctx.db.getCollection(ctx.action.resourceName);
        const fieldInfo = collection.fields;
        if (params.search.fields && !params.search.isSearchAllFields) {
          fields = params.search.fields;
        } else {
          fields = [...collection.fields.keys()];
        }

        // 获取请求中的时区
        const utcOffset = ctx.get('X-Timezone') || '+00:00'; // 默认时区为零

        const dbType = ctx.db.sequelize.getDialect();

        const searchFilter = fields.reduce((acc, field) => {
          const type = fieldInfo.get(field)?.type;

          // 不能查询的类型: sort, boolean, tstzrange, virtual, formula, context, password
          if (stringFields.includes(type)) {
            const searchList = [];
            for (const keyword of params.search.keywords) {
              searchList.push({
                [field]: {
                  [dbType === 'postgres' ? Op.iLike : Op.like]: `%${escapeLike(keyword)}%`,
                },
              });
            }
            acc.push({
              [Op.or]: searchList,
            });
          } else if (numberFields.includes(type)) {
            let castFunction = '';
            // 根据数据库类型选择 CAST 函数
            if (dbType === 'mysql') {
              castFunction = `CAST(\`${field}\` AS CHAR)`;
            } else {
              castFunction = `CAST("${field}" AS TEXT)`;
            }
            const searchList = [];
            for (const keyword of params.search.keywords) {
              searchList.push(
                where(
                  literal(castFunction), // 使用 literal 构造原生 SQL 表达式
                  {
                    [dbType === 'postgres' ? Op.iLike : Op.like]: `%${escapeLike(keyword)}%`,
                  },
                ),
              );
            }
            acc.push({
              [Op.or]: searchList,
            });
          } else if (dateFields.includes(type)) {
            let formatStr = '';
            const info = fieldInfo.get(field);

            // 根据字段的 UI 配置设置日期格式
            if (info?.options?.uiSchema?.['x-component-props']?.dateFormat) {
              const props = info.options.uiSchema['x-component-props'];
              if (dbType === 'postgres') {
                formatStr = props.dateFormat;
                if (props.showTime) {
                  if (props.timeFormat.endsWith(' a')) {
                    formatStr += ' HH12:MI:SS'; // PostgreSQL 12小时制
                  } else {
                    formatStr += ' HH24:MI:SS'; // PostgreSQL 24小时制
                  }
                }
              } else if (dbType === 'mysql') {
                // MySQL 格式化方式
                formatStr = props.dateFormat.replace('YYYY', '%Y').replace('MM', '%m').replace('DD', '%d');
                if (props.showTime) {
                  if (props.timeFormat.endsWith(' a')) {
                    formatStr += ' %I:%i:%s %p'; // MySQL 12小时制，%p 显示 AM/PM
                  } else {
                    formatStr += ' %H:%i:%s'; // MySQL 24小时制
                  }
                }
              } else if (dbType === 'sqlite') {
                // SQLite 格式化方式
                formatStr = props.dateFormat.replace('YYYY', '%Y').replace('MM', '%m').replace('DD', '%d');
                if (props.showTime) {
                  if (props.timeFormat.endsWith(' a')) {
                    formatStr += ' %I:%M:%S %p'; // SQLite 12小时制，%p 显示 AM/PM
                  } else {
                    formatStr += ' %H:%M:%S'; // SQLite 24小时制
                  }
                }
              }
            } else {
              // 默认格式
              formatStr = dbType === 'postgres' ? 'YYYY-MM-DD' : '%Y-%m-%d';
            }

            const searchList = [];
            for (const keyword of params.search.keywords) {
              const condition =
                dbType === 'postgres'
                  ? literal(`TO_CHAR(("${field}" AT TIME ZONE 'UTC') AT TIME ZONE '${utcOffset}', '${formatStr}')`) // PostgreSQL 使用 TO_CHAR 格式化
                  : dbType === 'mysql'
                    ? fn('DATE_FORMAT', fn('CONVERT_TZ', ctx.db.sequelize.col(field), '+00:00', utcOffset), formatStr) // MySQL 使用 DATE_FORMAT 和 CONVERT_TZ
                    : dbType === 'sqlite'
                      ? fn(
                          'strftime',
                          formatStr,
                          fn('datetime', ctx.db.sequelize.col(field), convertTimezoneOffset(utcOffset)),
                        ) // SQLite 使用 strftime 和 datetime 手动调整时区
                      : ctx.db.sequelize.col(field); // 默认情况

              searchList.push(
                where(condition, {
                  [dbType === 'postgres' ? Op.iLike : Op.like]: `%${escapeLike(keyword)}%`,
                }),
              );
            }

            acc.push({
              [Op.or]: searchList,
            });
          } else if (jsonFields.includes(type)) {
            const searchList = [];
            for (const keyword of params.search.keywords) {
              searchList.push(handleJsonQuery(field, dbType, keyword));
            }
            acc.push({
              [Op.or]: searchList,
            });
          }
          return acc;
        }, []);
        if (searchFilter.length) {
          if (params.filter && Object.keys(params.filter).length) {
            params.filter = {
              $and: [params.filter, { $or: searchFilter }],
            };
          } else {
            params.filter = { $or: searchFilter };
          }
        }
        await next();
      },
      {
        tag: 'full-text-search',
        after: 'acl',
        before: 'parseVariables',
      },
    );
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginFullTextSearchServer;
