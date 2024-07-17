import { Plugin } from '@tachybase/server';

import { generate } from './actions/printTemplates';

export class PluginPrintTemplateServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    // localhost:3000/api/printTemplates:generate
    this.app.resourcer.define({
      name: 'printTemplates',
      actions: {
        generate,
      },
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginPrintTemplateServer;
