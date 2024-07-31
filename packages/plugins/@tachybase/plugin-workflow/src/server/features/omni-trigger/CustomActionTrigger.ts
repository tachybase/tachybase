import { joinCollectionName, parseCollectionName } from '@tachybase/data-source-manager';
import PluginErrorHandler from '@tachybase/plugin-error-handler';

import _, { isArray } from 'lodash';

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
  triggerAction = async (context, next) => {
    const {
      resourceName,
      actionName,
      params: { filterByTk, values, triggerWorkflows = '', filter },
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
          return context.throw(500, 'Workflow on your action failed, please contact the administrator');
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
  }
  on() {}
  off() {}
}
