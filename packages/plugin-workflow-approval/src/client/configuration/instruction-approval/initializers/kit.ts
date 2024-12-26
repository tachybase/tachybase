import { Plugin } from '@tachybase/client';

import { ApproverActionConfigInitializer } from './ApproverActionConfig.initializer';
import { ApproverAddBlockInitializer } from './ApproverAddBlock.initializer';

export class KitInstructionApprovalInitializer extends Plugin {
  async load() {
    this.app.schemaInitializerManager.add(ApproverActionConfigInitializer);
    this.app.schemaInitializerManager.add(ApproverAddBlockInitializer);
  }
}
