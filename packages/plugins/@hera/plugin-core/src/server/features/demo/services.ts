import Captcha, { VerifyIntelligentCaptchaRequest } from '@alicloud/captcha20230305';
import { Config } from '@alicloud/openapi-client';

export function createAliCaptchaClient() {
  const config = new Config({});
  config.accessKeyId = process.env['ALI_CAPTCHA_ACCESS_KEY_ID'];
  config.accessKeySecret = process.env['ALI_CAPTCHA_ACCESS_KEY_SECRET'];
  config.endpoint = process.env['ALI_CAPTCH_ENDPOINT']
    ? process.env['ALI_CAPTCH_ENDPOINT']
    : 'captcha.cn-shanghai.aliyuncs.com';
  config.connectTimeout = 5e3;
  config.readTimeout = 5e3;
  return new Captcha(config);
}

export function createAliCaptchaRequest({ senceId, captchaVerifyParam }) {
  const request = new VerifyIntelligentCaptchaRequest({});
  request.sceneId = senceId;
  request.captchaVerifyParam = captchaVerifyParam;
  return request;
}
