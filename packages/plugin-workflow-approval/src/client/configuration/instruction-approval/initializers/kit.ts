import { Plugin } from '@tachybase/client';

import { ApproverActionInitializer } from './ApproverAction.initializer';
import { ApproverShowDetailInitializer } from './ApproverShowDetail.initializer';
import { FormActionButtonInitializer } from './forms/FormActionButton.initializer';

export class KitInstructionApprovalInitializer extends Plugin {
  async load() {
    this.app.schemaInitializerManager.add(ApproverShowDetailInitializer);
    this.app.schemaInitializerManager.add(ApproverActionInitializer);
    this.app.schemaInitializerManager.add(FormActionButtonInitializer);
  }
}
