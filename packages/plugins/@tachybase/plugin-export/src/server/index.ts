import { InstallOptions, Plugin } from '@tachybase/server';

import { exportXlsx } from './actions';

export class ExportPlugin extends Plugin {
  beforeLoad() {}

  async load() {
    this.app.resourcer.registerActionHandler('export', exportXlsx);
    this.app.acl.setAvailableAction('export', {
      displayName: '{{t("Export")}}',
      allowConfigureFields: true,
    });
  }

  async install(options: InstallOptions) {}
}

export default ExportPlugin;
