import { Plugin } from '@tachybase/server';

import WorkflowPlugin from '../..';
import RequestInstruction from './RequestInstruction';

export class PluginRequest extends Plugin {
  async load() {
    const workflowPlugin = this.app.getPlugin<WorkflowPlugin>(WorkflowPlugin);
    workflowPlugin.registerInstruction('request', RequestInstruction);
  }
}
