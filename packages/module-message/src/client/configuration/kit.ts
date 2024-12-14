import { Plugin } from '@tachybase/client';
import PluginWorkflow from '@tachybase/module-workflow/client';

import { WORKFLOW_INSTRUCTION_NAME_MESSAGE } from '../../common/constants';
import { KitInitializerBlockMessage } from './initializers/kit';
import { MessageInstruction } from './Message.instruction';

/** 系统配置部分 */
export class KitConfiguration extends Plugin {
  async afterAdd() {
    // 信息详情展示初始化器
    await this.app.pm.add(KitInitializerBlockMessage);
  }
  async load() {
    // 工作流: 站内信节点
    const workflowPlugin = this.pm.get(PluginWorkflow);
    workflowPlugin.registerInstruction(WORKFLOW_INSTRUCTION_NAME_MESSAGE, MessageInstruction);
  }
}
