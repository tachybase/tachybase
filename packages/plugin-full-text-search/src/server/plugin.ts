import { Context } from '@tachybase/actions';
import { col, fn, Op, where } from '@tachybase/database';
import { Plugin } from '@tachybase/server';

function escapeLike(value: string) {
  return value.replace(/[_%]/g, '\\$&');
}

const stringFields = ['string', 'text', 'sequence', 'uid', 'integer', 'float'];
const numberFields = ['bigInt', 'double']; // 目前支持转成字符串全文搜索
const dateFields = ['date', 'datetime', 'timestamp']; // 目前支持转成字符串全文搜索
// TODO: 考虑支持 json, array

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
        let fields = [];
        const collection = ctx.db.getCollection(ctx.action.resourceName);
        const fieldInfo = collection.fields;
        if (params.search.fields && !params.search.isSearchAllFields) {
          fields = params.search.fields;
        } else {
          fields = [...collection.fields.keys()];
        }

        // 获取请求中的时区
        const utcOffset = ctx.get('X-Timezone') || 'Asia/Shanghai'; // 默认时区为 'Asia/Shanghai'

        const dbType = ctx.db.sequelize.getDialect();

        const searchFilter = fields.reduce((acc, field) => {
          const type = fieldInfo.get(field)?.type;

          // 不能查询的类型: sort, boolean, tstzrange, virtual, formula, context, password
          if (stringFields.includes(type)) {
            const searchObj = {
              [Op.or]: [],
            };
            for (const keyword of params.search.keywords) {
              searchObj[Op.or].push({
                [field]: {
                  [dbType === 'postgres' ? Op.iLike : Op.like]: `%${escapeLike(keyword)}%`,
                },
              });
            }
            acc.push(searchObj);
          } else if (numberFields.includes(type)) {
            let castFunction = '';

            // 根据数据库类型选择 CAST 函数
            if (dbType === 'mysql') {
              castFunction = `CAST("${field}" AS CHAR)`;
            } else {
              castFunction = `CAST("${field}" AS TEXT)`;
            }

            const searchObj = {
              [Op.or]: [],
            };
            for (const keyword of params.search.keywords) {
              searchObj[Op.or].push({
                where: where(ctx.db.sequelize.literal(`CAST(${ctx.db.sequelize.col(field)} AS TEXT)`), {
                  [dbType === 'postgres' ? Op.iLike : Op.like]: `%${escapeLike(keyword)}%`,
                }),
              });
            }
            // acc.push(searchObj);
          } else if (dateFields.includes(type)) {
            let formatStr = '';
            const info = fieldInfo.get(field);
            if (info.options?.uiSchema?.['x-component-props']?.dateFormat) {
              const props = info.options.uiSchema['x-component-props'];
              formatStr = props.dateFormat + (props.timeFormat ? ' ' + props.timeFormat : '');
            } else {
              formatStr = 'YYYY-MM-DD';
            }
            const searchObj = {
              [Op.or]: [],
            };
            for (const keyword of params.search.keywords) {
              searchObj[Op.or].push({
                [Op.and]: [
                  where(fn('CONVERT_TZ', ctx.db.sequelize.col(field), '+00:00', utcOffset, formatStr), {
                    [dbType === 'postgres' ? Op.iLike : Op.like]: `%${escapeLike(keyword)}%`,
                  }),
                ],
              });
            }
            // acc.push(searchObj);
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
