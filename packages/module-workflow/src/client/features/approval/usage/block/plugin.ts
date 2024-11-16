import { Plugin } from '@tachybase/client';

import { KitApprovalCommon } from '../common/plugin';
import { initializerApprovalBlock, initializerName } from './ApprovalBlock.initializer';
import { ProviderApprovalBlockItem } from './ApprovalBlockItem.provider';
import { ApprovalBlockComponent } from './ApprovalBlockItem.view';
import { CarbonCopyBlockProvider } from './carbon-copy/CarbonCopyBlock.provider';
import { CarbonCopyCenter } from './carbon-copy/CarbonCopyCenter.schema';
import { FilterSummary } from './common/FilterSummary.component';
import { ViewCheckLink } from './initiations/CheckLink.view';
import { TableInitiated } from './initiations/TableInitiated';
import { ApprovalBlockLaunchApplication } from './initiations/VC.ApprovalBlockLaunchApplication';
import { ViewApprovalBlockTodos } from './todos/ApprovalBlockTodos';
import { ProviderApprovalUpdateForm } from './todos/ApprovalUpdateForm.provider';
import { ViewActionTodos } from './todos/VC.ViewActionTodos';

export class KitApprovalBlock extends Plugin {
  async afterAdd() {
    this.pm.add(KitApprovalCommon);
  }

  async load() {
    this.app.addComponents({
      /**
       * @deprecated, use 'ProviderApprovalBlockItem' instead
       */
      'ApprovalBlock.Decorator': ProviderApprovalBlockItem,
      ProviderApprovalBlockItem,
      'ApprovalBlock.Launch': TableInitiated,
      'ApprovalBlock.Launch.Application': ApprovalBlockLaunchApplication,
      'ApprovalBlock.Todos': ViewApprovalBlockTodos,
      CarbonCopyBlockProvider: CarbonCopyBlockProvider,
      CarbonCopyCenter: CarbonCopyCenter,
      'ApprovalBlock.BlockInitializer': ApprovalBlockComponent,
      'ApprovalBlock.ViewActionLaunch': ViewCheckLink,
      'ApprovalBlock.ViewActionTodos': ViewActionTodos,
      // NOTE: 这里注册在全局, 而不是组件内的作用域, 是为了让手机端共享到
      ProviderApprovalUpdateForm: ProviderApprovalUpdateForm,
      FilterSummary,
    });

    const targetManager = this.app.schemaInitializerManager.get('page:addBlock');
    targetManager.add(initializerName, initializerApprovalBlock);
  }
}
