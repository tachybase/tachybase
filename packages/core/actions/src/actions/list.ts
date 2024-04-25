import { assign } from '@nocobase/utils';
import { Context } from '..';
import { getRepositoryFromParams, pageArgsToLimitArgs } from '../utils';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '../constants';
import { Op, QueryTypes } from 'sequelize';

function totalPage(total, pageSize): number {
  return Math.ceil(total / pageSize);
}

function findArgs(ctx: Context) {
  const resourceName = ctx.action.resourceName;
  const params = ctx.action.params;
  if (params.tree) {
    const [collectionName, associationName] = resourceName.split('.');
    const collection = ctx.db.getCollection(resourceName);
    // tree collection 或者关系表是 tree collection
    if (collection.options.tree && !(associationName && collectionName === collection.name)) {
      const foreignKey = collection.treeParentField?.foreignKey || 'parentId';
      assign(params, { filter: { [foreignKey]: null } }, { filter: 'andMerge' });
    }
  }
  const { tree, fields, filter, appends, except, sort } = params;

  return { tree, filter, fields, appends, except, sort };
}

async function listWithPagination(ctx: Context) {
  const { page = DEFAULT_PAGE, pageSize = DEFAULT_PER_PAGE } = ctx.action.params;

  const repository = getRepositoryFromParams(ctx);
  const resourceName = ctx.action.resourceName;
  const collection = ctx.db.getCollection(resourceName);
  const options = {
    context: ctx,
    ...findArgs(ctx),
    ...pageArgsToLimitArgs(parseInt(String(page)), parseInt(String(pageSize))),
  };

  Object.keys(options).forEach((key) => {
    if (options[key] === undefined) {
      delete options[key];
    }
  });
  let filterTreeData = [];
  let filterTreeCount = 0;
  if (ctx.action.params.tree) {
    const foreignKey = collection.treeParentField?.foreignKey || 'parentId';
    const params = Object.values(options.filter).flat()[0] || {};
    let dataIds = [];
    if (Object.entries(params).length) {
      const getParent = async (filter = {}) => {
        const data = await repository.find({
          filter: filter,
        });
        dataIds = data.map((item) => item.id);
      };
      await getParent(params);
      const allDataIds = [];
      for (const dataId of dataIds) {
        const query = `
          WITH RECURSIVE tree1 AS (
              SELECT id, "${foreignKey}"
              FROM ${collection.name}
              WHERE id = :dataId

              UNION ALL

              SELECT p.id, p."${foreignKey}"
              FROM tree1 up
              JOIN ${collection.name} p ON up."${foreignKey}" = p.id
          ),
          tree2 AS (
              SELECT id, "${foreignKey}"
              FROM ${collection.name}
              WHERE id = :dataId

              UNION ALL

              SELECT p.id, p."${foreignKey}"
              FROM tree2 down
              JOIN ${collection.name} p ON down.id = p."${foreignKey}"
          )
          SELECT DISTINCT *
          FROM (
            SELECT * 
            FROM tree1
            UNION ALL
            SELECT * 
            FROM tree2
        ) as subQuery;`;
        const filterTreeDatas = await ctx.db.sequelize.query(query, {
          replacements: {
            dataId,
          },
          type: QueryTypes.SELECT,
        });
        const newRows: any[] = filterTreeDatas;
        const filterIds = newRows.map((item) => item.id);
        allDataIds.push(...filterIds);
      }
      const ids = [...new Set(allDataIds)];
      const where = {
        id: {
          [Op.in]: ids,
        },
      };
      const [rows, count] = await repository.findAndCount({
        filter: where,
        appends: options.appends || [],
      });
      const _data = rows.map((item) => item.dataValues);
      const father = _data.filter((parent) => parent.parentId === null);

      const transTreeData = (father, allRows) => {
        father.forEach((parent, index) => {
          const children = allRows.filter((child) => child.parentId === parent.id);
          const i = index.toString();
          parent.__index = parent.father || parent.father == '0' ? parent.father + '.children.' + i : i;
          if (children?.length) {
            const transChild = children.map((child) => {
              return {
                ...child,
                father: parent.__index,
              };
            });
            parent.children = transChild;
          }
          if (parent.children?.length) {
            transTreeData(parent.children, allRows);
          }
        });
      };
      transTreeData(father, _data);
      filterTreeData = father;
      filterTreeCount = father.length;
    }
  }
  const [rows, count] = await repository.findAndCount(options);
  ctx.body = {
    count: filterTreeData.length ? filterTreeCount : count,
    rows: filterTreeData.length ? filterTreeData : rows,
    page: Number(page),
    pageSize: Number(pageSize),
    totalPage: totalPage(count, pageSize),
  };
}

async function listWithNonPaged(ctx: Context) {
  const repository = getRepositoryFromParams(ctx);

  const rows = await repository.find({ context: ctx, ...findArgs(ctx) });

  ctx.body = rows;
}

export async function list(ctx: Context, next) {
  const { paginate } = ctx.action.params;

  if (paginate === false || paginate === 'false') {
    await listWithNonPaged(ctx);
    ctx.paginate = false;
  } else {
    await listWithPagination(ctx);
    ctx.paginate = true;
  }

  await next();
}
