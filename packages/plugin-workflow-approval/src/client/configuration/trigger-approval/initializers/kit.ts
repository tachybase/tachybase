import { Plugin } from '@tachybase/client';

import { ApplyFormInitializer } from './ApplyForm.initializer';
import { ApplyFormActionInitializer } from './ApplyFormAction.initializer';

export class KitApprovalTriggerInitializer extends Plugin {
  async load() {
    this.app.schemaInitializerManager.add(ApplyFormInitializer);
    this.app.schemaInitializerManager.add(ApplyFormActionInitializer);
  }
}
