import { Plugin, tval } from '@tachybase/client';
import ACLPlugin from '@tachybase/plugin-acl/client';

import { RoleUsersManager } from './RoleUsersManager';
import { UserProfile } from './UserProfile';
import { UsersManagement } from './UsersManagement';

class PluginUsersClient extends Plugin {
  async load() {
    this.app.pluginSettingsManager.add('users-permissions', {
      title: tval('Users & Permissions', { ns: 'users' }),
      icon: 'TeamOutlined',
    });
    this.app.pluginSettingsManager.add('users-permissions.users', {
      title: tval('Users'),
      icon: 'UserOutlined',
      Component: UsersManagement,
      aclSnippet: 'pm.users',
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
