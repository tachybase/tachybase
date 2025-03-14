import { InjectedPlugin, Plugin } from '@tachybase/server';

import { IpFilterController } from './actions/IpFilterController';
import { PasswordAttemptController } from './actions/PasswordAttemptController';
import { PasswordStrengthController } from './actions/PasswordStrengthController';
import { UserLocksController } from './actions/UserLocksController';
import { IPFilterService } from './services/IPFilterService';
import { PasswordAttemptService } from './services/PasswordAttemptService';
import { PasswordStrengthService } from './services/PasswordStrengthService';

@InjectedPlugin({
  Controllers: [PasswordAttemptController, UserLocksController, IpFilterController, PasswordStrengthController],
  Services: [PasswordAttemptService, IPFilterService, PasswordStrengthService],
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
