import { Plugin } from '@tachybase/client';

import { RolesManager } from './roles-manager';
import { RolesManagement } from './RolesManagement';

export class PluginACLClient extends Plugin {
  rolesManager = new RolesManager();

  async load() {
    // TODO
    this.systemSettingsManager.add('business-components.roles', {
      title: this.t('Roles & Permissions'),
      icon: 'LockOutlined',
      Component: RolesManagement,
      aclSnippet: 'pm.acl.roles',
      sort: 3,
    });
  }
}

export { RolesManagerContext } from './RolesManagerProvider';
export default PluginACLClient;
