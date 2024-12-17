import { Plugin } from '@tachybase/client';

import { getInitializerBlockMessage } from './BlockMessage.initializer';

/** 注入信息详情展示初始化器 */
export class KitInitializerBlockMessage extends Plugin {
  async load() {
    const InitializerBlockMessage = getInitializerBlockMessage({
      app: this.app,
    });
    this.app.schemaInitializerManager.add(InitializerBlockMessage);
  }
}
