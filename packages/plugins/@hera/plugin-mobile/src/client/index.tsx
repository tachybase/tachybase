import { Plugin } from '@nocobase/client';
import PluginCommon from './common/plugin';
import PluginBlock from './schma-block';
import PluginImageSearch from './schma-component/image-search/plugin';
import PluginSwiper from './schma-component/swiper';
import PluginTabSearch from './schma-component/tab-search';
import './assets/svg/index';

class PluginMobileClient extends Plugin {
  async afterAdd() {
    this.pm.add(PluginCommon);
    this.pm.add(PluginBlock);
    this.pm.add(PluginTabSearch);
    this.pm.add(PluginSwiper);
    this.pm.add(PluginImageSearch);
    // this.app.router.add()
  }

  async beforeLoad() {}

  async load() {}
}

export default PluginMobileClient;
