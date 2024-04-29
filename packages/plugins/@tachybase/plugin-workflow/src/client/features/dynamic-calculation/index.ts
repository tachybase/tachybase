import { Plugin } from '@nocobase/client';
import WorkflowPlugin from '../..';

import DynamicCalculation from './DynamicCalculation';
import { DynamicExpression } from './DynamicExpression';
import { ExpressionFieldInterface } from './expression';

export class PluginDaynamicCalculation extends Plugin {
  async load() {
    this.app.dataSourceManager.addFieldInterfaces([ExpressionFieldInterface]);
    this.app.addComponents({
      DynamicExpression,
    });
    const workflow = this.app.pm.get('workflow') as WorkflowPlugin;
    const dynamicCalculation = new DynamicCalculation();
    workflow.instructions.register(dynamicCalculation.type, dynamicCalculation);
  }
}
