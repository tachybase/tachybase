import { Plugin } from '@tachybase/client';

import { ProviderCollectionMessages } from '../components/CollectionMessages.provider';
import { ViewTableMessages } from '../components/TableMessages.view';
import { ViewBlockInitItem } from './BlockInitItem.view';
import { initializerMessageBlock, initializerName } from './MessageBlock.initializer';

/** 站内信区块 */
export class KitMessageBlock extends Plugin {
  async load() {
    this.app.addComponents({
      'Messages-ViewBlockInitItem': ViewBlockInitItem,
      'Messages-ViewTableMessages': ViewTableMessages,
      'Messages-ProviderCollectionMessages': ProviderCollectionMessages,
    });

    const managerAddBlock = this.app.schemaInitializerManager.get('page:addBlock');
    const managerAddRecordBlock = this.app.schemaInitializerManager.get('popup:common:addBlock');

    // 页面区块
    managerAddBlock.add(initializerName, initializerMessageBlock);
    // 记录区块
    managerAddRecordBlock.add(initializerName, initializerMessageBlock);
  }
}
