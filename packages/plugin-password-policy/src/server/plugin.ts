import { InjectedPlugin, Plugin } from '@tachybase/server';

import { IpFilterController } from './actions/IpFilterController';
import { PasswordPolicyController } from './actions/PasswordPolicyController';
import { UserLocksController } from './actions/UserLocksController';
import { IPFilterService } from './services/IPFilterService';
import { PasswordPolicyService } from './services/PasswordPolicyService';

@InjectedPlugin({
  Controllers: [PasswordPolicyController, UserLocksController, IpFilterController],
  Services: [PasswordPolicyService, IPFilterService],
})
export class PluginPasswordPolicyServer extends Plugin {
  async load() {
    this.app.acl.registerSnippet({
      name: `pm.security.password-policy`,
      actions: ['passwordPolicy:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.security.user-lock`,
      actions: ['userLocks:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.security.ip-filter`,
      actions: ['ipFilter:*'],
    });

    this.app.acl.addFixedParams('userLocks', 'list', () => {
      return {
        filter: {
          expireAt: {
            $gt: new Date(),
          },
        },
      };
    });
  }
}

export default PluginPasswordPolicyServer;
