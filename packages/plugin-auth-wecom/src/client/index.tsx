import { Plugin } from '@tachybase/client';
import PluginAuthClient from '@tachybase/module-auth/client';

import { authType } from '../constants';
import { AdminSettingsForm, SignInButton } from './components';

export class PluginWorkWeChatClient extends Plugin {
  async load() {
    this.app.pm.get(PluginAuthClient).registerType(authType, { components: { SignInButton, AdminSettingsForm } });
  }
}

export default PluginWorkWeChatClient;
