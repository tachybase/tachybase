import { Plugin } from '@tachybase/client';

import PluginApprovalH5 from './h5';
import PluginApprovalPC from './pc';

export class PluginApprovalClient extends Plugin {
  async afterAdd() {
    // 引入 PC 端代码
    await this.app.pm.add(PluginApprovalPC);
    // 引入 H5 端代码
    await this.app.pm.add(PluginApprovalH5);
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    console.log(this.app);
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
  }
}

export default PluginApprovalClient;
