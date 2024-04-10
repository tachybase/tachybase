import path from 'path';
import { Plugin } from '@nocobase/server';
import WorkflowPlugin from '@nocobase/plugin-workflow';
import ApprovalTrigger from './ApprovalTrigger';
import ApprovalInstruction from './ApprovalInstruction';
import { init } from './actions';
export class PluginWorkflowApproval extends Plugin {
  workflow;
  afterAdd() {}
  beforeLoad() {
    this.app.on('afterLoadPlugin', (plugin) => {
      if (!(plugin instanceof WorkflowPlugin)) {
        return;
      }
      this.workflow = plugin;
      plugin.triggers.register('approval', new ApprovalTrigger(plugin));
      plugin.instructions.register('approval', new ApprovalInstruction(plugin));
    });
  }
  async load() {
    const { db } = this;
    db.addMigrations({
      namespace: 'approval',
      directory: path.resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });
    await db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
    init(this);
    this.app.acl.allow('workflows', ['listApprovalFlows'], 'loggedIn');
    this.app.acl.allow('approvals', '*', 'loggedIn');
    this.app.acl.allow('approvalExecutions', ['get'], 'loggedIn');
    this.app.acl.allow('approvalRecords', ['get', 'list', 'listCentralized', 'submit'], 'loggedIn');
  }
  async install(options) {}
  async afterEnable() {}
  async afterDisable() {}
  async remove() {}
}

export default PluginWorkflowApproval;
