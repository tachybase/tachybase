import React from 'react';
import { Plugin } from '@tachybase/client';

import { IPFilterForm } from './IPFilterForm';
import { tval } from './locale';
import { PasswordPolicyForm } from './PasswordPolicyForm';
import { UserLockTable } from './UserLocksTable';

export class ClientPlugin extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('security.password-policy', {
      icon: 'SettingOutlined',
      title: tval('Password policy'),
      Component: PasswordPolicyForm,
      aclSnippet: `pm.security.password-policy`,
    });

    this.app.systemSettingsManager.add('security.user-lock', {
      icon: 'UserOutlined',
      title: tval('User lock'),
      Component: UserLockTable,
      aclSnippet: `pm.security.user-lock`,
    });

    this.app.systemSettingsManager.add('security.ip-filter', {
      icon: 'GlobalOutlined',
      title: tval('IP filter'),
      Component: IPFilterForm,
      aclSnippet: `pm.security.ip-filter`,
    });
  }
}

export default ClientPlugin;
