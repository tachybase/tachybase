import { IField } from '@tachybase/data-source';
import { ActionParams } from '@tachybase/resourcer';
import { Application, Plugin } from '@tachybase/server';
import { lodash } from '@tachybase/utils';

// import { LOG_TYPE_UPDATE } from '../constants';

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
async function getChanged(ctx): Promise<{ changed?: string[]; data?: any; error: Error }> {
  try {
    const params = lodash.cloneDeep(ctx.action.params) as ActionParams;
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
        filter: {
          id: params.filterByTk,
        },
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
        filter: {
          id: params.filterByTk,
        },
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

export async function handleUpdate(ctx) {
  const { actionName, resourceName, params } = ctx.action;
  const currentTime = new Date().toISOString();
  const apilogsRepo = ctx.db.getRepository('apiLogs');
  const currentUserId = ctx.auth?.user.id;
  const app = ctx.app as Application;
  const collection = app.mainDataSource.collectionManager.getCollection(ctx.action.resourceName);
  const changes = [];
  const { changed, data: dataBefore } = await getChanged(ctx);
  changed.forEach((key: string) => {
    const field = collection.findField((field) => {
      return field.name === key || field.options.field === key;
    });
    if (field && !field.options.hidden) {
      let before = dataBefore[key];
      let after = params.values[key];
      if (before === after) {
        return;
      }
      if ((before === null || before === undefined) && (after === null || after === undefined)) {
        return;
      }
      if (field.type === 'bigInt' && field.options?.isForeignKey && +before === +after) {
        return;
      }
      changes.push({
        field: field.options,
        after: params.values[key],
        before: dataBefore[key],
      });
    }
  });
  if (!changes.length) {
    return;
  }
  // const values = {
  //     action: actionName,
  //     collectionName: resourceName,
  //     recordId: params.filterByTk,
  //     userId: currentUserId,
  //     changes,
  // };
  try {
    await apilogsRepo.create({
      values: {
        action: actionName,
        createdAt: currentTime,
        collectionName: resourceName,
        recordId: params.filterByTk,
        userId: currentUserId,
        changes,
      },
    });
  } catch (error) {
    throw new Error('Failed to create API log');
  }
}
