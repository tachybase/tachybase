import { css } from '@tachybase/client';

import { debounceClick } from './debounceClick.util';

export const getSchemaRequestHeaders = ({ title, defaultValue, field, parentForm, actionKey }) => {
  const handleReactions = (field) => {
    const headerList = parentForm?.values?.actions?.[actionKey]?.headers;

    if (headerList?.length > 0 && headerList !== defaultValue) {
      field.setValue(headerList);
    }
  };

  const handleClickFunc = () => {
    debounceClick(parentForm, actionKey, 'headers', field.form.values.headers);
  };

  return {
    type: 'object',
    'x-decorator': 'Form',
    properties: {
      headers: {
        type: 'array',
        'x-component': 'ArrayItems',
        default: defaultValue,
        'x-decorator': 'FormItem',
        'x-reactions': handleReactions,
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
                      minWidth: '220px',
                    },
                  },
                },
                remove: {
                  type: 'void',
                  'x-decorator': 'FormItem',
                  'x-component': 'ArrayItems.Remove',
                  'x-component-props': {
                    onClick: handleClickFunc,
                  },
                },
              },
            },
          },
        },
        properties: {
          add: {
            title: title,
            type: 'void',
            'x-component': 'ArrayItems.Addition',
          },
        },
      },
    },
  };
};
