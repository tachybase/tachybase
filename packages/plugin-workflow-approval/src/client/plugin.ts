import { Plugin } from '@tachybase/client';

import KitApprovalConfiguration from './configuration/plugin';
import { KitApprovalUsage } from './usage/kit';

class PluginWorkflowApprovalClient extends Plugin {
  async afterAdd() {
    // 引入审批工作流配置
    await this.app.pm.add(KitApprovalConfiguration);
    // 引入审批用户界面
    await this.app.pm.add(KitApprovalUsage);
  }
}

export default PluginWorkflowApprovalClient;
