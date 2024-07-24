import { AuthConfig, BaseAuth } from '@tachybase/auth';
import { AuthModel } from '@tachybase/plugin-auth';

import { namespace } from '../constants';
import { WorkClient } from './work-client.js';

export { Model } from '@tachybase/database';

export class WorkAuth extends BaseAuth {
  constructor(config: AuthConfig) {
    const { ctx } = config;
    super({
      ...config,
      userCollection: ctx.db.getCollection('users'),
    });
  }

  async validate() {
    const ctx = this.ctx;
    const { code } = ctx.request.query || {};
    const codeString = Array.isArray(code) ? code[0] : code;

    if (!codeString) {
      ctx.throw(401, ctx.t('Please enter the authCode', { ns: namespace }));
    }

    const workClient = new WorkClient({
      clientId: this.options?.workWeChat?.corpId,
      clientSecret: this.options?.workWeChat?.corpSecret,
      ctx: this.ctx,
    });

    const accessToken = await workClient.getAccessToken();
    if (!accessToken) {
      ctx.throw(401, ctx.t('Failed to get accessToken', { ns: namespace }));
    }
    const userInfo = await workClient.getUserInfo(accessToken, codeString);
    const { telephone, name, userid } = userInfo;
    if (!telephone) {
      ctx.throw(401, ctx.t('Failed to get telephone', { ns: namespace }));
    }
    const authenticator = this.authenticator;
    let user = await authenticator.findUser(telephone);
    if (user) {
      return user;
    }

    user = await this.userRepository.findOne({
      filter: { phone: telephone },
    });
    if (user) {
      await authenticator.addUser(user.id, {
        through: {
          uuid: telephone,
        },
      });
      return user;
    }
    const { autoSignup } = this.options?.public || {};
    if (!autoSignup) {
      ctx.throw(401, ctx.t('User not found', { ns: namespace }));
    }
    return await authenticator.newUser(telephone, {
      nickname: name ?? null,
      phone: telephone ?? null,
    });
  }

  async getAuthUrl(redirect) {
    const clientId = this.options?.workWeChat?.corpId;
    const agentId = this.options?.workWeChat?.agentId;
    const app = this.ctx.app.name;
    // const redirectUrl = encodeURIComponent('https://hua.dev.daoyoucloud.com/api/workWeChat:redirect');
    const redirectUrl = encodeURIComponent(`${this.ctx.host}${process.env.API_BASE_PATH}workWeChat:redirect`);
    // TODO: 如果后续有登录后绑定的场景，服务端需要校验 state
    const state = encodeURIComponent(
      encodeURIComponent(`redirect=${redirect}&app=${app}&name=${this.ctx.headers['x-authenticator']}`),
    );
    const url = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${clientId}&agentid=${agentId}&redirect_uri=${redirectUrl}&state=${state}`;
    return url;
  }
}
