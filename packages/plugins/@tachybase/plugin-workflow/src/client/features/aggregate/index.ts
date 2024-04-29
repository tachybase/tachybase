import { Plugin } from '@nocobase/client';
import WorkflowPlugin from '../..';

import AggregateInstruction from './AggregateInstruction';

export class PluginAggregate extends Plugin {
  async load() {
    const workflow = this.app.pm.get('workflow') as WorkflowPlugin;
    workflow.registerInstruction('aggregate', AggregateInstruction);
  }
}
