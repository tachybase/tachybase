import { Plugin } from '@tachybase/client';

import { PluginWorkflow } from '../../Plugin';
import { TriggerInstruction } from './TriggerInstruction';

export class PluginTriggerInstruction extends Plugin {
  async load() {
    this.app.pm.get<PluginWorkflow>('workflow').registerInstruction('trigger-instruction', TriggerInstruction);
  }
}
