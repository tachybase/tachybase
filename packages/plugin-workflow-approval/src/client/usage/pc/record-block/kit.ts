import { Plugin } from '@tachybase/client';

import { KitApprovalCommon } from '../common/kit';
import { KitApprovalRecordBlockInitializer } from './initializers/kit';

export class KitApprovalRecordBlock extends Plugin {
  async afterAdd() {
    // 加载审批通用组件
    await this.pm.add(KitApprovalCommon);
    // 加载审批记录区块初始化器
    await this.pm.add(KitApprovalRecordBlockInitializer);
  }
}
