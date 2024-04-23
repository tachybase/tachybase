import { Plugin } from '@nocobase/client';
import { ApprovalCommon } from './map';

export default class PluginKitApprovalCommon extends Plugin {
  async afterAdd() {}
  async beforeLoad() {}
  async load() {
    this.app.addComponents({
      ApprovalCommon,
    });
  }
}
