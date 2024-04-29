import { Plugin } from '@nocobase/client';
import WorkflowPlugin from '../..';

import ParallelInstruction from './ParallelInstruction';

export class PluginParallel extends Plugin {
  async load() {
    const workflow = this.app.pm.get(WorkflowPlugin);
    workflow.registerInstruction('parallel', ParallelInstruction);
  }
}
