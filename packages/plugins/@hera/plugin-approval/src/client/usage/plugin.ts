import { Plugin } from '@tachybase/client';
import { PluginKitApprovalRecordBlock } from './approval-record-block/plugin';
import { KitApprovalBlock } from './approval-block/plugin';

export class KitApprovalUsage extends Plugin {
  async afterAdd() {
    this.pm.add(PluginKitApprovalRecordBlock);
    this.pm.add(KitApprovalBlock);
  }
  async beforeLoad() {}
  async load() {}
}
