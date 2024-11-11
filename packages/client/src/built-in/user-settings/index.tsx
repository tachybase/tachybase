import React from 'react';

import { Plugin } from '../../application/Plugin';
import { USER_SETTINGS_PATH } from '../../application/UserSettingsManager';
import { UserSettingsLayout } from './UserSettingsLayout';

export class UserSettingsPlugin extends Plugin {
  async load() {
    this.app.router.add('admin.profilers', {
      path: USER_SETTINGS_PATH,
      element: <UserSettingsLayout />,
    });
  }
}
