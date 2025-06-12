import { tval } from '../locale';

export const getSchemaPasswordValidityPeriod = () => {
  return {
    type: 'object',
    properties: {
      passwordValidityPeriod: {
        type: 'void',
        title: tval('Password validity period'),
        'x-decorator': 'CardItem',
        'x-component': 'FormV2',
        'x-use-component-props': 'usePasswordPolicyValues',
        properties: {
          validityPeriod: {
            type: 'number',
            title: tval('Password validity period (days)'),
            description: tval('Default value is never.'),
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              defaultValue: 0,
              options: [
                {
                  label: '30',
                  value: 30,
                },
                {
                  label: '60',
                  value: 60,
                },
                {
                  label: '90',
                  value: 90,
                },
                {
                  label: '180',
                  value: 180,
                },
                {
                  label: '365',
                  value: 365,
                },
                {
                  label: tval('Never expire'),
                  value: 0,
                },
              ],
            },
          },
          footer: {
            type: 'void',
            'x-component': 'ActionBar',
            properties: {
              submit: {
                title: '{{t("Submit")}}',
                'x-component': 'Action',
                'x-component-props': {
                  type: 'primary',
                  useAction: '{{ useSavePasswordPolicyValues }}',
                },
              },
            },
          },
        },
      },
    },
  };
};
