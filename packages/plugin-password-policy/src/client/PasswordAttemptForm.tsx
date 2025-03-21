import React from 'react';
import { SchemaComponent, useAPIClient, useRequest } from '@tachybase/client';
import { createForm, ISchema, useForm } from '@tachybase/schema';

import { App, Card } from 'antd';

import { tval, useTranslation } from './locale';

const usePasswordPolicyValues = () => {
  const api = useAPIClient();
  const { data } = useRequest(() =>
    api
      .resource('passwordAttempt')
      .get()
      .then((res) => res.data?.data),
  );
  const form = createForm({
    values: data,
  });
  return { form };
};

const useSavePasswordPolicyValues = () => {
  const form = useForm();
  const { message } = App.useApp();
  const api = useAPIClient();
  const { t } = useTranslation();
  return {
    async run() {
      await form.submit();
      try {
        await api.request({
          url: 'passwordAttempt:put',
          method: 'post',
          data: form.values,
        });
        message.success(t('Saved successfully'));
      } catch (error) {
        message.error(t('Failed to save settings'));
        throw error;
      }
    },
  };
};

const schema: ISchema = {
  type: 'object',
  properties: {
    passwordAttempt: {
      'x-component': 'FormV2',
      'x-use-component-props': 'usePasswordPolicyValues',
      type: 'void',
      title: tval('Password policy'),
      properties: {
        maxAttempts: {
          type: 'digit',
          title: tval('Max invalid password sign-in attempts'),
          description: tval('Default value is 5. Set to 0 to disable.'),
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-validator': {
            required: true,
          },
          'x-component-props': {
            min: 0,
          },
        },
        windowSeconds: {
          type: 'digit',
          title: tval('Max invalid password sign-in attempts interval (seconds)'),
          description: tval('Default value is 300 seconds (5 minutes).'),
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-validator': {
            required: true,
          },
          'x-component-props': {
            min: 1,
          },
        },
        lockSeconds: {
          type: 'digit',
          title: tval('Lockout duration (seconds)'),
          description: tval('Default value is 1800 seconds (30 minutes).'),
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-validator': {
            required: true,
          },
          'x-component-props': {
            min: 1,
          },
        },
        strictLock: {
          type: 'boolean',
          title: tval('Can not access any api after locked'),
          description: tval('Default value is off.'),
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
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

export const PasswordAttemptForm = () => {
  return (
    <Card bordered={false}>
      <SchemaComponent
        schema={schema}
        scope={{
          usePasswordPolicyValues,
          useSavePasswordPolicyValues,
        }}
      />
    </Card>
  );
};
