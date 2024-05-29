import { Plugin } from '@tachybase/client';

import { ShowFieldCodeInterface } from './show-code/Code.interface';
import { ViewCode } from './show-code/Code.view';
import { ShowFieldFormulaInterface } from './show-formula/Formula.interface';
import { ViewFormula } from './show-formula/Formula.view';

export class PluginFieldAppends extends Plugin {
  async load() {
    this.app.addComponents({
      Viewformula: ViewFormula,
      ViewCode: ViewCode,
    });
    this.app.dataSourceManager.addFieldInterfaces([ShowFieldFormulaInterface, ShowFieldCodeInterface]);
  }
}
