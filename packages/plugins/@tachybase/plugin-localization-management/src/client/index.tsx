import { Plugin } from '@tachybase/client';

import { NAMESPACE } from './locale';
import { Localization } from './Localization';

export class LocalizationManagementPlugin extends Plugin {
  async load() {
    this.app.pluginSettingsManager.add(NAMESPACE, {
      title: `{{t("Localization", { ns: "${NAMESPACE}" })}}`,
      icon: 'GlobalOutlined',
      Component: Localization,
      aclSnippet: 'pm.localization-management.localization',
    });
  }
}

export default LocalizationManagementPlugin;
