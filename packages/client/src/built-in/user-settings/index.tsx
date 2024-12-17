import React from 'react';

import { Plugin } from '../../application/Plugin';
import { USER_SETTINGS_PATH } from '../../application/UserSettingsManager';
import { AdminLayout } from '../admin-layout';
import { UserSettingsLayout } from './UserSettingsLayout';

export class UserSettingsPlugin extends Plugin {
  async load() {
    this.app.router.add('profilers', {
      path: USER_SETTINGS_PATH,
      element: (
        <AdminLayout>
          <UserSettingsLayout />
        </AdminLayout>
      ),
    });
  }
}
