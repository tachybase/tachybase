import { InstallOptions, Plugin } from '@tachybase/server';

import logger from './resourcer/logger';

export class PluginLogViewerServer extends Plugin {
  afterAdd() {}

  beforeLoad() {}

  async load() {
    this.app.resource(logger);
    this.app.acl.registerSnippet({
      name: 'pm.system-services.log-viewer',
      actions: ['logger:*'],
    });
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginLogViewerServer;
