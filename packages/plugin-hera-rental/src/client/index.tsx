import { Plugin } from '@tachybase/client';

export class PluginRentalClient extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async afterLoad() {}

  // You can get and modify the app instance here
  async load() {}
}

export default PluginRentalClient;
