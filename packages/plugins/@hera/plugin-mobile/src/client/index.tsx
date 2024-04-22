import { Plugin } from '@nocobase/client';
import PluginBlock from './schma-block';
import PluginTabSearch from './schma-component/tab-search';
import './assets/svg/index';
import PluginSwiper from './schma-component/swiper';

class PluginMobileClient extends Plugin {
  async afterAdd() {
    this.pm.add(PluginBlock);
    this.pm.add(PluginTabSearch);
    this.pm.add(PluginSwiper);
  }

  async beforeLoad() {}

  async load() {}
}

export default PluginMobileClient;
