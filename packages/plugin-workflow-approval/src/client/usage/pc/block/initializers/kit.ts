import { Plugin } from '@tachybase/client';

import { initializerApprovalBlock, initializerName } from './ApprovalBlock.initializer';
import { ProviderBlockInitItem } from './BlockInitItem.provider';
import { ViewBlockInitItem } from './BlockInitItem.view';

export class KitApprovalBlockInitializer extends Plugin {
  async load() {
    const pageBlockManager = this.app.schemaInitializerManager.get('page:addBlock');
    pageBlockManager.add(initializerName, initializerApprovalBlock);
    this.app.addComponents({
      /**
       * DOC:
       * 新的用法, 注册在全局, 而不是组件内的作用域的时候, 使用可以区分的前缀标明作用域
       * 同时组件名和原名称保持一致,为了能够快速搜索定位 schema 里的原组件
       * 例如:'Approval-ProviderBlockInitItem'
       * 冒号语法有些问题, 读取的方法里应该有特殊解析逻辑, 暂时用 - 连接
       */
      'Approval-ViewBlockInitItem': ViewBlockInitItem,
      'Approval-ProviderBlockInitItem': ProviderBlockInitItem,
      /**
       * @deprecated
       * 兼容旧版用法, 防止线上已经按照旧版配置的 schema, 运行的时候找不到原组件
       */
      'ApprovalBlock.BlockInitializer': ViewBlockInitItem,
      'ApprovalBlock.Decorator': ProviderBlockInitItem,
    });
  }
}
