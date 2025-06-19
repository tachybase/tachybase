import { Context } from '@tachybase/actions';

import { ClientConfig } from 'tencentcloud-sdk-nodejs/tencentcloud/common/interface';
import { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/ocr/v20181119/ocr_client';

import { namespace, OCR_TYPE_GENERAL } from '../../constants';
import { OcrResult, Provider } from './Provider';

/**
 * 腾讯云 OCR 服务提供商
 */
export default class TencentCloudProvider extends Provider {
  private client: any;

  constructor(plugin, options) {
    super(plugin, options);

    const { secretId, secretKey, region = 'ap-guangzhou', endpoint = 'ocr.tencentcloudapi.com' } = this.options;

    const clientConfig: ClientConfig = {
      credential: {
        secretId,
        secretKey,
      },
      region,
      profile: {
        httpProfile: {
          endpoint,
        },
      },
    };

    this.client = new Client(clientConfig);
  }

  /**
   * 将腾讯云OCR返回的坐标转换成标准格式
   */
  private convertCoordinates(polygon: Array<{ X: number; Y: number }>) {
    return polygon ? polygon.map((point) => ({ x: point.X, y: point.Y })) : undefined;
  }

  /**
   * 执行 OCR 识别
   */
  async recognize(
    ctx: Context,
    imageData: string,
    type: string = OCR_TYPE_GENERAL,
    options: any = {},
  ): Promise<OcrResult[]> {
    const params: any = {};

    // 设置图片数据
    if (this.isUrl(imageData)) {
      params.ImageUrl = imageData;
    } else if (this.isBase64Image(imageData)) {
      // 移除Base64头部
      const base64Data = imageData.replace(/^data:image\/(jpeg|png|jpg|gif|bmp);base64,/, '');
      params.ImageBase64 = base64Data;
    } else {
      throw new Error(ctx.t('Invalid image format', { ns: namespace }));
    }

    // 验证OCR类型是否在配置的ocrTypes列表中
    const { ocrTypes = [] } = this.options;
    if (!ocrTypes || !Array.isArray(ocrTypes) || ocrTypes.length === 0) {
      throw new Error(ctx.t('No OCR types configured', { ns: namespace }));
    }

    // 检查请求的类型是否在配置的ocrTypes列表中
    if (!ocrTypes.includes(type)) {
      throw new Error(ctx.t('OCR type not enabled', { ns: namespace }));
    }

    // 根据不同的识别类型调用对应的API
    let response;
    let textItems = [];
    switch (type) {
      case 'GeneralBasicOCR':
        response = await this.client.GeneralBasicOCR(params);
        textItems = response.TextDetections || [];
        break;

      case 'GeneralAccurateOCR':
        response = await this.client.GeneralAccurateOCR(params);
        textItems = response.TextDetections || [];
        break;

      case 'GeneralHandwritingOCR':
        response = await this.client.GeneralHandwritingOCR(params);
        textItems = response.TextDetections || [];
        break;

      case 'IDCardOCR':
        // 正反面识别
        const idcardSide = options.idcardSide || 'FRONT';
        params.CardSide = idcardSide;
        response = await this.client.IDCardOCR(params);

        // 特殊处理身份证信息
        return [
          {
            text: JSON.stringify(response),
            original: response,
          },
        ];

      case 'BizLicenseOCR':
        response = await this.client.BizLicenseOCR(params);
        return [
          {
            text: JSON.stringify(response),
            original: response,
          },
        ];

      case 'BankCardOCR':
        response = await this.client.BankCardOCR(params);
        return [
          {
            text: JSON.stringify(response),
            original: response,
          },
        ];

      case 'VehicleLicenseOCR':
        response = await this.client.VehicleLicenseOCR(params);
        return [
          {
            text: JSON.stringify(response),
            original: response,
          },
        ];

      case 'DriverLicenseOCR':
        response = await this.client.DriverLicenseOCR(params);
        return [
          {
            text: JSON.stringify(response),
            original: response,
          },
        ];

      default:
        response = await this.client.GeneralBasicOCR(params);
        textItems = response.TextDetections || [];
    }

    // 处理通用OCR识别结果
    return textItems.map((item) => ({
      text: item.DetectedText || '',
      confidence: item.Confidence || 0,
      coordinates: this.convertCoordinates(item.Polygon),
      angle: response.Angel,
      original: item,
    }));
  }
}
