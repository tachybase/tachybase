import { Plugin } from '@tachybase/server';

export class PluginWorkflowAnalysisServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.acl.registerSnippet({
      name: 'pm.business-components.executionanalysis',
      actions: ['executions:list'],
    });
    this.app.acl.registerSnippet({
      name: 'pm.business-components.jobanalysis',
      actions: ['jobs:list'],
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginWorkflowAnalysisServer;
