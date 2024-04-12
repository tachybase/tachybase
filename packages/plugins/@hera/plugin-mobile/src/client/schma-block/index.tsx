import { Plugin } from '@nocobase/client';
import { NoticeBlock, NoticeBlockInitializer } from './schema-initializer/NoticeBlockInitializer';
import { SwiperBlock, SwiperBlockInitializer } from './schema-initializer/SwiperBlockInitializer';

class PluginBlock extends Plugin {
  async load() {
    this.app.addComponents({
      NoticeBlock,
      NoticeBlockInitializer,
      SwiperBlock,
      SwiperBlockInitializer,
    });

    this.app.schemaInitializerManager.addItem('MBlockInitializers', 'dataBlocks.swiper', {
      title: 'swiper',
      name: 'swiper',
      type: 'item',
      Component: 'SwiperBlockInitializer',
    });
    this.app.schemaInitializerManager.addItem('MBlockInitializers', 'dataBlocks.notice', {
      title: 'notice',
      name: 'notice',
      type: 'item',
      Component: 'NoticeBlockInitializer',
    });
  }
}

export default PluginBlock;
