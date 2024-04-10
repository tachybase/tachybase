import { Plugin } from '@nocobase/client';
import PluginBlock from './schma-block';
import PluginTabSearch from './schma-component/tab-search';
import './assets/svg/index';

class PluginMobileClient extends Plugin {
  async beforeLoad() {}

  async load() {}

  async afterAdd() {
    this.pm.add(PluginBlock);
    this.pm.add(PluginTabSearch);
  }
}

export default PluginMobileClient;
