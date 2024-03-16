import { Plugin } from '@nocobase/client';
import { SwiperBlock, SwiperBlockInitializer } from './schema-initializer/SwiperBlockInitializer';
import { TabSearchBlock, TabSearchBlockInitializer } from './schema-initializer/TabSearchBlockInitializer';
import { NoticeBlock, NoticeBlockInitializer } from './schema-initializer/NoticeBlockInitializer';

export class PluginMobileClient extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.addComponents({
      NoticeBlock,
      NoticeBlockInitializer,
      SwiperBlock,
      SwiperBlockInitializer,
      TabSearchBlock,
      TabSearchBlockInitializer,
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

    this.app.schemaInitializerManager.addItem('MBlockInitializers', 'filterBlocks', {
      title: '{{t("Filter blocks")}}',
      type: 'itemGroup',
      children: [
        {
          name: 'tabSearch',
          title: 'tabSearch',
          Component: 'TabSearchBlockInitializer',
        },
      ],
    });
  }
}

export default PluginMobileClient;
