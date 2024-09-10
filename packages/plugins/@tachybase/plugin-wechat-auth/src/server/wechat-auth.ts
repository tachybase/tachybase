import { AuthConfig, BaseAuth } from '@tachybase/auth';

import { namespace, weChatApiOauthBaseUrl, weChatApiOauthScope } from '../constants';

export { Model } from '@tachybase/database';

export class WeChatAuth extends BaseAuth {
  constructor(config: AuthConfig) {
    const { ctx } = config;
    super({
      ...config,
      userCollection: ctx.db.getCollection('users'),
    });
  }

  async validate() {
    const ctx = this.ctx;
    let { code } = ctx.request.query || {};
    code = Array.isArray(code) ? code[0] : code;

    if (!code) {
      ctx.logger.error('Failed to get code');
      ctx.throw(401, ctx.t('Unauthorized', { ns: namespace }));
    }

    try {
      const getAccessTokenRsp = await fetch(
        `${weChatApiOauthBaseUrl}access_token?appid=${this.options?.wechatAuth?.AppID}&secret=${this.options?.wechatAuth?.AppSecret}&code=${code}&grant_type=authorization_code`,
      );
      const getAccessTokenRspJson = await getAccessTokenRsp.json();
      if (getAccessTokenRspJson.errcode) {
        ctx.logger.error(`Failed to get user accessToken: ${getAccessTokenRspJson.errmsg}`);
        ctx.throw(401, ctx.t('Failed to get accessToken', { ns: namespace }));
      }
      const { access_token, unionid } = getAccessTokenRspJson;
      const authenticator = this.authenticator;
      const user = await authenticator.findUser(unionid);
      if (user) {
        return user;
      }
      // Create new user
      const { autoSignUp } = this.options?.public || {};
      if (!autoSignUp) {
        ctx.logger.error(`User not found: ${unionid}`);
        ctx.throw(401, ctx.t('User not found', { ns: namespace }));
      }
      return await authenticator.newUser(unionid, {
        unionid,
      });
    } catch (err) {
      ctx.logger.error(`Failed in validate: ${err}`);
      ctx.throw(401, ctx.t('Unauthorized', { ns: namespace }));
    }
  }

  async getAuthCfg(redirect) {
    const appID = this.options?.wechatAuth?.AppID;
    const app = this.ctx.app.name;
    const redirectUrl = encodeURIComponent(`${this.ctx.host}${process.env.API_BASE_PATH}wechatAuth:redirect`);
    // TODO: 如果后续有登录后绑定的场景，服务端需要校验 state
    const state = encodeURIComponent(
      encodeURIComponent(`redirect=${redirect}&app=${app}&name=${this.ctx.headers['x-authenticator']}`),
    );
    return {
      appId: appID,
      scope: weChatApiOauthScope,
      redirectUrl,
      state,
    };
  }
}
