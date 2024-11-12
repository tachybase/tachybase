import { Plugin, useSchemaInitializer } from '@tachybase/client';

import { tval } from '../../locale';
import { KitApprovalCommon } from '../approval-common/plugin';
import { ApprovalBlockComponent, getSchemaInsert, SCApprovalBlock, schemaItems } from './ApprovalBlock.schema';
import { ViewCheckLink } from './launch/CheckLink.view';
import { ProviderApprovalUpdateForm } from './todos/ApprovalUpdateForm.provider';
import { ViewActionTodos } from './todos/VC.ViewActionTodos';

export class KitApprovalBlock extends Plugin {
  async afterAdd() {
    this.pm.add(KitApprovalCommon);
    this.pm.add(SCApprovalBlock);
  }

  async load() {
    this.app.addComponents({
      'ApprovalBlock.BlockInitializer': ApprovalBlockComponent,
      'ApprovalBlock.ViewActionLaunch': ViewCheckLink,
      'ApprovalBlock.ViewActionTodos': ViewActionTodos,
      // NOTE: 这里注册在全局, 而不是组件内的作用域, 是为了让手机端共享到
      ProviderApprovalUpdateForm: ProviderApprovalUpdateForm,
    });

    this.app.schemaInitializerManager.get('page:addBlock').add('otherBlocks.workflow.approval', {
      key: 'approvalBlock',
      name: 'approvalBlock',
      type: 'itemGroup',
      title: tval('Approval'),
      children: schemaItems,
      icon: 'AuditOutlined',
    });
  }
}
