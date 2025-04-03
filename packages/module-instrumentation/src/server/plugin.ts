import { InjectedPlugin, Plugin } from '@tachybase/server';

import { TrackingController } from './actions/tracking-controller';

@InjectedPlugin({
  Controllers: [TrackingController],
})
export class ModuleInstrumentationServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.acl.allow('instrumentation', '*', 'public');
    this.app.acl.registerSnippet({
      name: `pm.system-services.custom-instrumentation`,
      actions: ['trackingEvents:*'],
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default ModuleInstrumentationServer;
