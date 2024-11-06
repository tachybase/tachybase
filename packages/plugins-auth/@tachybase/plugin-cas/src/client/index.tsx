import { Plugin } from '@tachybase/client';
import AuthPlugin from '@tachybase/plugin-auth/client';

import { authType } from '../constants';
import { Options } from './Options';
import { SigninPage } from './SigninPage';

export class SamlPlugin extends Plugin {
  async load() {
    const auth = this.app.pm.get(AuthPlugin);
    auth.registerType(authType, {
      components: {
        SignInButton: SigninPage,
        AdminSettingsForm: Options,
      },
    });
  }
}

export default SamlPlugin;
