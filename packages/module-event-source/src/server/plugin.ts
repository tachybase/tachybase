import Application, { Plugin, PluginOptions } from '@tachybase/server';

import { PluginWebhook } from './webhooks/Plugin';

export class ModuleEventSourceServer extends Plugin {
  constructor(app: Application, options?: PluginOptions) {
    super(app, options);
    this.addFeature(PluginWebhook);
  }
  async afterAdd() {}

  async beforeLoad() {}

  async load() {}

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default ModuleEventSourceServer;
