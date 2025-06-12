import { InjectedPlugin, Plugin } from '@tachybase/server';

import { IpFilterController } from './actions/IpFilterController';
import { PasswordAttemptController } from './actions/PasswordAttemptController';
import { PasswordPolicyController } from './actions/PasswordPolicyController';
import { PasswordStrengthController } from './actions/PasswordStrengthController';
import { SignInFailsController } from './actions/SignInFailsController';
import { UserLocksController } from './actions/UserLocksController';
import { IPFilterService } from './services/IPFilterService';
import { PasswordAttemptService } from './services/PasswordAttemptService';
import { PasswordPolicyService } from './services/PasswordPolicyService';
import { PasswordStrengthService } from './services/PasswordStrengthService';

@InjectedPlugin({
  Controllers: [
    PasswordAttemptController,
    UserLocksController,
    IpFilterController,
    PasswordStrengthController,
    SignInFailsController,
    PasswordPolicyController,
  ],
  Services: [PasswordAttemptService, IPFilterService, PasswordStrengthService, PasswordPolicyService],
})
export class PluginPasswordPolicyServer extends Plugin {
  async load() {
    this.app.acl.registerSnippet({
      name: `pm.security.password-attempt`,
      actions: ['passwordAttempt:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.security.user-lock`,
      actions: ['userLocks:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.security.ip-filter`,
      actions: ['ipFilter:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.security.password-strength`,
      actions: ['passwordStrengthConfig:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.security.sign-in-fails`,
      actions: ['signInFails:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.security.password-policy`,
      actions: ['passwordPolicy:*'],
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
