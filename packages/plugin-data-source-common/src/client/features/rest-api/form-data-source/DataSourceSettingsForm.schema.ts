import { css } from '@tachybase/client';

import { NAMESPACE } from '../../../locale';

export const schemaDataSourceSettingsForm = {
  type: 'object',
  properties: {
    displayName: {
      type: 'string',
      title: `{{t("Data source display name",{ ns: "${NAMESPACE}" })}}`,
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    key: {
      type: 'string',
      title: `{{t("Data source name",{ ns: "${NAMESPACE}" })}}`,
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-validator': 'uid',
      'x-disabled': '{{ createOnly }}',
      description: `{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.',{ ns: "${NAMESPACE}" })}}`,
    },
    options: {
      type: 'object',
      properties: {
        baseUrl: {
          type: 'string',
          title: `{{t("BaseURL",{ ns: "${NAMESPACE}" })}}`,
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input.URL',
          'x-validator': 'url',
        },
        headers: {
          type: 'array',
          'x-component': 'ArrayItems',
          'x-decorator': 'FormItem',
          title: `{{t("Headers", { ns: "${NAMESPACE}" })}}`,
          items: {
            type: 'object',
            properties: {
              space: {
                type: 'void',
                'x-component': 'Space',
                'x-component-props': {
                  style: { flexWrap: 'nowrap', maxWidth: '100%', display: 'flex' },
                  className: css`
                    & > .ant-space-item:first-child,
                    & > .ant-space-item:last-child {
                      flex-shrink: 0;
                    }
                    & > .ant-space-item:first-child,
                    & > .ant-space-item:nth-of-type(2) {
                      flex: 1;
                    }
                  `,
                },
                properties: {
                  name: {
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: '{{t("Name")}}',
                    },
                  },
                  value: {
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      useTypedConstant: true,
                    },
                  },
                  remove: {
                    type: 'void',
                    'x-decorator': 'FormItem',
                    'x-component': 'ArrayItems.Remove',
                  },
                },
              },
            },
          },
          properties: {
            add: {
              type: 'void',
              title: `{{t("Add request header", { ns: "${NAMESPACE}" })}}`,
              'x-component': 'ArrayItems.Addition',
            },
          },
        },
        variables: {
          type: 'array',
          'x-component': 'ArrayItems',
          'x-decorator': 'FormItem',
          title: `{{t("Variables", { ns: "${NAMESPACE}" })}}`,
          items: {
            type: 'object',
            properties: {
              space: {
                type: 'void',
                'x-component': 'Space',
                'x-component-props': {
                  style: {
                    flexWrap: 'nowrap',
                    maxWidth: '100%',
                    display: 'flex',
                  },
                  className: css`
                    & > .ant-space-item:first-child,
                    & > .ant-space-item:last-child {
                      flex-shrink: 0;
                    }
                    & > .ant-space-item:first-child,
                    & > .ant-space-item:nth-of-type(2) {
                      flex: 1;
                    }
                  `,
                },
                properties: {
                  name: {
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': { placeholder: '{{t("Name")}}' },
                  },
                  value: {
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': { useTypedConstant: true },
                  },
                  remove: {
                    type: 'void',
                    'x-decorator': 'FormItem',
                    'x-component': 'ArrayItems.Remove',
                  },
                },
              },
            },
          },
          properties: {
            add: {
              type: 'void',
              title: `{{t("Add variable", { ns: "${NAMESPACE}" })}}`,
              'x-component': 'ArrayItems.Addition',
            },
          },
        },
        timeout: {
          type: 'string',
          title: `{{t("Timeout",{ ns: "${NAMESPACE}" })}}`,
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-component-props': {
            addonAfter: 'ms',
            style: {
              minWidth: 200,
            },
          },
          default: 5e3,
        },
        responseType: {
          type: 'string',
          title: `{{t("Response type",{ ns: "${NAMESPACE}" })}}`,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          default: 'json',
          enum: [
            {
              value: 'json',
              label: `{{t("JSON",{ ns: "${NAMESPACE}" })}}`,
            },
          ],
        },
      },
    },
    enabled: {
      type: 'string',
      'x-content': `{{t("Enabled the data source",{ ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
      default: true,
    },
  },
};
