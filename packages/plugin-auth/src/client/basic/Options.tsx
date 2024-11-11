import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { Alert } from 'antd';

import { useAuthTranslation } from '../locale';

export const Options = () => {
  const { t } = useAuthTranslation();
  return (
    <SchemaComponent
      scope={{ t }}
      components={{ Alert }}
      schema={{
        type: 'object',
        properties: {
          public: {
            type: 'object',
            properties: {
              allowSignUp: {
                'x-decorator': 'FormItem',
                type: 'boolean',
                title: '{{t("Allow to sign up")}}',
                'x-component': 'Checkbox',
                'x-component-props': {
                  defaultChecked: true,
                },
              },
            },
          },
          notice: {
            type: 'void',
            'x-component': 'Alert',
            'x-component-props': {
              showIcon: true,
              message: '{{t("The authentication allows users to sign in via username or email.")}}',
            },
          },
        },
      }}
    />
  );
};
