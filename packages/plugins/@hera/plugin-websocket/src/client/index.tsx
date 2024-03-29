import { Plugin } from '@nocobase/client';
import { WebsocketBlockHelper } from './schema-initializer/WebsocketBlockInitializer';

export class PluginWebsocketClient extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    await new WebsocketBlockHelper(this.app).load();
  }
}

export default PluginWebsocketClient;
