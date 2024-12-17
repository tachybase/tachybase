import { Plugin, tval } from '@tachybase/client';
import ACLPlugin from '@tachybase/module-acl/client';

import { RoleUsersManager } from './RoleUsersManager';
import { ChangePassword } from './UserChangePassword';
import { UserProfile } from './UserProfile';
import { UsersManagement } from './UsersManagement';

class PluginUsersClient extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('id-auth.users', {
      title: tval('Users'),
      icon: 'UserOutlined',
      Component: UsersManagement,
      aclSnippet: 'pm.users',
    });

    this.userSettingsManager.add('user-change-password', {
      icon: 'LockOutlined',
      title: tval('Change password'),
      Component: ChangePassword,
    });

    this.userSettingsManager.add('user-profile', {
      icon: 'UserOutlined',
      title: tval('Edit profile'),
      Component: UserProfile,
    });

    const acl = this.app.pm.get(ACLPlugin);
    acl.rolesManager.add('users', {
      title: tval('Users'),
      Component: RoleUsersManager,
    });
  }
}

export default PluginUsersClient;
