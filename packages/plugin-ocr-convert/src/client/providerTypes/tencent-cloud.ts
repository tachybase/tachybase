import { ISchema } from '@tachybase/schema';

import { lang, NAMESPACE } from '../locale';

export default {
  type: 'object',
  properties: {
    secretId: {
      title: `{{t("Secret ID", { ns: "${NAMESPACE}" })}}`,
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'TextAreaWithGlobalScope',
      required: true,
    },
    secretKey: {
      title: `{{t("Secret Key", { ns: "${NAMESPACE}" })}}`,
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'TextAreaWithGlobalScope',
      // 'x-component-props': { password: true },
      required: true,
    },
    region: {
      title: `{{t("Region", { ns: "${NAMESPACE}" })}}`,
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: 'ap-guangzhou',
        options: [
          { label: lang('ap-guangzhou (guangzhou)'), value: 'ap-guangzhou' },
          { label: lang('ap-shanghai (shanghai)'), value: 'ap-shanghai' },
          { label: lang('ap-beijing (beijing)'), value: 'ap-beijing' },
          { label: lang('ap-hongkong (hongkong)'), value: 'ap-hongkong' },
          { label: lang('ap-singapore (singapore)'), value: 'ap-singapore' },
        ],
      },
      default: 'ap-guangzhou',
    },
    endpoint: {
      title: `{{t("Endpoint", { ns: "${NAMESPACE}" })}}`,
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: 'ocr.tencentcloudapi.com',
      },
      default: 'ocr.tencentcloudapi.com',
    },
    enabledTypes: {
      title: `{{t("Recognition Types", { ns: "${NAMESPACE}" })}}`,
      type: 'array',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
        options: [
          { label: `{{t("General OCR", { ns: "${NAMESPACE}" })}}`, value: 'general' },
          { label: `{{t("Accurate OCR", { ns: "${NAMESPACE}" })}}`, value: 'general-accurate' },
          { label: `{{t("Handwriting OCR", { ns: "${NAMESPACE}" })}}`, value: 'handwriting' },
          { label: `{{t("ID Card OCR", { ns: "${NAMESPACE}" })}}`, value: 'idcard' },
          { label: `{{t("Business License OCR", { ns: "${NAMESPACE}" })}}`, value: 'business-license' },
          { label: `{{t("Bank Card OCR", { ns: "${NAMESPACE}" })}}`, value: 'bankcard' },
          { label: `{{t("Vehicle License OCR", { ns: "${NAMESPACE}" })}}`, value: 'vehicle-license' },
          { label: `{{t("Driver License OCR", { ns: "${NAMESPACE}" })}}`, value: 'driver-license' },
        ],
      },
      default: ['general'],
    },
  },
} as ISchema;
