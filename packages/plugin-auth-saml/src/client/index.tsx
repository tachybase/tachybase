import { Plugin } from '@tachybase/client';
import AuthPlugin from '@tachybase/module-auth/client';

import { authType } from '../constants';
import { Options } from './Options';
import { SAMLButton } from './SAMLButton';

export class SamlPlugin extends Plugin {
  async load() {
    const auth = this.app.pm.get(AuthPlugin);
    auth.registerType(authType, {
      components: {
        SignInButton: SAMLButton,
        AdminSettingsForm: Options,
      },
    });
  }
}

export default SamlPlugin;
