import { Context } from '@tachybase/actions';
import { Op } from '@tachybase/database';
import { Plugin } from '@tachybase/server';

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

        const searchFilter = fields.reduce((acc, field) => {
          const type = fieldInfo.get(field)?.type;

          // 不要查询的类型: sort, boolean, tstzrange, virtual, formula, context, password
          // TODO: 考虑支持 json, array
          if (stringFields.includes(type)) {
            acc.push({
              [field]: {
                $includes: params.search.keywords,
              },
            });
          } else if (numberFields.includes(type)) {
            acc.push({
              [Op.and]: [ctx.db.sequelize.literal(`CAST("${field}" AS TEXT) LIKE '%${params.search.keywords}%'`)],
            });
          } else if (dateFields.includes(type)) {
            let formatStr = '';
            const info = fieldInfo.get(field);
            if (info.options?.uiSchema?.['x-component-props']?.dateFormat) {
              // 获取日期格式
              const props = info.options.uiSchema['x-component-props'];
              formatStr = props.dateFormat + (props.timeFormat || '');
            } else {
              formatStr = 'YYYY-MM-DD';
            }

            // 根据数据库类型选择格式化函数
            const dbType = ctx.db.sequelize.getDialect(); // 获取数据库类型
            let dateFormatFunction = '';
            if (dbType === 'postgres') {
              dateFormatFunction = `TO_CHAR((("${field}" AT TIME ZONE 'UTC') AT TIME ZONE '${utcOffset}'), '${formatStr}')`;
            } else if (dbType === 'mysql') {
              dateFormatFunction = `DATE_FORMAT((("${field}" AT TIME ZONE 'UTC') AT TIME ZONE '${utcOffset}'), '${formatStr}')`;
            } else if (dbType === 'sqlite') {
              dateFormatFunction = `strftime('${formatStr}', (("${field}" AT TIME ZONE 'UTC') AT TIME ZONE '${utcOffset}'))`;
            }

            // 将时间字段转换为请求中的时区并格式化
            acc.push({
              [Op.and]: [ctx.db.sequelize.literal(`${dateFormatFunction} LIKE '%${params.search.keywords}%'`)],
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
