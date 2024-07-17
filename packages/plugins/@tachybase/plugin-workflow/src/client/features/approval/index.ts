import { Plugin } from '@tachybase/client';

import { KitCarbonCopy } from './configuration/instruction-carbon-copy/kit';
import KitApprovalConfiguration from './configuration/plugin';
import { KitApprovalUsage } from './usage/plugin';

export class PluginApproval extends Plugin {
  async afterAdd() {
    this.pm.add(KitApprovalConfiguration);
    this.pm.add(KitCarbonCopy);
    this.pm.add(KitApprovalUsage);
  }
  async beforeLoad() {}
  async load() {}
}

export default PluginApproval;
