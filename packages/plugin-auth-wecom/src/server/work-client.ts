import axios from 'axios';

interface Config {
  clientId: string;
  clientSecret: string;
  ctx?: any;
}

export class WorkClient {
  config: Config;
  ctx: any;
  accessToken: string = '';
  tokenExpiresAt: number = 0;

  constructor(config: Config) {
    this.config = config;
    this.ctx = config?.ctx;
  }

  private async fetchNewAccessToken(): Promise<void> {
    try {
      const response = await axios.get(
        `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${this.config.clientId}&corpsecret=${this.config.clientSecret}`,
      );
      const data = response.data;
      this.accessToken = data.access_token;
      this.tokenExpiresAt = Date.now() + data.expires_in * 1000;
    } catch (error) {
      console.error('获取 access_token 失败:', error);
      throw error;
    }
  }

  public async getAccessToken(): Promise<string> {
    if (!this.accessToken || Date.now() > this.tokenExpiresAt) {
      await this.fetchNewAccessToken();
    }
    return this.accessToken;
  }

  async getUserInfo(accessToken: string, code: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${accessToken}&code=${code}`,
      );
      const userId = response.data.UserId;

      if (userId) {
        const userDetailResponse = await axios.post(
          `https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${accessToken}&userid=${userId}`,
        );
        return userDetailResponse.data;
      } else {
        this.ctx?.log.debug(`get userInfo error message: ${response.data.errmsg}`);
        return {};
      }
    } catch (err) {
      if (err.response?.data?.errmsg) {
        this.ctx?.log.debug(`get userInfo error message: ${err.response.data.errmsg}`);
      }
      return {};
    }
  }
}
