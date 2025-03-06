import { Context, Next } from '@tachybase/actions';
import { joinCollectionName, parseCollectionName } from '@tachybase/data-source';
import { Model, modelAssociationByKey } from '@tachybase/database';
import PluginErrorHandler from '@tachybase/module-error-handler';

import _, { get, isArray } from 'lodash';

import { EXECUTION_STATUS } from '../../constants';
import Trigger from '../../triggers';
import { toJSON } from '../../utils';

class CustomActionInterceptionError extends Error {
  status = 400;
  messages = [];
  constructor(message) {
    super(message);
    this.name = 'CustomActionInterceptionError';
  }
}
export class OmniTrigger extends Trigger {
  static TYPE = 'general-action';
  constructor(workflow) {
    super(workflow);
    this.workflow.app.resourcer.registerActionHandler('trigger', this.triggerAction);
    this.workflow.app.acl.allow('*', 'trigger', 'loggedIn');
    (this.workflow.app.pm.get(PluginErrorHandler) as PluginErrorHandler).errorHandler.register(
      (err) => err instanceof CustomActionInterceptionError,
      async (err, ctx) => {
        ctx.body = {
          errors: err.messages,
        };
        ctx.status = err.status;
      },
    );
    workflow.app.resourcer.use(this.middleware, { tag: 'workflowTrigger', after: 'dataSource' });
  }
  triggerAction = async (context, next) => {
    const {
      params: { filterByTk, values, triggerWorkflows = '', filter, resourceName, actionName },
    } = context.action;

    if (actionName !== 'trigger' || resourceName === 'workflows') {
      return next();
    }
    const { currentUser, currentRole } = context.state;
    const { model: UserModel } = this.workflow.db.getCollection('users');
    const userInfo = {
      user: UserModel.build(currentUser).desensitize(),
      roleName: currentRole,
    };
    const dataSourceHeader = context.get('x-data-source');
    const jointCollectionName = joinCollectionName(dataSourceHeader, resourceName);
    const triggerWorkflowsMap = new Map();
    const triggerWorkflowsArray = [];
    for (const trigger of triggerWorkflows.split(',')) {
      const [key, path] = trigger.split('!');
      triggerWorkflowsMap.set(key, path);
      triggerWorkflowsArray.push(key);
    }
    const workflows = Array.from(this.workflow.enabledCache.values())
      .filter(
        (item) =>
          item.type === OmniTrigger.TYPE &&
          item.config.collection === jointCollectionName &&
          triggerWorkflowsArray.includes(item.key),
      )
      .sort((a, b) => {
        const aIndex = triggerWorkflowsArray.indexOf(a.key);
        const bIndex = triggerWorkflowsArray.indexOf(b.key);
        if (aIndex === -1 && bIndex === -1) {
          return a.id - b.id;
        }
        if (aIndex === -1) {
          return 1;
        }
        if (bIndex === -1) {
          return -1;
        }
        return aIndex - bIndex;
      });
    const syncGroup = [];
    const asyncGroup = [];
    for (const workflow of workflows) {
      const { appends = [] } = workflow.config;
      const [dataSourceName, collectionName] = parseCollectionName(workflow.config.collection);
      const dataPath = triggerWorkflowsMap.get(workflow.key);
      const event = [workflow];
      const { repository } = context.app.dataSourceManager.dataSources
        .get(dataSourceName)
        .collectionManager.getCollection(collectionName);
      const formData = dataPath ? _.get(values, dataPath) : values;
      let data = formData;
      if (filterByTk != null) {
        if (isArray(filterByTk)) {
          data = await repository.find({ filterByTk, appends });
        } else {
          data = await repository.findOne({ filterByTk, appends });
        }
        if (!data) {
          continue;
        }
        Object.assign(data, formData);
      } else if (filter != null) {
        data = await repository.find({ filter, appends });
        if (!data) {
          continue;
        }
        Object.assign(data, formData);
      }
      // @ts-ignore
      event.push({ data: toJSON(data), ...userInfo });
      (workflow.sync ? syncGroup : asyncGroup).push(event);
    }
    for (const event of syncGroup) {
      const processor = await this.workflow.trigger(event[0], event[1], { httpContext: context });
      if (!processor) {
        return context.throw(500);
      }
      const { lastSavedJob, nodesMap } = processor;
      const lastNode = nodesMap.get(lastSavedJob?.nodeId);
      if (processor.execution.status === EXECUTION_STATUS.RESOLVED) {
        if (lastNode?.type === 'end') {
          return;
        }
        continue;
      }
      if (processor.execution.status < EXECUTION_STATUS.STARTED) {
        if (lastNode?.type !== 'end') {
          return context.throw(
            500,
            context.t('Workflow on your action failed, please contact the administrator', { ns: 'workflow' }),
          );
        }
        const err = new CustomActionInterceptionError('Request is intercepted by workflow');
        err.status = 400;
        err.messages = context.state.messages;
        return context.throw(err.status, err);
      }
      return context.throw(500, 'Workflow on your action hangs, please contact the administrator');
    }
    for (const event of asyncGroup) {
      this.workflow.trigger(event[0], event[1]);
    }
    await next();
  };

