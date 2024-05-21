import { Plugin } from '@tachybase/client';
import { PluginKitApprovalRecordBlock } from './approval-record-block/plugin';
import { PluginKitApprovalBlock } from './approval-block';

export class PluginKitApprovalUsage extends Plugin {
  async afterAdd() {
    this.pm.add(PluginKitApprovalRecordBlock);
    this.pm.add(PluginKitApprovalBlock);
  }
  async beforeLoad() {}
  async load() {}
}
