import { Plugin } from '@tachybase/client';

import { PluginWorkflow } from '../../Plugin';
import { VariablesInstruction } from './VariablesInstruction';

export class PluginVariables extends Plugin {
  async load() {
    (this.app.pm.get('workflow') as PluginWorkflow).registerInstruction('variable', VariablesInstruction);
  }
}
