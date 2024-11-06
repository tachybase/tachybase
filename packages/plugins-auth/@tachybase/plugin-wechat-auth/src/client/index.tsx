import { Plugin } from '@tachybase/client';
import AuthPlugin from '@tachybase/plugin-auth/client';

import { authType } from '../constants';
import { AdminSettingsForm } from './admin-settings-form';
import { SignInForm } from './sign-in-form';

export class WeChatAuthPlugin extends Plugin {
  async load() {
    const auth = this.app.pm.get(AuthPlugin);
    auth.registerType(authType, {
      components: {
        SignInForm,
        AdminSettingsForm,
      },
    });
  }
}

export default WeChatAuthPlugin;
