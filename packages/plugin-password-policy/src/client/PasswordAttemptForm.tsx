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
        // 0表示不启用
        maxAttempts: {
          type: 'digit',
          title: tval('Max invalid password sign-in attempts'),
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
        },
        // TODO: 优化成后缀可以选择天/时/分/秒
        windowSeconds: {
          type: 'digit',
          title: tval('Max invalid password sign-in attempts interval (seconds)'),
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
        },
        lockSeconds: {
          type: 'digit',
          title: tval('Lockout duration (seconds)'),
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
        },
        strictLock: {
          type: 'boolean',
          title: tval('Can not access any api after locked'),
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
