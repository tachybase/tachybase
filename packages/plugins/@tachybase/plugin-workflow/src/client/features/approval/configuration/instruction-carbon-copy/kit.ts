import { Plugin } from '@tachybase/client';

// import { ArrayItems } from '@tachybase/components';

import { PluginWorkflow } from '../../../../Plugin';
import { COLLECTION_NAME_APPROVAL_CARBON_COPY } from '../../../common/constants';
import { ApprovalCarbonCopyInstruction } from './ApprovalCarbonCopy.instruction';
import { SCCarbonCopyDetail } from './show-interface/CarbonCopyDetail.schema';

// NOTE: 试着用一种新的约束规则去声明文件属于哪种功能. 比如 kit.ts 导出的是单个 Plugin 下的功能集成
// 注册一个节点
export class KitCarbonCopy extends Plugin {
  async afterAdd() {
    await this.app.pm.add(SCCarbonCopyDetail);
  }

  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerInstruction(COLLECTION_NAME_APPROVAL_CARBON_COPY, ApprovalCarbonCopyInstruction);

    // this.app.addComponents({
    //   ArrayItems,
    // });
    // this.app.schemaInitializerManager.add(ApproverActionConfigInitializer);
    // this.app.schemaInitializerManager.add(ApproverAddBlockInitializer);
  }
}
