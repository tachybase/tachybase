import { PluginWorkflow } from '@tachybase/module-workflow';
import { InjectedPlugin, Plugin } from '@tachybase/server';

import { PdfInstruction } from './PdfInstruction';
import { FontManager } from './services/font-manager';

@InjectedPlugin({
  Services: [FontManager],
})
export class ModulePdfServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    const pluginWorkflow: any = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerInstruction('pdf', PdfInstruction);
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default ModulePdfServer;
