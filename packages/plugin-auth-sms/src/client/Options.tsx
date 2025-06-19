import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { useAuthTranslation } from './locale';

export const Options = () => {
  const { t } = useAuthTranslation();
  return (
    <SchemaComponent
      scope={{ t }}
      schema={{
        type: 'object',
        properties: {
          sms: {
            type: 'void',
            properties: {
              public: {
                type: 'object',
                properties: {
                  autoSignup: {
                    'x-decorator': 'FormItem',
                    type: 'boolean',
                    title: '{{t("Sign up automatically when the user does not exist")}}',
                    'x-component': 'Checkbox',
                  },
                  agreeMust: {
                    'x-decorator': 'FormItem',
                    type: 'boolean',
                    title: '{{t("Must agree to the agreement")}}',
                    'x-component': 'Checkbox',
                  },
                  agreeCode: {
                    'x-decorator': 'FormItem',
                    type: 'string',
                    title: '{{t("Agree to the agreement text (html supported)")}}',
                    'x-component': 'Input.TextArea',
                  },
                },
              },
            },
          },
        },
      }}
    />
  );
};
