import Application, { InjectedPlugin, Plugin, PluginOptions } from '@tachybase/server';

import { CustomEventSourceController } from './actions/CustomEventSourceController';
import { PluginWebhook } from './webhooks/Plugin';

@InjectedPlugin({
  Controllers: [CustomEventSourceController],
})
export class ModuleEventSourceServer extends Plugin {
  constructor(app: Application, options?: PluginOptions) {
    super(app, options);
    this.addFeature(PluginWebhook);
  }
}

export default ModuleEventSourceServer;
