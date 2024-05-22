import { Plugin } from '@tachybase/client';
import { tval } from '../../locale';
import { PluginKitApprovalCommon } from '../approval-common/plugin';
import { ApprovalBlockComponent, SCApprovalBlock } from './ApprovalBlock.schema';
import { ViewActionLaunch } from './launch/VC.ViewActionLaunch';
import { ViewActionTodos } from './todos/VC.ViewActionTodos';

export class KitApprovalBlock extends Plugin {
  async afterAdd() {
    this.pm.add(PluginKitApprovalCommon);
    this.pm.add(SCApprovalBlock);
  }

  async beforeLoad() {}

  async load() {
    this.app.addComponents({
      'ApprovalBlock.BlockInitializer': ApprovalBlockComponent,
      'ApprovalBlock.ViewActionLaunch': ViewActionLaunch,
      'ApprovalBlock.ViewActionTodos': ViewActionTodos,
    });

    this.app.schemaInitializerManager.get('page:addBlock').add('otherBlocks.approval', {
      key: 'approvalBlock',
      name: 'approvalBlock',
      type: 'item',
      title: tval('Approval'),
      Component: 'ApprovalBlock.BlockInitializer',
      icon: 'AuditOutlined',
    });
  }
}
