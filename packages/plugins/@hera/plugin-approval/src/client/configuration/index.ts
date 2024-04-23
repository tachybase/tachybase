import { Plugin } from '@nocobase/client';
import PluginKitApprovalInstruction from './instruction';
import PluginKitApprovalTrigger from './trigger';

export default class PluginKitApprovalConfiguration extends Plugin {
  async afterAdd() {
    this.pm.add(PluginKitApprovalTrigger);
    this.pm.add(PluginKitApprovalInstruction);
  }
  async beforeLoad() {}
  async load() {}
}
