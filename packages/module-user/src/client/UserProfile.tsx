import React from 'react';
import { SchemaComponent, useAPIClient, useCurrentUserContext, useRequest, useTranslation } from '@tachybase/client';
import { ISchema, useForm } from '@tachybase/schema';
import { uid } from '@tachybase/utils/client';

import { App } from 'antd';

export const UserProfile = () => {
  return <SchemaComponent schema={schema} scope={{ useCurrentUserValues, useSaveCurrentUserValues }} />;
};

const useCurrentUserValues = (options) => {
  const ctx = useCurrentUserContext();
  return useRequest(() => Promise.resolve(ctx.data), options);
};

const useSaveCurrentUserValues = () => {
  const ctx = useCurrentUserContext();
  const form = useForm();
  const api = useAPIClient();
  const { message } = App.useApp();
  const { t } = useTranslation();
  return {
    async run() {
      const values = await form.submit<any>();
      const result = await api.resource('users').updateProfile({
        values,
      });
      if (result.status === 200) {
        message.success(t('Edited successfully'));
      }
      ctx.mutate({
        data: {
          ...ctx?.data?.data,
          ...values,
        },
      });
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
      'x-decorator-props': {
        useValues: '{{useCurrentUserValues}}',
      },
      title: '{{t("Edit profile")}}',
      properties: {
        action: {
          type: 'void',
          properties: {
            submit: {
              title: 'Submit',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                style: {
                  left: '96%',
                },
                useAction: '{{ useSaveCurrentUserValues }}',
              },
            },
          },
        },
        nickname: {
          type: 'string',
          title: "{{t('Nickname')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        username: {
          type: 'string',
          title: '{{t("Username")}}',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': { username: true },
          required: true,
        },
        email: {
          type: 'string',
          title: '{{t("Email")}}',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': 'email',
        },
        phone: {
          type: 'string',
          title: '{{t("Phone")}}',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': 'phone',
        },
      },
    },
  },
};
