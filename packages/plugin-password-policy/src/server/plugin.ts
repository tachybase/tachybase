import { InjectedPlugin, Plugin } from '@tachybase/server';

import { PasswordPolicyController } from './actions/PasswordPolicyController';
import { UserLocksController } from './actions/UserLocksController';
import { PasswordPolicyService } from './services/PasswordPolicyService';

@InjectedPlugin({
  Controllers: [PasswordPolicyController, UserLocksController],
  Services: [PasswordPolicyService],
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
