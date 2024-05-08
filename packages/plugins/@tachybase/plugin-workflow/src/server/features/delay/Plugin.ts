import { Plugin } from '@tachybase/server';
import WorkflowPlugin from '../..';

import DelayInstruction from './DelayInstruction';

export class PluginDelay extends Plugin {
  async load() {
    const workflowPlugin = this.app.getPlugin<WorkflowPlugin>(WorkflowPlugin);
    workflowPlugin.registerInstruction('delay', DelayInstruction);
  }
}
