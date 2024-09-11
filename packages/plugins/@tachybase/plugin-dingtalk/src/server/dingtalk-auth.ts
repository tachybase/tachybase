import { BaseAuth } from '@tachybase/auth';

import { namespace } from '../constants';
import { DingtalkClient } from './dingtalk-client';

export class DingtalkAuth extends BaseAuth {
  constructor(config) {
    const { ctx } = config;
    super({
      ...config,
      userCollection: ctx.db.getCollection('users'),
    });
  }
  async validate() {
    const ctx = this.ctx;
    const { authCode } = ctx.action.params || {};
    if (!authCode) {
      ctx.throw(401, ctx.t('Please enter the authCode', { ns: namespace }));
    }
    const dingtalkClient = new DingtalkClient({
      clientId: this.options?.dingtalk?.clientId,
      clientSecret: this.options?.clientSecret,
      ctx: this.ctx,
    });
    const accessToken = await dingtalkClient.getAccessToken(authCode);
    if (!accessToken) {
      ctx.throw(401, ctx.t('Failed to get accessToken', { ns: namespace }));
    }
    const userInfo = await dingtalkClient.getUserInfo(accessToken);
    const { mobile, nick, email } = userInfo;
    if (!mobile) {
      ctx.throw(401, ctx.t('Failed to get mobile', { ns: namespace }));
    }
    const authenticator = this.authenticator;
    let user = await authenticator.findUser(mobile);
    if (user) {
      return user;
    }
    user = await this.userRepository.findOne({
      filter: { phone: mobile },
    });
    if (user) {
      await authenticator.addUser(user.id, {
        through: {
          uuid: mobile,
        },
      });
      return user;
    }
    const { autoSignup } = this.options?.public || {};
    if (!autoSignup) {
      ctx.throw(401, ctx.t('User not found', { ns: namespace }));
    }
    return await authenticator.newUser(mobile, {
      nickname: nick ?? null,
      phone: mobile ?? null,
      email: email ?? null,
    });
  }
  async getAuthUrl(redirect) {
    const clientId = this.options?.dingtalk?.clientId;
    const app = this.ctx.app.name;
    const redirectUrl = encodeURIComponent(
      `${this.ctx.protocol}://${this.ctx.host}${process.env.API_BASE_PATH}dingtalk:redirect`,
    );
    // TODO: 如果后续有登录后绑定的场景，服务端需要校验 state
    const state = encodeURIComponent(`redirect=${redirect}&app=${app}&name=${this.ctx.headers['x-authenticator']}`);
    const url = `https://login.dingtalk.com/oauth2/auth?client_id=${clientId}&response_type=code&scope=openid&state=${state}&redirect_uri=${redirectUrl}&prompt=consent`;
    return url;
  }
}
