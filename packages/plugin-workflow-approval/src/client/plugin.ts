import { Plugin } from '@tachybase/client';

import { KitApprovalBase } from './base/kit';
import KitApprovalConfiguration from './system-settings/kit';
import { KitApprovalUsage } from './user-interface/kit';

class PluginWorkflowApprovalClient extends Plugin {
  async afterAdd() {
    // 引入审批工作流配置项
    await this.app.pm.add(KitApprovalConfiguration);
    // 引入审批系统设置项
    await this.app.pm.add(KitApprovalBase);
    // 引入审批用户界面
    await this.app.pm.add(KitApprovalUsage);
  }
}

export default PluginWorkflowApprovalClient;
