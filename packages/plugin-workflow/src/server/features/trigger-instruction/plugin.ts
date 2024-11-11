import { Plugin } from '@tachybase/server';

import { PluginWorkflow } from '../..';
import { flownodeCheck } from './flownode-check';
import { TriggerInstruction } from './TriggerInstruction';

export class PluginTriggerInstruction extends Plugin {
  async load() {
    // get workflow plugin instance
    const workflowPlugin = this.app.getPlugin<PluginWorkflow>(PluginWorkflow);

    // register instruction
    workflowPlugin.registerInstruction('trigger-instruction', TriggerInstruction);

    this.app.acl.use(flownodeCheck);
  }
}
