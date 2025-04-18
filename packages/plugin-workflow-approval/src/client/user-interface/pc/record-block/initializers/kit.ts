import { Plugin } from '@tachybase/client';

import { ProviderApprovalRecordBlock } from './ApprovalRecordBlock.provider';
import { ViewApprovalRecordBlock } from './ApprovalRecordBlock.view';
import { initailizerApprovalRecordBlock, initializerName } from './RecordBlock.initializer';
import { ViewRecordBlockInitItem } from './RecordBlockInitItem.view';

export class KitApprovalRecordBlockInitializer extends Plugin {
  async load() {
    const recordBlockManager = this.app.schemaInitializerManager.get('popup:common:addBlock');
    recordBlockManager.add(initializerName, initailizerApprovalRecordBlock);

    this.app.addComponents({
      'Approval-ViewRecordBlockInitItem': ViewRecordBlockInitItem,
      'Approval-ProviderApprovalRecordBlock': ProviderApprovalRecordBlock,
      'Approval-ViewApprovalRecordBlock': ViewApprovalRecordBlock,
    });
  }
}
