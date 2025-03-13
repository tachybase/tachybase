import React from 'react';
import { SchemaComponent, useAPIClient, useRequest } from '@tachybase/client';
import { createForm, ISchema, useForm } from '@tachybase/schema';

import { App, Card } from 'antd';

import { tval, useTranslation } from './locale';

const usePasswordStrengthValues = () => {
  const api = useAPIClient();
  const { data } = useRequest(() =>
    api
      .resource('passwordStrengthConfig')
      .list({
        pageSize: 1,
      })
      .then(
        (res) =>
          res.data?.[0] || {
            minLength: 8,
            strengthLevel: 0,
            notContainUsername: false,
            historyCount: 0,
          },
      ),
  );
  const form = createForm({
    values: data,
  });
  return { form };
};

const useSavePasswordStrengthValues = () => {
  const form = useForm();
  const { message } = App.useApp();
  const api = useAPIClient();
  const { t } = useTranslation();
  return {
    async run() {
      await form.submit();
      try {
        const values = form.values;
        const { data } = await api.resource('passwordStrengthConfig').list({
          pageSize: 1,
        });

        if (data.length > 0) {
          // 更新现有配置
          await api.resource('passwordStrengthConfig').update({
            filterByTk: data[0].id,
            values,
          });
        } else {
          // 创建新配置
          await api.resource('passwordStrengthConfig').create({
            values,
          });
        }
        message.success(t('Password strength settings saved successfully'));
      } catch (error) {
        message.error(t('Failed to save password strength settings'));
        throw error;
      }
    },
  };
};

const schema: ISchema = {
  type: 'object',
  properties: {
    passwordStrength: {
      'x-component': 'FormV2',
      'x-use-component-props': 'usePasswordStrengthValues',
      type: 'void',
      title: tval('Password Strength Settings'),
      properties: {
        minLength: {
          type: 'number',
          title: tval('Minimum Password Length'),
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-component-props': {
            min: 6,
            max: 32,
          },
          default: 8,
          required: true,
        },
        strengthLevel: {
          type: 'number',
          title: tval('Password Strength Requirements'),
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          enum: [
            {
              label: tval('No restrictions'),
              value: 0,
            },
            {
              label: tval('Must contain letters and numbers'),
              value: 1,
            },
            {
              label: tval('Must contain letters, numbers, and symbols'),
              value: 2,
            },
            {
              label: tval('Must contain numbers, uppercase and lowercase letters'),
              value: 3,
            },
            {
              label: tval('Must contain numbers, uppercase and lowercase letters, and symbols'),
              value: 4,
            },
            {
              label: tval(
                'Must contain at least 3 of the following: numbers, uppercase letters, lowercase letters, and symbols',
              ),
              value: 5,
            },
          ],
          default: 0,
          required: true,
        },
        notContainUsername: {
          type: 'boolean',
          title: tval('Password cannot contain username'),
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
          default: false,
        },
        historyCount: {
          type: 'number',
          title: tval('Remember password history (0-24)'),
          description: tval('Number of previous passwords to remember. 0 means no restriction.'),
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-component-props': {
            min: 0,
            max: 24,
          },
          default: 0,
          required: true,
        },
        footer: {
          type: 'void',
          'x-component': 'ActionBar',
          properties: {
            submit: {
              title: '{{t("Save")}}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                useAction: '{{ useSavePasswordStrengthValues }}',
              },
            },
          },
        },
      },
    },
  },
};

export default () => {
  return (
    <Card bordered={false}>
      <SchemaComponent
        schema={schema}
        scope={{
          usePasswordStrengthValues,
          useSavePasswordStrengthValues,
        }}
      />
    </Card>
  );
};
