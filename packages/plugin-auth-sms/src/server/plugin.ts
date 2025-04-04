import { resolve } from 'path';
import VerificationPlugin from '@tachybase/plugin-otp';
import { InstallOptions, Plugin } from '@tachybase/server';

import { authType } from '../constants';
import { SMSAuth } from './sms-auth';

export class SmsAuthPlugin extends Plugin {
  afterAdd() {}

  async load() {
    this.db.addMigrations({
      namespace: 'sms-auth',
      directory: resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });

    const verificationPlugin: VerificationPlugin = this.app.getPlugin('otp');
    if (!verificationPlugin) {
      this.app.logger.warn('sms-auth: @tachybase/plugin-otp is required');
      return;
    }
    verificationPlugin.interceptors.register('auth:signIn', {
      manual: true,
      getReceiver: (ctx) => {
        return ctx.action.params.values.phone;
      },
      expiresIn: 120,
      validate: async (ctx, phone) => {
        if (!phone) {
          throw new Error(ctx.t('Not a valid cellphone number, please re-enter'));
        }
        return true;
      },
    });

    this.app.authManager.registerTypes(authType, {
      auth: SMSAuth,
    });
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default SmsAuthPlugin;
