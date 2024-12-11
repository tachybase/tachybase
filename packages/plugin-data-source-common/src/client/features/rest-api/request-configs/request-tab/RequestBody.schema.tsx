import { css } from '@tachybase/client';

import { NAMESPACE } from '../../../../locale';
import { debounceClick } from './debounceClick.util';

export const getSchemaRequestBody = ({ defaultValue, actionKey, parentForm, field }) => ({
  type: 'object',
  properties: {
    contentType: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      placeholder: `{{t("Content-Type",{ ns: "${NAMESPACE}" })}}`,
      default: defaultValue?.contentType,
      'x-component-props': {
        onChange: (headerValue) => {
          debounceClick(parentForm, actionKey, 'contentType', headerValue);
        },
      },
      enum: [
        {
          value: 'application/x-www-form-urlencoded',
          label: 'application/x-www-form-urlencoded ',
        },
        {
          value: 'application/json',
          label: 'application/json',
        },
      ],
      'x-reactions': (field) => {
        const header = parentForm.values.actions[actionKey];
        const contentType = header?.contentType;
        if (field?.value !== contentType) {
          field.setValue(contentType ?? 'application/json');
        }

        if (!field.value) {
          debounceClick(parentForm, actionKey, 'contentType', 'application/json');
        }
      },
    },
    body: {
      type: 'array',
      'x-component': 'ArrayItems',
      'x-decorator': 'FormItem',
      default: defaultValue.body,
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
                  onClick: () => {
                    debounceClick(parentForm, actionKey, 'body', field.form.values.body);
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
          title: `{{t("Add", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'ArrayItems.Addition',
        },
      },
      'x-reactions': [
        {
          dependencies: ['.contentType'],
          fulfill: {
            state: {
              visible: '{{ $deps[0]==="application/x-www-form-urlencoded"}}',
            },
          },
        },
      ],
    },
    jsonBody: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Variable.JSON',
      default: defaultValue.jsonBody,
      'x-component-props': {
        scope: '{{useVariableOptions}}',
        autoSize: true,
        fieldNames: {
          value: 'name',
          label: 'title',
        },
        placeholder: '{{t("Value")}}',
        style: {
          minHeight: 200,
        },
        onChange: (value) => {
          const { actions } = parentForm.values || {};
          parentForm.setValuesIn('actions', {
            ...actions,
            [actionKey]: {
              ...actions?.[actionKey],
              body: value,
            },
          });
        },
      },
      'x-reactions': [
        {
          dependencies: ['.contentType'],
          fulfill: {
            state: {
              visible: '{{ $deps[0]==="application/json"}}',
            },
          },
        },
        (filed) => {
          const bodyValue = parentForm?.values?.actions?.[actionKey]?.body;
          if (filed?.value !== bodyValue) {
            filed.setValue(parentForm.values.actions[actionKey].body);
          }
        },
      ],
    },
  },
});
