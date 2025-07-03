import { Plugin } from '@tachybase/client';

import { enableCopierSettingItem } from './enableCopierSettingItem';
import { renderTextCopyButton } from './TextCopyButton';
import { ViewTextCopyWrapper } from './ViewTextCopyWrapper';

class PluginTextCopyClient extends Plugin {
  async load() {
    this.app.addComponents({
      ViewTextCopyWrapper,
    });
    this.app.addScopes({
      renderTextCopyButton,
    });

    const settingList = ['fieldSettings:component:Input', 'fieldSettings:component:InputNumber'];
    this.app.schemaSettingsManager.addItem(settingList, enableCopierSettingItem.name, enableCopierSettingItem);
  }
}

export default PluginTextCopyClient;
