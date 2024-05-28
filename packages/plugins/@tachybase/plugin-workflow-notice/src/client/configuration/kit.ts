import { Plugin } from '@tachybase/client';
import PluginWorkflow from '@tachybase/plugin-workflow/client';
import { NoticeInstruction } from './Notice.instruction';
import { NOTICE_INSTRUCTION_NAMESPACE } from '../../common/constants';
import { SCNoticeDetail } from './show-interface/NoticeDetail.schema';
import { ArrayItems } from '@tachybase/components';

// NOTE: 试着用一种新的约束规则去声明文件属于哪种功能. 比如 kit.ts 导出的是单个 Plugin 下的功能集成
// 注册一个节点
export class KitConfiguration extends Plugin {
  async afterAdd() {
    await this.app.pm.add(SCNoticeDetail);
  }

  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerInstruction(NOTICE_INSTRUCTION_NAMESPACE, NoticeInstruction);
    this.app.addComponents({
      ArrayItems,
    });
    // this.app.schemaInitializerManager.add(ApproverActionConfigInitializer);
    // this.app.schemaInitializerManager.add(ApproverAddBlockInitializer);
  }
}
