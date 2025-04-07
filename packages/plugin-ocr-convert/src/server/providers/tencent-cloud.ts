import { ClientConfig } from 'tencentcloud-sdk-nodejs/tencentcloud/common/interface';
import { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/ocr/v20181119/ocr_client';

import {
  OCR_TYPE_BANKCARD,
  OCR_TYPE_BUSINESS_LICENSE,
  OCR_TYPE_DRIVER_LICENSE,
  OCR_TYPE_GENERAL,
  OCR_TYPE_GENERAL_ACCURATE,
  OCR_TYPE_HANDWRITING,
  OCR_TYPE_IDCARD,
  OCR_TYPE_VEHICLE_LICENSE,
} from '../constants';
import { namespace } from '../index';
import { OcrResult, Provider } from './Provider';

/**
 * 腾讯云 OCR 服务提供商
 */
export default class TencentCloudProvider extends Provider {
  private client: any;

  constructor(plugin, options) {
    super(plugin, options);

    const { secretId, secretKey, region = 'ap-guangzhou' } = this.options;

    const clientConfig: ClientConfig = {
      credential: {
        secretId,
        secretKey,
      },
      region,
      profile: {
        httpProfile: {
          endpoint: 'ocr.tencentcloudapi.com',
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
  async recognize(imageData: string, type: string = OCR_TYPE_GENERAL, options: any = {}): Promise<OcrResult[]> {
    try {
      const params: any = {};

      // 设置图片数据
      if (this.isUrl(imageData)) {
        params.ImageUrl = imageData;
      } else if (this.isBase64Image(imageData)) {
        // 移除Base64头部
        const base64Data = imageData.replace(/^data:image\/(jpeg|png|jpg|gif|bmp);base64,/, '');
        params.ImageBase64 = base64Data;
      } else {
        throw new Error(this.plugin.app.t('Invalid image format', { ns: namespace }));
      }

      // 根据不同的识别类型调用对应的API
      let response;
      let textItems = [];

      switch (type) {
        case OCR_TYPE_GENERAL:
          response = await this.client.GeneralBasicOCR(params);
          textItems = response.TextDetections || [];
          break;

        case OCR_TYPE_GENERAL_ACCURATE:
          response = await this.client.GeneralAccurateOCR(params);
          textItems = response.TextDetections || [];
          break;

        case OCR_TYPE_HANDWRITING:
          response = await this.client.GeneralHandwritingOCR(params);
          textItems = response.TextDetections || [];
          break;

        case OCR_TYPE_IDCARD:
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

        case OCR_TYPE_BUSINESS_LICENSE:
          response = await this.client.BizLicenseOCR(params);
          return [
            {
              text: JSON.stringify(response),
              original: response,
            },
          ];

        case OCR_TYPE_BANKCARD:
          response = await this.client.BankCardOCR(params);
          return [
            {
              text: JSON.stringify(response),
              original: response,
            },
          ];

        case OCR_TYPE_VEHICLE_LICENSE:
          response = await this.client.VehicleLicenseOCR(params);
          return [
            {
              text: JSON.stringify(response),
              original: response,
            },
          ];

        case OCR_TYPE_DRIVER_LICENSE:
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
    } catch (error) {
      this.plugin.app.logger.error('Tencent OCR error:', error);

      const err = new Error(this.plugin.app.t('OCR conversion failed', { ns: namespace }));

      // 识别错误类型
      if (error.code === 'AuthFailure') {
        err.name = 'AuthFailure';
      } else if (error.code === 'FailedOperation.ImageDecodeFailed') {
        err.name = 'ImageDecodeFailed';
      } else if (error.code === 'FailedOperation.DownLoadError') {
        err.name = 'DownloadError';
      } else if (error.code === 'FailedOperation.ImageNoText') {
        err.name = 'NoTextDetected';
      } else if (error.code === 'LimitExceeded.TooLargeFileError') {
        err.name = 'FileTooLarge';
      } else {
        err.name = 'OcrFailed';
      }

      throw err;
    }
  }
}
