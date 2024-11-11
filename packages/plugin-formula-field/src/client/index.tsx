import { Plugin } from '@tachybase/client';

import { Formula } from './components';
import { FormulaFieldInterface } from './interfaces/formula';
import { renderExpressionDescription } from './scopes';

export class FormulaFieldPlugin extends Plugin {
  async load() {
    this.app.addComponents({
      Formula,
    });
    this.app.addScopes({
      renderExpressionDescription,
    });
    this.app.dataSourceManager.addFieldInterfaces([FormulaFieldInterface]);
  }
}

export default FormulaFieldPlugin;
