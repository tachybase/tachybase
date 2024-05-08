import { Plugin } from '@tachybase/server';
import WorkflowPlugin from '../..';

import SQLInstruction from './SQLInstruction';

export class PluginSql extends Plugin {
  async load() {
    const workflowPlugin = this.app.getPlugin<WorkflowPlugin>(WorkflowPlugin);
    workflowPlugin.registerInstruction('sql', SQLInstruction);
  }
}
