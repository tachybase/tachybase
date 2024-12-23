import { NAMESPACE } from '../constants';

export const COLLECTION_NAME_MESSAGES_PROVIDERS = 'messages_providers';

export default {
  dumpRules: {
    group: 'third-party',
  },
  name: COLLECTION_NAME_MESSAGES_PROVIDERS,
  shared: true,
  fields: [
    {
      type: 'string',
      name: 'id',
      primaryKey: true,
      interface: 'input',
      uiSchema: {
        title: '{{t("ID")}}',
        type: 'string',
        'x-component': 'Input',
        required: true,
      },
    },
    {
      type: 'string',
      name: 'title',
      interface: 'input',
      uiSchema: {
        title: '{{t("Title")}}',
        type: 'string',
        'x-component': 'Input',
        required: true,
      },
    },
    {
      type: 'string',
      name: 'type',
      interface: 'select',
      uiSchema: {
        title: `{{t("Provider type", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'Select',
        required: true,
        enum: [
          { label: `{{t("Aliyun SMS", { ns: "${NAMESPACE}" })}}`, value: 'sms-aliyun' },
          { label: `{{t("Tencent SMS", { ns: "${NAMESPACE}" })}}`, value: 'sms-tencent' },
        ],
      },
    },
    {
      type: 'jsonb',
      name: 'options',
    },
    {
      type: 'radio',
      name: 'default',
      interface: 'checkbox',
      uiSchema: {
        title: '{{t("Default")}}',
        type: 'boolean',
        'x-component': 'Checkbox',
      },
    },
  ],
};
