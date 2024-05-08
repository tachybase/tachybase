import { Plugin } from '@tachybase/client';
import PluginKitApprovalCommon from '../approval-common';
import { tval } from '../../locale';
import { ViewActionTodos } from './todos/VC.ViewActionTodos';
import { ApprovalBlockComponent } from './VC.ApprovalBlock';
import { ApprovalBlockTodos } from './todos/VC.ApprovalBlockTodos';
import { ViewActionLaunch } from './launch/VC.ViewActionLaunch';
import { ApprovalBlockDecorator } from './Dt.ApprovalBlock';
import { ApprovalBlockLaunch } from './launch/VC.ApprovalBlockLaunch';

export default class PluginKitApprovalBlock extends Plugin {
  async afterAdd() {
    this.pm.add(PluginKitApprovalCommon);
  }

  async beforeLoad() {}

  async load() {
    this.app.addComponents({
      'ApprovalBlock.Decorator': ApprovalBlockDecorator,
      'ApprovalBlock.BlockInitializer': ApprovalBlockComponent,
      'ApprovalBlock.Launch': ApprovalBlockLaunch,
      'ApprovalBlock.Todos': ApprovalBlockTodos,
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
