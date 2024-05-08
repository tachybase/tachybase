import { Plugin } from '@tachybase/client';
import WorkflowPlugin from '../..';

import LoopInstruction from './LoopInstruction';

export class PluginLoop extends Plugin {
  async load() {
    const workflow = this.app.pm.get('workflow') as WorkflowPlugin;
    workflow.registerInstruction('loop', LoopInstruction);
  }
}
