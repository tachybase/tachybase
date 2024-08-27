import { Plugin } from '@tachybase/client';

import { NAMESPACE } from '../constants';
import { AppManager } from './AppManager';
import { MultiAppManagerProvider } from './MultiAppManagerProvider';

export class MultiAppManagerPlugin extends Plugin {
  async load() {
    this.app.use(MultiAppManagerProvider);

    this.app.pluginSettingsManager.add(NAMESPACE, {
      title: `{{t("Multi-app manager", { ns: "${NAMESPACE}" })}}`,
      icon: 'AppstoreOutlined',
      Component: AppManager,
      aclSnippet: 'pm.multi-app-manager.applications',
    });
  }
}

export default MultiAppManagerPlugin;
export { formSchema, tableActionColumnSchema } from './settings/schemas/applications';
