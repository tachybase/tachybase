import { Plugin } from '@tachybase/client';

import { ApplyFormInitializer, LauncherAddBlockButtonIntializer } from './ApplyForm.initializer';
import { ApplyFormActionInitializer, LauncherActionConfigInitializer } from './ApplyFormAction.initializer';

export class KitApprovalTriggerInitializer extends Plugin {
  async load() {
    this.app.schemaInitializerManager.add(ApplyFormInitializer);
    this.app.schemaInitializerManager.add(ApplyFormActionInitializer);

    this.app.schemaInitializerManager.add(LauncherAddBlockButtonIntializer);
    this.app.schemaInitializerManager.add(LauncherActionConfigInitializer);
  }
}
