import { Plugin } from '@tachybase/server';

import { getDataHandler, store, verify } from './actions/blockchain';
import { contractService } from './web3/contractService';

export class PluginBlockchainServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.resourcer.define({
      name: 'blockchain',
      actions: {
        store,
        getDataHandler,
        verify,
      },
    });

    this.app.acl.allow('blockchain', '*', 'public');
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginBlockchainServer;
