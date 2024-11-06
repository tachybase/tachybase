import { Plugin } from '@tachybase/client';
import PluginAuthClient from '@tachybase/plugin-auth/client';

import { authType } from '../constants';
import { AdminSettingsForm, SignInButton } from './components';

export class PluginDingding extends Plugin {
  async load() {
    this.app.pm.get(PluginAuthClient).registerType(authType, { components: { SignInButton, AdminSettingsForm } });
  }
}

export default PluginDingding;
