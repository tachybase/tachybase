import { Plugin } from '@tachybase/client';
import PluginWorkflow from '@tachybase/module-workflow/client';

import { PdfInstruction } from './PdfInstruction';

export class ModulePdfClient extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerInstruction('pdf', PdfInstruction);
  }
}

export default ModulePdfClient;
