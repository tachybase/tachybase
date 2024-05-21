import { Plugin } from '@tachybase/client';
import { ApprovalDataProvider } from './ApprovalData.provider';
import { ApprovalProcess } from './ApprovalProcess.view';

export class PluginKitApprovalCommon extends Plugin {
  async afterAdd() {}
  async beforeLoad() {}
  async load() {
    this.app.addComponents({
      // ApprovalCommon,
      'ApprovalCommon.Provider.ApprovalDataProvider': ApprovalDataProvider,
      'ApprovalCommon.ViewComponent.ApprovalProcess': ApprovalProcess,
    });
  }
}
