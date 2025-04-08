import { ISchema } from '@tachybase/schema';

import { PROVIDER_TYPE_TENCENT } from '../../constants';
import { lang } from '../locale';

const TencentCloudOcr: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: lang('Provider name'),
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      required: true,
    },
    type: {
      type: 'string',
      title: lang('Provider type'),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      default: PROVIDER_TYPE_TENCENT,
      enum: [
        {
          label: lang('Tencent Cloud OCR'),
          value: PROVIDER_TYPE_TENCENT,
        },
      ],
      required: true,
      'x-disabled': true,
    },
    options: {
      type: 'object',
      properties: {
        secretId: {
          type: 'string',
          title: lang('Secret ID'),
          'x-decorator': 'FormItem',
          'x-component': 'Password',
          required: true,
        },
        secretKey: {
          type: 'string',
          title: lang('Secret Key'),
          'x-decorator': 'FormItem',
          'x-component': 'Password',
          required: true,
        },
        region: {
          type: 'string',
          title: lang('Region'),
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: 'ap-guangzhou',
          description: lang('Default region: ap-guangzhou'),
        },
        endpoint: {
          type: 'string',
          title: lang('Endpoint'),
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: 'ocr.tencentcloudapi.com',
          description: lang('Default endpoint: ocr.tencentcloudapi.com'),
        },
        ocrTypes: {
          type: 'array',
          title: lang('OCR Types'),
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          default: ['GeneralBasicOCR'],
          enum: [
            { label: lang('General OCR'), value: 'GeneralBasicOCR' },
            { label: lang('Accurate OCR'), value: 'GeneralAccurateOCR' },
            { label: lang('Handwriting OCR'), value: 'GeneralHandwritingOCR' },
            { label: lang('Fast OCR'), value: 'GeneralFastOCR' },
            { label: lang('Efficient OCR'), value: 'GeneralEfficientOCR' },
            { label: lang('Form OCR'), value: 'TableOCR' },
          ],
          required: true,
        },
      },
    },
  },
};

export default TencentCloudOcr;
