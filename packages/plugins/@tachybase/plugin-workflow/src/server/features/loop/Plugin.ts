import { Plugin } from '@tachybase/server';
import { default as WorkflowPlugin } from '../..';

import LoopInstruction from './LoopInstruction';

export class PluginLoop extends Plugin {
  async load() {
    const workflowPlugin = this.app.getPlugin<WorkflowPlugin>(WorkflowPlugin);
    workflowPlugin.registerInstruction('loop', LoopInstruction);
  }
}
