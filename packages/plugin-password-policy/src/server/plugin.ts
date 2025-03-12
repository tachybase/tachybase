import { Context, Next } from '@tachybase/actions';
import { InjectedPlugin, Plugin } from '@tachybase/server';

import { PasswordPolicyController } from './actions/passwordPolicyController';
import { PasswordPolicyService } from './services/PasswordPolicyService';

@InjectedPlugin({
  Controllers: [PasswordPolicyController],
  Services: [PasswordPolicyService],
})
export class PluginPasswordPolicyServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.acl.registerSnippet({
      name: `pm.security.password-policy`,
      actions: ['password-policy:*'],
    });
    this.app.acl.registerSnippet({
      name: `pm.security.user-lock`,
      actions: ['user-lock:*'],
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginPasswordPolicyServer;
