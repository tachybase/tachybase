import { Plugin } from '@tachybase/client';

import { tval } from '../../../../locale';
import { RecordApprovalsDecorator } from '../RecordApprovals.decorator';
import { RecordApprovalsInitializer } from '../RecordApprovals.initializer';
import { RecordApprovals } from '../RecordApprovals.view';

export class KitApprovalRecordBlock extends Plugin {
  async load() {
    this.app.schemaInitializerManager.get('popup:common:addBlock').add('otherBlocks.approvalRecordBlock', {
      type: 'item',
      name: 'approvalRecordBlock',
      title: tval('Related approvals'),
      Component: 'ApprovalRecordBlock.BlockInitializer',
    });

    this.app.addComponents({
      'ApprovalRecordBlock.Decorator': RecordApprovalsDecorator,
      'ApprovalRecordBlock.BlockInitializer': RecordApprovalsInitializer,
      'ApprovalRecordBlock.ViewComponent': RecordApprovals,
    });
  }
}
