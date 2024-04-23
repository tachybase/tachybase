import { Plugin } from '@nocobase/client';
import { tval } from '../../locale';
import PluginKitApprovalCommon from '../approval-common';
import { RecordApprovalsDecorator } from './Dt.RecordApprovals';
import { RecordApprovalsInitializer } from './Iz.RecordApprovals';
import { RecordApprovals } from './VC.RecordApprovals';

export default class PluginKitApprovalRecordBlock extends Plugin {
  async afterAdd() {
    this.pm.add(PluginKitApprovalCommon);
  }
  async beforeLoad() {}
  async load() {
    this.app.addComponents({
      'ApprovalRecordBlock.Decorator': RecordApprovalsDecorator,
      'ApprovalRecordBlock.BlockInitializer': RecordApprovalsInitializer,
      'ApprovalRecordBlock.ViewComponent': RecordApprovals,
    });

    this.app.schemaInitializerManager.get('popup:common:addBlock').add('otherBlocks.approvalRecordBlock', {
      type: 'item',
      name: 'approvalRecordBlock',
      title: tval('Related approvals'),
      Component: 'ApprovalRecordBlock.BlockInitializer',
    });
  }
}
