import { Plugin } from '@tachybase/server';
import WorkflowPlugin from '../..';

import { ExpressionField } from './expression-field';
import { DynamicCalculation } from './DynamicCalculation';

export class PluginDynamicCalculation extends Plugin {
  async load() {
    this.db.registerFieldTypes({
      expression: ExpressionField,
    });

    const workflowPlugin = this.app.getPlugin<WorkflowPlugin>(WorkflowPlugin);
    workflowPlugin.registerInstruction('dynamic-calculation', DynamicCalculation);
  }
}
