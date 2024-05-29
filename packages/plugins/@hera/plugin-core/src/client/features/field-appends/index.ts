import { Plugin } from '@tachybase/client';

import { SCFormula, ShowFieldFormulaInterface } from './show-formula/Formula.interface';

export class PluginFieldAppends extends Plugin {
  async afterAdd() {
    this.app.pm.add(SCFormula);
  }
  async load() {
    this.app.dataSourceManager.addFieldInterfaces([ShowFieldFormulaInterface]);
  }
}
