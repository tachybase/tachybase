import { Plugin, tval } from '@nocobase/client';
import PluginBlock from './schma-block';
import PluginTabSearch from './schma-component/tab-search';
import PluginSwiper from './schma-component/swiper';
import PluginImageSearch from './schma-component/image-search';
import './assets/svg/index';
import PluginCommon from './common';

class PluginMobileClient extends Plugin {
  async afterAdd() {
    this.pm.add(PluginCommon);
    this.pm.add(PluginBlock);
    this.pm.add(PluginTabSearch);
    this.pm.add(PluginSwiper);
    this.pm.add(PluginImageSearch);
  }

  async beforeLoad() {}

  async load() {}
}

export default PluginMobileClient;
