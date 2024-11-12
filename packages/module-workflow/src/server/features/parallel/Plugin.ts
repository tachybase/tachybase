import { Plugin } from '@tachybase/server';

import WorkflowPlugin from '../..';
import ParallelInstruction from './ParallelInstruction';

export class PluginParallel extends Plugin {
  async load() {
    const workflowPlugin = this.app.getPlugin<WorkflowPlugin>(WorkflowPlugin);
    workflowPlugin.registerInstruction('parallel', ParallelInstruction);
  }
}
