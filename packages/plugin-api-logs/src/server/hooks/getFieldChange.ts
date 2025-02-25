import { IField } from '@tachybase/data-source';
import { ActionParams } from '@tachybase/resourcer';
import { Application } from '@tachybase/server';
import { lodash } from '@tachybase/utils';

function isSameBasic(val1: any, val2: any): boolean {
  if (val1 instanceof Date || val2 instanceof Date) {
    return new Date(val1).getTime() === new Date(val2).getTime();
  }
  return val1 === val2;
}
function getLostKey(smallOne: any, bigOne: any, path = ''): string[] {
  const lostKeys: Set<string> = new Set();
  if (typeof bigOne !== 'object' || bigOne === null) {
    if (smallOne === undefined) {
      return [path];
    }
    return [];
  }
  const bigKeys = Object.keys(bigOne);
  for (const key of bigKeys) {
    let keyLabel = path ? `${path}.${key}` : key;
    if (Array.isArray(bigOne)) {
      keyLabel = path; // 去掉数组中的点 (e.g., 'items.0' becomes 'items')
    }
    if (smallOne?.[key] === undefined) {
      lostKeys.add(keyLabel);
      continue;
    } else {
      const result = getLostKey(smallOne?.[key], bigOne?.[key], keyLabel);
      for (const item of result) {
        lostKeys.add(item);
      }
    }
  }
  return [...lostKeys];
}

// 只用得出before(数据库值)针对after(前端参数)中不同的key
// after(前端参数)多余的部分不算在内
function getDiffKeyExceptAfter(before: any, after: any, path = ''): string[] {
  if (after === null || after === undefined) {
    return [];
  }
  if (typeof before !== 'object' || typeof after !== 'object' || before === null || after === null) {
    // 一旦其中一个有值
    if (!isSameBasic(before, after)) {
      return [path];
    } else {
      return [];
    }
  }
  if (Array.isArray(before) && Array.isArray(after) && before.length !== after.length) {
    return [path];
  }

  const beforeDiffKeys: Set<string> = new Set();
  const beforeKeys = Object.keys(before);
  for (const key of beforeKeys) {
    if (after?.[key] === undefined) {
      continue;
    }
    let keyLabel = path ? `${path}.${key}` : key;
    if (Array.isArray(after)) {
      keyLabel = path; // 去掉数组中的点 (e.g., 'items.0' becomes 'items')
    }
    if (before?.[key] === undefined) {
      beforeDiffKeys.add(keyLabel);
      continue;
    } else {
      const result = getDiffKeyExceptAfter(before?.[key], after?.[key], keyLabel);
      for (const item of result) {
        beforeDiffKeys.add(item);
      }
    }
  }
  return [...beforeDiffKeys];
}

/** 获得真正变动的数据库字段 */
export async function getChanged(ctx, filterByTk): Promise<{ changed?: string[]; data?: any; error: Error }> {
  try {
    const params = lodash.cloneDeep(ctx.action.params) as ActionParams;
    if (!filterByTk) {
      filterByTk = params.filterByTk;
    }
    const repo = ctx.db.getRepository(ctx.action.resourceName);
    const fieldsObj: Record<string, IField> = {};
    const app = ctx.app as Application;
    const collection = app.mainDataSource.collectionManager.getCollection(ctx.action.resourceName);
    const fields = collection.getFields();
    for (const field of fields) {
      fieldsObj[field.options.name] = field;
    }

    let appendSet: Set<string> = new Set();
    if (params.updateAssociationValues) {
      appendSet = new Set(params.updateAssociationValues);
    }
    for (const key of appendSet) {
      if (!fieldsObj[key]) {
        continue;
      }
      const type = fieldsObj[key].options.type;
      if (type === 'virtual') {
        appendSet.delete(key);
        continue;
      }
    }
    let dataBefore = (
      await repo.findOne({
        filterByTk,
        appends: [...appendSet],
      })
    ).toJSON();

    const lostKeys = getLostKey(dataBefore, params.values);
    for (const lostKey of lostKeys) {
      if (
        lostKey.includes('.') ||
        (fieldsObj[lostKey] !== undefined &&
          ['belongsTo', 'belongsToMany', 'hasOne', 'hasMany'].includes(fieldsObj[lostKey].options.type))
      ) {
        appendSet.add(lostKey);
      }
    }

    dataBefore = (
      await repo.findOne({
        filterByTk,
        appends: [...appendSet],
      })
    ).toJSON();
    const changed = getDiffKeyExceptAfter(dataBefore, params.values);
    return {
      error: null,
      data: dataBefore,
      changed,
    };
  } catch (err) {
    ctx.log.error(err);
    return {
      error: err.stack,
    };
  }
}
