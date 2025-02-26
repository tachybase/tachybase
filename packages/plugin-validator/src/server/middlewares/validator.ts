import { Context, Next } from '@tachybase/actions';
import { ICollection, ICollectionManager } from '@tachybase/data-source';
import { FieldOptions } from '@tachybase/database';
import { Application } from '@tachybase/server';
import { dayjs } from '@tachybase/utils';

export async function validator(ctx: Context, next: Next) {
  const { resourceName, actionName } = ctx.action.params;
  // TODO: 如果是非main数据库也跳过
  if (!resourceName || !actionName) {
    return next();
  }
  if (!['update', 'create', 'destroy'].includes(actionName)) {
    return next();
  }
  const app = ctx.app as Application;
  const collection = app.mainDataSource.collectionManager.getCollection(resourceName);
  if (!collection) {
    return next();
  }

  // TODO: 需要考虑代码内置表接口,事件源接口, 比如api-keys自定义了create,destroy接口

  // 首先判断删除,更新的时候主键是否存在
  if (actionName === 'destroy' || actionName === 'update') {
    // 获取collection表主键类型
    // bigInt,double,string,boolean,date
    let primaryOptions = {
      type: 'bigInt',
    };
    for (const field of collection.getFields()) {
      if (field.options.primaryKey) {
        primaryOptions = field.options;
        break;
      }
    }
    const { filterByTk } = ctx.action.params;
    if (!filterByTk) {
      ctx.throw(400, 'filterByTk is required');
    }
    if (Array.isArray(filterByTk)) {
      for (const item of filterByTk) {
        if (!checkType(primaryOptions, item)) {
          ctx.throw(400, 'filterByTk type error');
        }
      }
    } else {
      if (!checkType(primaryOptions, filterByTk)) {
        ctx.throw(400, 'filterByTk type error');
      }
    }
  }

  if (actionName === 'update' || actionName === 'create') {
    const data = ctx.request.body as any;
    const notMatchKey = checkTypeByCollection(app.mainDataSource.collectionManager, collection, data);
    if (notMatchKey) {
      ctx.throw(400, `field ${notMatchKey} type error`);
    }
  }
  // TODO: 用户输入的key多余的部分忽略,这部分以后可以严格限制不能多出字段定义的部分
  return next();
}

function checkTypeByCollection(
  collectionManager: ICollectionManager,
  collection: ICollection,
  values: any,
  parentKey: string = null,
): string | null {
  // 通过遍历data判断是否符合字段定义
  for (const key in values) {
    const field = collection.getField(key);
    if (!field) {
      continue;
    }
    const fieldOptions = field.options;
    // 虚拟字段不判断
    if (fieldOptions.type === 'virtual') {
      continue;
    }
    const nextParentKey = parentKey ? `${parentKey}.${key}` : key;
    if (['hasOne', 'belongsTo'].includes(fieldOptions.type)) {
      const subCollection = collectionManager.getCollection(fieldOptions.target);
      if (!subCollection) {
        continue;
      }
      const subKey = checkTypeByCollection(collectionManager, subCollection, values[key], nextParentKey);
      if (subKey) {
        return subKey;
      }
    }
    if (['hasMany', 'belongsToMany'].includes(fieldOptions.type)) {
      for (const item of values[key]) {
        const subCollection = collectionManager.getCollection(fieldOptions.target);
        if (!subCollection) {
          continue;
        }
        const subKey = checkTypeByCollection(collectionManager, subCollection, item, nextParentKey);
        if (subKey) {
          return subKey;
        }
      }
    }
    if (!checkType(fieldOptions, values[key], true)) {
      return nextParentKey;
    }
  }
  return null;
}

// TODO: 更细致的判断,例如长度,是否符合正则等
// 判断类型是否符合
function checkType(fieldOptions: FieldOptions, value: any, inputChange = false): boolean {
  const type = fieldOptions.type;
  if (type === 'string') {
    return typeof value === 'string';
  } else if (type === 'bigInt') {
    if (typeof value === 'number') {
      return Number.isInteger(value);
    }
    return Number.isInteger(+value);
  } else if (type === 'double') {
    if (typeof value === 'number') {
      return true;
    }
    return !Number.isNaN(+value);
  } else if (type === 'boolean') {
    // TODO: 是否存在1,0这样的设计
    return typeof value === 'boolean';
  } else if (type === 'date') {
    return dayjs(value).isValid();
  } else if (type === 'sequence') {
    // 不可输入的情况下不允许修改, TODO: 需要验证前端是否自动有这样的行为
    // if (inputChange && !fieldOptions.inputable) {
    //   return false;
    // }
  } else if (type === 'array') {
    return Array.isArray(value);
  }
  // TODO: 单选多选判断
  return true;
}
