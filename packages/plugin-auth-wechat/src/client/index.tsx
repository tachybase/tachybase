import { Plugin } from '@tachybase/client';
import AuthPlugin from '@tachybase/module-auth/client';

import { authType } from '../constants';
import { AdminSettingsForm } from './admin-settings-form';
import { BindForm } from './bind-form';
import { SignInForm } from './sign-in-form';

export class WeChatAuthPlugin extends Plugin {
  async load() {
    const auth = this.app.pm.get(AuthPlugin);
    auth.registerType(authType, {
      components: {
        SignInForm,
        AdminSettingsForm,
        BindForm,
      },
    });
  }
}

export default WeChatAuthPlugin;
