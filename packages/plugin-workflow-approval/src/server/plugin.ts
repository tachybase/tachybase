import path from 'path';
import { PluginWorkflow } from '@tachybase/module-workflow';
import { Plugin } from '@tachybase/server';

import { COLLECTION_NAME_APPROVAL_CARBON_COPY } from '../common/collection-name';
import { init } from './actions';
import ApprovalInstruction from './instructions/Approval';
import ApprovalCarbonCopyInstruction from './instructions/ApprovalCarbonCopy';
import ApprovalTrigger from './triggers/Approval';

export class PluginWorkflowApproval extends Plugin {
  workflow;
  afterAdd() {}
  beforeLoad() {
    this.app.on('afterLoadPlugin', (plugin) => {
      if (!(plugin instanceof PluginWorkflow)) {
        return;
      }
      this.workflow = plugin;
      plugin.triggers.register('approval', new ApprovalTrigger(plugin));
      plugin.instructions.register('approval', new ApprovalInstruction(plugin));
      plugin.instructions.register(COLLECTION_NAME_APPROVAL_CARBON_COPY, new ApprovalCarbonCopyInstruction(plugin));
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
    // NOTE: 这种命名尽量改为引用同一个变量的形式,
    // 这里因为不妨碍快速获得变量名, 所以没有保持风格一致, 直接使用推荐的方式
    this.app.acl.allow(COLLECTION_NAME_APPROVAL_CARBON_COPY, ['get', 'list', 'listCentralized', 'submit'], 'loggedIn');
  }
  async install(options) {}
  async afterEnable() {}
  async afterDisable() {}
  async remove() {}
}

export default PluginWorkflowApproval;
