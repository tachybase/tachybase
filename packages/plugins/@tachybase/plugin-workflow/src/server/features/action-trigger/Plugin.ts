import { Plugin } from '@tachybase/server';
import WorkflowPlugin from '../..';

import ActionTrigger from './ActionTrigger';

export class PluginActionTrigger extends Plugin {
  async load() {
    const workflowPlugin = this.app.pm.get(WorkflowPlugin) as WorkflowPlugin;
    workflowPlugin.registerTrigger('action', new ActionTrigger(workflowPlugin));
  }
}
