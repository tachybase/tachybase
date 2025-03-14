import React from 'react';
import { Plugin } from '@tachybase/client';

import { IPFilterForm } from './IPFilterForm';
import { tval } from './locale';
import { PasswordAttemptForm } from './PasswordAttemptForm';
import PasswordStrengthSettingsPage from './PasswordStrengthSettingsForm';
import { UserLockTable } from './UserLocksTable';

export class PasswordPolicyClient extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('security.password-attempt', {
      icon: 'SettingOutlined',
      title: tval('Password policy'),
      Component: PasswordAttemptForm,
      aclSnippet: `pm.security.password-attempt`,
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

    this.app.systemSettingsManager.add('security.password-strength', {
      icon: 'LockOutlined',
      title: tval('Password strength'),
      Component: PasswordStrengthSettingsPage,
    });
  }
}

export default PasswordPolicyClient;
