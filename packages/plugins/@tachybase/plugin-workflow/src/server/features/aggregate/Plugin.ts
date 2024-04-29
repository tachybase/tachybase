import WorkflowPlugin from '../..';
import { Plugin } from '@nocobase/server';

import AggregateInstruction from './AggregateInstruction';

export class PluginAggregate extends Plugin {
  async load() {
    const workflowPlugin = this.app.getPlugin<WorkflowPlugin>(WorkflowPlugin);
    workflowPlugin.registerInstruction('aggregate', AggregateInstruction);
  }
}
