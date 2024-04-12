import { Plugin } from '@nocobase/client';
import { NoticeBlock, NoticeBlockInitializer } from './schema-initializer/NoticeBlockInitializer';

class PluginBlock extends Plugin {
  async load() {
    this.app.addComponents({
      NoticeBlock,
      NoticeBlockInitializer,
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
