import { Plugin } from '@tachybase/client';

import { KitApprovalCommon } from '../common/plugin';
import { initializerApprovalBlock, initializerName } from './ApprovalBlock.initializer';
import { ProviderBlockInitItem } from './BlockInitItem.provider';
import { ViewBlockInitItem } from './BlockInitItem.view';
import { CarbonCopyBlockProvider } from './carbon-copy/CarbonCopyBlock.provider';
import { CarbonCopyCenter } from './carbon-copy/CarbonCopyCenter.schema';
import { FilterSummary } from './common/FilterSummary.component';
import { InitiateApplication } from './InitiateApplication.component';
import { ViewCheckLink } from './initiations/CheckLink.view';
import { ViewTableInitiated } from './initiations/TableInitiated';
import { ProviderApprovalUpdateForm } from './todos/ApprovalUpdateForm.provider';
import { ViewTableTodos } from './todos/TableTodos';
import { ViewActionTodos } from './todos/VC.ViewActionTodos';

export class KitApprovalBlock extends Plugin {
  async afterAdd() {
    this.pm.add(KitApprovalCommon);
  }

  async load() {
    this.app.addComponents({
      CarbonCopyBlockProvider: CarbonCopyBlockProvider,
      CarbonCopyCenter: CarbonCopyCenter,

      // NOTE: 这里注册在全局, 而不是组件内的作用域, 是为了让手机端共享到
      ProviderApprovalUpdateForm: ProviderApprovalUpdateForm,
      FilterSummary,

      'ApprovalBlock.ViewActionLaunch': ViewCheckLink,
      'ApprovalBlock.ViewActionTodos': ViewActionTodos,

      /**
       * DOC:
       * 新的用法, 注册在全局, 而不是组件内的作用域的时候, 使用可以区分的前缀标明作用域
       * 同时组件名和原名称保持一致,为了能够快速搜索定位 schema 里的原组件
       * 例如:'Approval-ProviderBlockInitItem'
       * 冒号语法有些问题, 读取的方法里应该有特殊解析逻辑, 暂时用 - 连接
       */
      'Approval-ViewBlockInitItem': ViewBlockInitItem,
      'Approval-ProviderBlockInitItem': ProviderBlockInitItem,
      'Approval-InitiateApplication': InitiateApplication,
      'Approval-ViewTableInitiated': ViewTableInitiated,
      'Approval-ViewTableTodos': ViewTableTodos,

      /**
       * @deprecated,
       * 兼容旧版用法, 防止线上已经按照旧版配置的 schema, 运行的时候找不到原组件
       */

      'ApprovalBlock.BlockInitializer': ViewBlockInitItem,
      'ApprovalBlock.Decorator': ProviderBlockInitItem,
      'ApprovalBlock.Launch': ViewTableInitiated,
      'ApprovalBlock.Launch.Application': InitiateApplication,
      'ApprovalBlock.Todos': ViewTableTodos,
    });

    const targetManager = this.app.schemaInitializerManager.get('page:addBlock');
    targetManager.add(initializerName, initializerApprovalBlock);
  }
}
