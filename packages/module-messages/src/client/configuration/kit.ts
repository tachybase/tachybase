import { Plugin } from '@tachybase/client';
import PluginWorkflow from '@tachybase/module-workflow/client';

import { WORKFLOW_INSTRUCTION_NAME_MESSAGE } from '../../common/constants';
import { KitInitializerBlockMessage } from './initializers/kit';
import { MessageInstruction } from './Message.instruction';

/** 配置工作流节点部分 */
export class KitConfiguration extends Plugin {
  async afterAdd() {
    await this.app.pm.add(KitInitializerBlockMessage);
  }
  async load() {
    const workflowPlugin = this.pm.get(PluginWorkflow);
    workflowPlugin.registerInstruction(WORKFLOW_INSTRUCTION_NAME_MESSAGE, MessageInstruction);
  }
}
