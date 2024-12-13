import { Plugin } from '@tachybase/client';

import { ViewBlockInitItem } from './BlockInitItem.view';
import { initializerMessageBlock, initializerName } from './MessageBlock.initializer';

/** 站内信区块 */
export class KitMessageBlock extends Plugin {
  async load() {
    this.app.addComponents({
      'Messages-ViewBlockInitItem': ViewBlockInitItem,
    });

    // 页面区块
    const managerAddBlock = this.app.schemaInitializerManager.get('page:addBlock');
    managerAddBlock.add(initializerName, initializerMessageBlock);

    // 记录区块
    const managerAddRecordBlock = this.app.schemaInitializerManager.get('popup:common:addBlock');
    managerAddRecordBlock.add(initializerName, initializerMessageBlock);
  }
}
