import React from 'react';
import { SchemaComponent, useAPIClient, useRequest } from '@tachybase/client';
import { createForm, ISchema, useForm } from '@tachybase/schema';

import { App, Card } from 'antd';

import { PasswordStrengthLevel } from '../constants';
import { tval, useTranslation } from './locale';

const usePasswordStrengthValues = () => {
  const api = useAPIClient();
  const { data } = useRequest(() =>
    api
      .resource('passwordStrengthConfig')
      .get()
      .then((res) => res.data?.data),
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
        await api.request({
          url: 'passwordStrengthConfig:put',
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
          // 'x-component-props': {
          //   min: 6,
          //   max: 32,
          // },
          default: 0,
        },
        strengthLevel: {
          type: 'number',
          title: tval('Password Strength Requirements'),
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          enum: [
            {
              label: tval('No restrictions'),
              value: PasswordStrengthLevel.None,
            },
            {
              label: tval('Must contain letters and numbers'),
              value: PasswordStrengthLevel.NumberAndLetter,
            },
            {
              label: tval('Must contain letters, numbers, and symbols'),
              value: PasswordStrengthLevel.NumberAndLetterAndSymbol,
            },
            {
              label: tval('Must contain numbers, uppercase and lowercase letters'),
              value: PasswordStrengthLevel.NumberAndLetterAndUpperAndLower,
            },
            {
              label: tval('Must contain numbers, uppercase and lowercase letters, and symbols'),
              value: PasswordStrengthLevel.NumberAndLetterAndUpperAndLowerAndSymbol,
            },
            {
              label: tval(
                'Must contain at least 3 of the following: numbers, uppercase letters, lowercase letters, and symbols',
              ),
              value: PasswordStrengthLevel.NumberAndLetterAndUpperAndLowerAndSymbol3,
            },
          ],
          default: 0,
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
