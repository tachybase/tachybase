import { NAMESPACE } from '../../../../../locale';

export const getSchemaHeaders = ({ key, defaultValue }) => ({
  type: 'object',
  properties: {
    [key]: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTable',
      default: defaultValue,
      'x-component-props': {
        scroll: {
          y: 300,
        },
      },
      items: {
        type: 'object',
        properties: {
          column1: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              width: 200,
              title: `{{t("Name",{ ns: "${NAMESPACE}" })}}`,
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
            },
          },
          column2: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              width: 200,
              title: `{{t("Value",{ ns: "${NAMESPACE}" })}}`,
            },
            properties: {
              value: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '{{t("Value")}}',
                },
              },
            },
          },
        },
      },
    },
  },
});
