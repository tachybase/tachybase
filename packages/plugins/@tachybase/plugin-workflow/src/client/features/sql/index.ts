import { Plugin } from '@tachybase/client';
import WorkflowPlugin from '../..';

import SQLInstruction from './SQLInstruction';

export class PluginSql extends Plugin {
  async load() {
    const workflow = this.app.pm.get('workflow') as WorkflowPlugin;
    workflow.registerInstruction('sql', SQLInstruction);
  }
}
