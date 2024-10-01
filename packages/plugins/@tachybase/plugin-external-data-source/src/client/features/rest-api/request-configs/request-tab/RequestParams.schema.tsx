import { css } from '@tachybase/client';

import { debounceClick } from './debounceClick.util';

export const getSchemaRequestParams = ({ title, defaultValue, field, parentForm, actionKey }) => ({
  type: 'object',
  'x-decorator': 'Form',
  properties: {
    params: {
      type: 'array',
      'x-component': 'ArrayItems',
      default: defaultValue,
      'x-decorator': 'FormItem',
      'x-reactions': (field) => {
        const params = parentForm.values?.actions?.[actionKey]?.params;
        if (params?.length && params !== defaultValue) {
          field.setValue(params);
        }
      },
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
                'x-component-props': {
                  placeholder: '{{t("Name")}}',
                  style: {
                    width: '100%',
                  },
                },
              },
              value: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Variable.RawTextArea',
                'x-component-props': {
                  scope: '{{useVariableOptions}}',
                  autoSize: true,
                  fieldNames: {
                    value: 'name',
                    label: 'title',
                  },
                  style: {
                    minWidth: '230px',
                    width: '100%',
                  },
                },
              },
              remove: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.Remove',
                'x-component-props': {
                  onClick: () => {
                    debounceClick(parentForm, actionKey, 'params', field.form.values?.params);
                  },
                },
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: title,
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
  },
});
