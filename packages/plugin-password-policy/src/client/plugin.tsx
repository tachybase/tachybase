import { Plugin } from '@tachybase/client';

import { tval } from './locale';
import { PasswordPolicyProvider } from './PasswordPolicyProvider';

export class PluginPasswordPolicy extends Plugin {
  async load() {
    // this.app.use(PasswordPolicyProvider);
    this.app.systemSettingsManager.add('security.password-policy', {
      icon: 'SettingOutlined',
      title: tval('Password policy'),
      Component: PasswordPolicyProvider,
      aclSnippet: `pm.security.password-policy`,
    });
  }
}

export default PluginPasswordPolicy;
