import { Plugin } from '@tachybase/client';

import { tval } from '../locale';
import { NoticeBlockInitializer, SCApprovalBlock } from './NoticeBlock.initializer';

// NOTE: 试着用一种新的约束规则去声明文件属于哪种功能. 比如 kit.ts 导出的是单个 Plugin 下的功能集成
export class KitUsage extends Plugin {
  async afterAdd() {
    await this.app.pm.add(SCApprovalBlock);
  }

  async load() {
    this.app.addComponents({
      NoticeBlockInitializer: NoticeBlockInitializer,
    });

    this.app.schemaInitializerManager.get('page:addBlock').add('otherBlocks.notice', {
      key: 'noticeBlock',
      name: 'noticeBlock',
      type: 'item',
      title: tval('Notice Center'),
      Component: 'NoticeBlockInitializer',
      icon: 'NotificationOutlined',
    });
  }
}
