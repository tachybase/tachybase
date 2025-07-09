import { Plugin } from '@tachybase/client';

import { AuthMainAppManager } from './authMainAppManager/AuthMainAppManager';
import { tval } from './locale';

class PluginAuthMainAppClient extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.systemSettingsManager.add('system-services.auth-main-app', {
      icon: 'LoginOutlined',
      title: tval('Single Sign-On (SSO) between applications'),
      Component: AuthMainAppManager,
      aclSnippet: `pm.system-services.auth-main-app`,
    });
  }
}

export default PluginAuthMainAppClient;
