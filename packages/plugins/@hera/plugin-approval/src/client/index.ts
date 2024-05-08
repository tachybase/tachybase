import { Plugin } from '@tachybase/client';

import PluginKitApprovalConfiguration from './configuration';
import PluginKitApprovalUsage from './usage';

export default class PluginApproval extends Plugin {
  async afterAdd() {
    this.pm.add(PluginKitApprovalConfiguration);
    this.pm.add(PluginKitApprovalUsage);
  }
  async beforeLoad() {}
  async load() {}
}
