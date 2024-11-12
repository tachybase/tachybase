import React from 'react';
import { SchemaComponent, useAPIClient, useTranslation } from '@tachybase/client';
import { ISchema, useForm } from '@tachybase/schema';
import { uid } from '@tachybase/utils/client';

import { App } from 'antd';

export const ChangePassword = () => {
  return <SchemaComponent schema={schema} scope={{ useSaveCurrentUserValues }} />;
};

const useSaveCurrentUserValues = () => {
  const form = useForm();
  const api = useAPIClient();
  const { message } = App.useApp();
  const { t } = useTranslation();
  return {
    async run() {
      await form.submit();
      const result = await api.resource('auth').changePassword({
        values: form.values,
      });
      if (result.status === 200) {
        message.success(t('Edited successfully'));
      }
      await form.reset();
    },
  };
};

const schema: ISchema = {
  type: 'object',
  properties: {
    [uid()]: {
      type: 'void',
      'x-component': 'CardItem',
      'x-decorator': 'Form',
      title: '{{t("Change password")}}',
      properties: {
        action: {
          type: 'void',
          properties: {
            submit: {
              title: '{{t("Submit")}}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                style: { left: '96%' },
                useAction: '{{ useSaveCurrentUserValues }}',
              },
            },
          },
        },
        oldPassword: {
          type: 'string',
          title: '{{t("Old password")}}',
          required: true,
          'x-component': 'Password',
          'x-decorator': 'FormItem',
        },
        newPassword: {
          type: 'string',
          title: '{{t("New password")}}',
          required: true,
          'x-component': 'Password',
          'x-decorator': 'FormItem',
          'x-component-props': { checkStrength: true, style: {} },
          'x-reactions': [
            {
              dependencies: ['.confirmPassword'],
              fulfill: {
                state: {
                  selfErrors: '{{$deps[0] && $self.value && $self.value !== $deps[0] ? t("Password mismatch") : ""}}',
                },
              },
            },
          ],
        },
        confirmPassword: {
          type: 'string',
          required: true,
          title: '{{t("Confirm password")}}',
          'x-component': 'Password',
          'x-decorator': 'FormItem',
          'x-component-props': { checkStrength: true, style: {} },
          'x-reactions': [
            {
              dependencies: ['.newPassword'],
              fulfill: {
                state: {
                  selfErrors: '{{$deps[0] && $self.value && $self.value !== $deps[0] ? t("Password mismatch") : ""}}',
                },
              },
            },
          ],
        },
      },
    },
  },
};
