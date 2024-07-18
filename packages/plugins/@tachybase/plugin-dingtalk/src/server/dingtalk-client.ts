import ContactClient, { GetUserHeaders } from '@alicloud/dingtalk/contact_1_0';
import OAuthClient, { GetUserTokenRequest } from '@alicloud/dingtalk/oauth2_1_0';
import { Config } from '@alicloud/openapi-client';
import Util, { RuntimeOptions } from '@alicloud/tea-util';

export class DingtalkClient {
  config;
  ctx;
  constructor(config) {
    this.config = config;
    this.ctx = config?.ctx;
  }
  createAuthClient() {
    const config = new Config({});
    config.protocol = 'https';
    config.regionId = 'central';
    return new OAuthClient(config);
  }
  createContactClient() {
    const config = new Config({});
    config.protocol = 'https';
    config.regionId = 'central';
    return new ContactClient(config);
  }
  async getAccessToken(code) {
    const client = this.createAuthClient();
    const getUserTokenRequest = new GetUserTokenRequest({
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      code,
      grantType: 'authorization_code',
    });
    try {
      const response = await client.getUserToken(getUserTokenRequest);
      return response?.body?.accessToken || '';
    } catch (err) {
      if (!Util.empty(err.code) && !Util.empty(err.message)) {
        this.ctx?.log.debug(`DingTalk get accessToken error code:${err.code}, message:${err.message}`);
      }
      return '';
    }
  }
  async getUserInfo(accessToken) {
    const client = this.createContactClient();
    const getUserHeaders = new GetUserHeaders({});
    getUserHeaders.xAcsDingtalkAccessToken = accessToken;
    try {
      const response = await client.getUserWithOptions('me', getUserHeaders, new RuntimeOptions({}));
      return response?.body || {};
    } catch (err) {
      if (!Util.empty(err.code) && !Util.empty(err.message)) {
        this.ctx?.log.debug(`DingTalk get userInfo error code:${err.code}, message:${err.message}`);
      }
      return {};
    }
  }
}
