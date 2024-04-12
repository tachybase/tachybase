import { Plugin } from '@nocobase/client';
import { ApprovalInstruction } from './ApprovalInstruction';
import { ApprovalTrigger } from './ApprovalTrigger';
import { ApprovalProcessAddBlockButton } from './ApprovalProcessAddBlockButton';
import { ApprovalProcessAddActionButton } from './ApprovalProcessAddActionButton';
import { ApprovalApplyAddBlockButton } from './ApprovalApplyAddBlockButton';
import { ApprovalApplyAddActionButton } from './ApprovalApplyAddActionButton';

import PluginWorkflow from '@nocobase/plugin-workflow/client';
import { NAMESPACE } from '../locale';
import { ApprovalBlock } from './refined';

export default class ApprovalPlugin extends Plugin {
  async afterAdd() {}
  async beforeLoad() {}
  async load() {
    const plugin = this.app.pm.get(PluginWorkflow);
    plugin.registerTrigger('approval', ApprovalTrigger);
    plugin.registerInstruction('approval', ApprovalInstruction);
    this.app.addComponents({ ApprovalBlock });
    this.app.schemaInitializerManager.add(ApprovalApplyAddActionButton);
    this.app.schemaInitializerManager.add(ApprovalApplyAddBlockButton);
    this.app.schemaInitializerManager.add(ApprovalProcessAddActionButton);
    this.app.schemaInitializerManager.add(ApprovalProcessAddBlockButton);
    this.app.schemaInitializerManager.get('BlockInitializers').add('otherBlocks.approval', {
      key: 'approvalBlock',
      name: 'approvalBlock',
      type: 'item',
      title: `{{t("Approval", { ns: "${NAMESPACE}" })}}`,
      Component: 'ApprovalBlock.BlockInitializer',
      icon: 'AuditOutlined',
    });
    this.app.schemaInitializerManager.get('RecordBlockInitializers').add('otherBlocks.approvalsBlock', {
      type: 'item',
      name: 'approvalsBlock',
      title: `{{t("Related approvals", { ns: "${NAMESPACE}" })}}`,
      Component: 'ApprovalBlock.RecordApprovals.BlockInitializer',
    });
  }
}
