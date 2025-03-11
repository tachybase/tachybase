import { Plugin } from '@tachybase/client';

import { tval } from './locale';
import { PasswordPolicyForm } from './PasswordPolicyForm';
import { UserBlockTable } from './UserBlockTable';

export class PluginPasswordPolicy extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('security.password-policy', {
      icon: 'SettingOutlined',
      title: tval('Password policy'),
      Component: PasswordPolicyForm,
      aclSnippet: `pm.security.password-policy`,
    });
    this.app.systemSettingsManager.add('security.user-block', {
      icon: 'UserOutlined',
      title: tval('User block'),
      Component: UserBlockTable,
      aclSnippet: `pm.security.user-bloc`,
    });
  }
}

export default PluginPasswordPolicy;
