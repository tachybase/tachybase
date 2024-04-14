import { Plugin } from '@nocobase/client';
import { SwiperBlockInitializer } from './SwiperBlockInitializer';
import { SwiperBlock } from './SwiperBlock';
import { SwiperFieldSettings } from './SwiperFieldSettings';
import { useSwiperBlockProps } from './useSwiperBlockProps';
import { SwiperPage } from './SwiperPage';

class PluginSwiper extends Plugin {
  async load() {
    this.app.addScopes({
      useSwiperBlockProps,
    });
    this.app.addComponents({
      SwiperBlockInitializer,
      SwiperBlock,
      SwiperPage,
    });

    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', 'dataBlocks.swiper', {
      title: 'swiper',
      name: 'swiper',
      type: 'item',
      Component: 'SwiperBlockInitializer',
    });
    this.app.schemaSettingsManager.add(SwiperFieldSettings);
    this.app.router.add('mobile.swiper.page', {
      path: '/mobile/:name/image/:collection/:field/:fieldParams',
      Component: 'SwiperPage',
    });
  }
}

export default PluginSwiper;
