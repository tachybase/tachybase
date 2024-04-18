import { Plugin } from '@nocobase/client';
import PluginApproval from './approval';

export class PluginApprovalMobileClient extends Plugin {
  async afterAdd() {
    this.pm.add(PluginApproval);
  }

  async beforeLoad() {}

  async load() {}
}

export default PluginApprovalMobileClient;
