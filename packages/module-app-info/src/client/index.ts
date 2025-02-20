import { Plugin } from '@tachybase/client';

import { EntryManager } from './EntryManager';

class ModuleAppInfo extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('entry-manager', {
      icon: 'SettingOutlined',
      title: '{{t("Entry Manager")}}',
      Component: EntryManager,
      aclSnippet: 'pm.app-info.entry-manager',
      sort: -99,
    });
  }
}

export default ModuleAppInfo;
