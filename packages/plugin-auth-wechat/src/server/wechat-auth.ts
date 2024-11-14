import { AuthConfig, BaseAuth } from '@tachybase/auth';

import { namespace, weChatApiOauthBaseUrl, weChatApiOauthScope } from '../constants';
import { dayjs } from '@tachybase/utils';
import { Context } from '@tachybase/actions';

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
    const { ctx } = this;
    try {
      const { unionid } = await this.getUnionid();
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
      ctx.throw(401, err?.message || ctx.t('Unauthorized', { ns: namespace }));
    }
  }

  async getUnionid(getInfo = false): Promise<{ unionid?: string, info?: any }> {
    const { ctx } = this;
    let { code } = ctx.request.query || {};
    code = Array.isArray(code) ? code[0] : code;

    if (!code) {
      ctx.logger.error('Failed to get code');
      ctx.throw(401, ctx.t('Unauthorized', { ns: namespace }));
    }
    try {
      const getAccessTokenRsp = await fetch(
        `${weChatApiOauthBaseUrl}/oauth2/access_token?appid=${this.options?.wechatAuth?.AppID}&secret=${this.options?.wechatAuth?.AppSecret}&code=${code}&grant_type=authorization_code`,
      );
      const getAccessTokenRspJson = await getAccessTokenRsp.json();
      if (getAccessTokenRspJson.errcode) {
        ctx.logger.error(`Failed to get user accessToken: ${getAccessTokenRspJson.errmsg}`);
        ctx.throw(401, ctx.t('Failed to get accessToken', { ns: namespace }));
      }
      const { access_token, unionid, openid } = getAccessTokenRspJson;
      if (getInfo) {
        const getInfoRsp = await fetch(
          `${weChatApiOauthBaseUrl}/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`,
        );
        const getInfoRspJson = await getInfoRsp.json();
        if (!getInfoRspJson.errcode) {
          return { unionid, info: getInfoRspJson};
        }
      }
      return { unionid };
    } catch (e) {
      ctx.logger.error('Failed to get code');
      return {};
    }
  }

  async bindUser(userId: number) {
    const { unionid, info } = await this.getUnionid(true);
    if (!unionid) {
      this.ctx.throw(400, 'Bind user failed: no weixin user found');
    }
    const authenticator = this.authenticator;
    const existUser = await authenticator.findUser(unionid);
    if (existUser) {
      this.ctx.throw(400, 'Bind user failed: wechat can bine one user!');
    }
    await authenticator.bindUser(userId, unionid, {
      nickname: info?.nickname,
      avatar: info?.headimgurl,
    });
  }

  async getAuthCfg(redirect: string) {
    const appID = this.options?.wechatAuth?.AppID;
    const app = this.ctx.app.name;
    const ctx = this.ctx;
    const referer = ctx.req.headers['referer'];
    let redirectUrl;
    // 本地测试使用
    if (referer) {
      const clientUrl = new URL(referer);
      redirectUrl = `${clientUrl.protocol}//${clientUrl.host}${process.env.API_BASE_PATH}wechatAuth:redirect`;
    } else {
      redirectUrl = `${this.ctx.protocol}://${this.ctx.host}${process.env.API_BASE_PATH}wechatAuth:redirect`;
    }
    // 如果后续有登录后绑定的场景，服务端需要校验 state
    const state = encodeURIComponent(
      encodeURIComponent(`redirect=${redirect}&app=${app}&name=${this.ctx.headers['x-authenticator']}&ts=${dayjs().unix()}`),
    );
    return {
      appId: appID,
      scope: weChatApiOauthScope,
      redirectUrl: encodeURIComponent(redirectUrl),
      state,
    };
  }
}
