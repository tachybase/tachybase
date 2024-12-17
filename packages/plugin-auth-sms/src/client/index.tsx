import { Plugin } from '@tachybase/client';
import AuthPlugin from '@tachybase/module-auth/client';

import { authType } from '../constants';
import { Options } from './Options';
import { SigninPage } from './SigninPage';

export class SmsAuthPlugin extends Plugin {
  async load() {
    const auth = this.app.pm.get(AuthPlugin);
    auth.registerType(authType, {
      components: {
        SignInForm: SigninPage,
        AdminSettingsForm: Options,
      },
    });
  }
}

export default SmsAuthPlugin;
