import { AuthConfig, BaseAuth } from '@tachybase/auth';
import { Model } from '@tachybase/database';
import { AuthModel } from '@tachybase/module-auth';

import VerificationPlugin from 'packages/plugin-verification/src';

import { namespace } from '../constants';

export class SMSAuth extends BaseAuth {
  constructor(config: AuthConfig) {
    const { ctx } = config;
    super({
      ...config,
      userCollection: ctx.db.getCollection('users'),
    });
  }

  async validate() {
    const ctx = this.ctx;
    const verificationPlugin: VerificationPlugin = ctx.app.getPlugin('verification');
    if (!verificationPlugin) {
      throw new Error('sms-auth: @tachybase/plugin-verification is required');
    }
    let user: Model;
    await verificationPlugin.intercept(ctx, async () => {
      const {
        values: { phone },
      } = ctx.action.params;
      try {
        // History data compatible processing
        user = await this.userRepository.findOne({
          filter: { phone },
        });
        if (user) {
          await this.authenticator.addUser(user, {
            through: {
              uuid: phone,
            },
          });
          return;
        }
        // New data
        const { autoSignup } = this.authenticator.options?.public || {};
        const authenticator = this.authenticator as AuthModel;
        if (autoSignup) {
          user = await authenticator.findOrCreateUser(phone, {
            nickname: phone,
            phone,
          });
          return;
        }
        user = await authenticator.findUser(phone);
        if (!user) {
          throw new Error(ctx.t('The phone number is not registered, please register first', { ns: namespace }));
        }
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    });
    return user;
  }
}
