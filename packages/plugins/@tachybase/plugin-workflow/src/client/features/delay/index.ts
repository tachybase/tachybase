import { Plugin } from '@nocobase/client';
import WorkflowPlugin from '../..';

import DelayInstruction from './DelayInstruction';

export class PluginDelay extends Plugin {
  async load() {
    const workflow = this.app.pm.get('workflow') as WorkflowPlugin;
    workflow.registerInstruction('delay', DelayInstruction);
  }
}