  middleware = async (context: Context, next: Next) => {
    const {
      resourceName,
      actionName,
      params: { triggerWorkflows, beforeWorkflows },
    } = context.action;

    if (beforeWorkflows) {
      this.trigger(context, beforeWorkflows);
    }

    if (resourceName === 'workflows' && actionName === 'trigger') {
      return this.triggerAction(context, next);
    }

    await next();

    if (!triggerWorkflows) {
      return;
    }

    if (!['create', 'update'].includes(actionName)) {
      return;
    }

    // TODO: 此处如果执行错误应该怎么办
    return this.trigger(context, triggerWorkflows);
  };

  private async trigger(context: Context, workflowList: string) {
    if (!workflowList) {
      return;
    }
    const { values } = context.action.params;
    const dataSourceHeader = context.get('x-data-source') || 'main';

    const { currentUser, currentRole } = context.state;
    const { model: UserModel } = this.workflow.db.getCollection('users');
    const userInfo = {
      user: UserModel.build(currentUser).desensitize(),
      roleName: currentRole,
    };

    const triggers = workflowList.split(',').map((trigger) => trigger.split('!'));
    const workflowRepo = this.workflow.db.getRepository('workflows');
    const workflows = (
      await workflowRepo.find({
        filter: {
          key: triggers.map((trigger) => trigger[0]),
          current: true,
          type: 'general-action',
          enabled: true,
        },
      })
    ).filter((workflow) => Boolean(workflow.config.collection));
    const syncGroup = [];
    const asyncGroup = [];
    for (const workflow of workflows) {
      const { collection, appends = [] } = workflow.config;
      const [dataSourceName, collectionName] = parseCollectionName(collection);
      const trigger = triggers.find((trigger) => trigger[0] === workflow.key);
      const event = [workflow];
      if (context.action.resourceName !== 'workflows') {
        if (!context.body) {
          continue;
        }
        if (dataSourceName !== dataSourceHeader) {
          continue;
        }
        const { body: data } = context;
        for (const row of Array.isArray(data) ? data : [data]) {
          let payload = row;
          if (trigger[1]) {
            const paths = trigger[1].split('.');
            for (const field of paths) {
              if (payload.get(field)) {
                payload = payload.get(field);
              } else {
                const association: any = modelAssociationByKey(payload, field);
                payload = await payload[association.accessors.get]();
              }
            }
          }
          const model = payload.constructor;
          if (payload instanceof Model) {
            if (collectionName !== model.collection.name) {
              continue;
            }
            if (appends.length) {
              payload = await model.collection.repository.findOne({
                filterByTk: payload.get(model.primaryKeyAttribute),
                appends,
              });
            }
          }
          // this.workflow.trigger(workflow, { data: toJSON(payload), ...userInfo });
          event.push({ data: toJSON(payload), ...userInfo });
        }
      } else {
        const { model, repository } = (<any>context.app).dataSourceManager.dataSources
          .get(dataSourceName)
          .collectionManager.getCollection(collectionName);
        let data = trigger[1] ? get(values, trigger[1]) : values;
        const pk = get(data, model.primaryKeyAttribute);
        if (appends.length && pk != null) {
          data = await repository.findOne({
            filterByTk: pk,
            appends,
          });
        }
        // this.workflow.trigger(workflow, {
        //   data,
        //   ...userInfo,
        // });
        event.push({ data, ...userInfo });
      }
      (workflow.sync ? syncGroup : asyncGroup).push(event);
    }

    for (const event of syncGroup) {
      await this.workflow.trigger(event[0], event[1], { httpContext: context });
    }

    for (const event of asyncGroup) {
      this.workflow.trigger(event[0], event[1]);
    }
  }

  on() {}
  off() {}
}
