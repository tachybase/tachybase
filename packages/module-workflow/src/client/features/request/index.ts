import { Plugin } from '@tachybase/client';

import WorkflowPlugin from '../..';
import RequestInstruction from './RequestInstruction';

export class PluginRequest extends Plugin {
  async load() {
    const workflow = this.app.pm.get('workflow') as WorkflowPlugin;
    workflow.registerInstruction('request', RequestInstruction);
  }
}
