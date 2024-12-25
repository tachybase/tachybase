import { Plugin } from '@tachybase/client';

import KitApprovalConfiguration from './configuration/plugin';
import PluginApprovalH5 from './h5';
import PluginApprovalPC from './pc';

class PluginWorkflowApprovalClient extends Plugin {
  async afterAdd() {
    // 审批工作流配置
    await this.pm.add(KitApprovalConfiguration);

    // 引入 PC 端代码
    await this.app.pm.add(PluginApprovalPC);
    // 引入 H5 端代码
    await this.app.pm.add(PluginApprovalH5);
  }
}

export default PluginWorkflowApprovalClient;
