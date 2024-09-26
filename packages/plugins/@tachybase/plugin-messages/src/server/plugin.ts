import { PluginWorkflow } from '@tachybase/plugin-workflow';
import { Plugin } from '@tachybase/server';

import { MessageInstruction } from './instructions/message-instruction';

export class PluginMessagesServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    const workflowPlugin = this.app.getPlugin<PluginWorkflow>(PluginWorkflow);
    workflowPlugin.registerInstruction('message-instruction', MessageInstruction);
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginMessagesServer;
