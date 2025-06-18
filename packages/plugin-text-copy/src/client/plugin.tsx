import { Plugin } from '@tachybase/client';

import { enableCopierSettingItem } from './enableCopierSettingItem';
import { TextCopyButtonNode } from './TextCopyButton';

class PluginTextCopyClient extends Plugin {
  async load() {
    this.app.addScopes({
      TextCopyButtonNode,
    });

    const settingList = ['fieldSettings:component:Input', 'fieldSettings:component:InputNumber'];
    this.app.schemaSettingsManager.addItem(settingList, enableCopierSettingItem.name, enableCopierSettingItem);
  }
}

export default PluginTextCopyClient;
