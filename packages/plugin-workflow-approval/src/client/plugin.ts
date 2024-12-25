import { Plugin } from '@tachybase/client';

import KitApprovalConfiguration from './configuration/plugin';
import { KitApprovalH5 } from './h5';
import { KitApprovalPC } from './pc';

class PluginWorkflowApprovalClient extends Plugin {
  async afterAdd() {
    // 审批工作流配置
    await this.app.pm.add(KitApprovalConfiguration);
    // 引入 PC 端代码
    await this.app.pm.add(KitApprovalPC);
    // 引入 H5 端代码
    await this.app.pm.add(KitApprovalH5);
  }
}

export default PluginWorkflowApprovalClient;
