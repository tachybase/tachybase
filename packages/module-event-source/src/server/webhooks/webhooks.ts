import { Context } from '@tachybase/actions';
import { IField } from '@tachybase/data-source';
import { PluginWorkflow, Processor } from '@tachybase/module-workflow';
import { ActionParams } from '@tachybase/resourcer';
import Application from '@tachybase/server';
import { dayjs } from '@tachybase/utils';

import lodash from 'lodash';

import { EVENT_SOURCE_COLLECTION } from '../constants';
import { evalSimulate } from '../utils/eval-simulate';

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
export function getChanged(ctx: Context): () => Promise<{ changed?: string[]; data?: any; error: Error }> {
  return async function () {
    try {
      const params = lodash.cloneDeep(ctx.action.params) as ActionParams;
      // const changedKeys = new Set(Object.keys(params.values));
      const fieldsObj: Record<string, IField> = {};
      const app = ctx.app as Application;
      const c = app.mainDataSource.collectionManager.getCollection(ctx.action.resourceName);
      const collectionRepo = ctx.db.getRepository(c.name);
      const fields = c.getFields();
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
        await collectionRepo.findOne({
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
        await collectionRepo.findOne({
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
  };
}

export class WebhookController {
  async getLink(ctx: Context) {
    const {
      params: { name },
    } = ctx.action;
    const where = {};
    if (name) {
      where['filter'] = {
        name: name,
        type: 'code',
        enabled: true,
      };
    }

    if (!name) {
      throw new Error('not support');
    }

    const { currentUser, currentRole } = ctx.state;
    const { model: UserModel } = ctx.db.getCollection('users');
    const userInfo = {
      user: UserModel.build(currentUser).desensitize(),
      roleName: currentRole,
    };

    const pluginWorkflow = ctx.app.getPlugin(PluginWorkflow) as PluginWorkflow;
    const repo = ctx.db.getRepository(EVENT_SOURCE_COLLECTION);
    const webhook = await repo.findOne(where);
    const webhookCtx = {
      request: ctx.request,
      action: ctx.action,
      body: '',
    };
    await evalSimulate(webhook.code, {
      ctx: webhookCtx,
      lib: {
        JSON,
        Math,
        dayjs,
      },
    });
    if (webhook?.workflowKey) {
      const wfRepo = ctx.db.getRepository('workflows');
      const wf = await wfRepo.findOne({ filter: { key: webhook.workflowKey, enabled: true } });
      const processor = await pluginWorkflow.trigger(wf, { data: webhookCtx.body, ...userInfo }, { httpContext: ctx });
      if (!processor) {
        return ctx.throw('Workflow should be sync.', 500);
      }
      const { lastSavedJob } = processor;
      if (typeof ctx.body === 'undefined') {
        ctx.withoutDataWrapping = true;
        ctx.body = lastSavedJob.result;
      }
      return;
    }
    if (webhookCtx.body) {
      ctx.withoutDataWrapping = true;
      ctx.body = webhookCtx.body;
      return;
    }
  }
  async test(ctx: Context) {
    const { name, params, body } = ctx.action.params.values;
    ctx.request.query = params;
    ctx.action.params = params || {};
    ctx.action.params.name = name;
    ctx.action.params.values = body;
    await new WebhookController().getLink(ctx);
  }

  async action(ctx: Context, action: { code: string }) {
    const webhookCtx = {
      request: ctx.request,
      action: ctx.action,
      body: '',
      getChanged: getChanged(ctx),
    };
    try {
      // TODO: 这里不应该简单 try catch，如果用户想要 throw 的时候应该让它能 throw 出去，给到客户端
      await evalSimulate(action.code, {
        ctx: webhookCtx,
        lib: {
          JSON,
          Math,
          dayjs,
        },
      });
      return webhookCtx.body;
    } catch (err) {
      ctx.app.log.error(err);
      return null;
    }
  }

  async triggerWorkflow(ctx, action, body): Promise<Processor | void> {
    const { currentUser, currentRole } = ctx.state;
    const { model: UserModel } = ctx.db.getCollection('users');
    // 只有绑定工作流才执行
    if (!action.workflowKey) {
      return;
    }
    const userInfo = {
      user: UserModel.build(currentUser).desensitize(),
      roleName: currentRole,
    };
    const pluginWorkflow = ctx.app.getPlugin(PluginWorkflow) as PluginWorkflow;
    const wfRepo = ctx.db.getRepository('workflows');
    const wf = await wfRepo.findOne({ filter: { key: action.workflowKey, enabled: true } });
    return await pluginWorkflow.trigger(wf, { data: body, ...userInfo }, { httpContext: ctx });
  }
}
