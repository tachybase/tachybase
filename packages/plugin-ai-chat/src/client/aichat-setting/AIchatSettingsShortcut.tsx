import React from 'react';
import { SchemaComponent, useAPIClient, useRequest } from '@tachybase/client';
import { createForm, ISchema, useForm } from '@tachybase/schema';

import { App, Card } from 'antd';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

const useAISettingsValues = () => {
  const api = useAPIClient();
  const { data } = useRequest(() =>
    api
      .resource('aichat')
      .get()
      .then((res) => res.data?.data),
  );
  const form = createForm({
    values: data,
  });
  return { form };
};

const useSaveAISettingsValues = () => {
  const form = useForm();
  const { message } = App.useApp();
  const api = useAPIClient();
  const { t } = useTranslation();
  return {
    async run() {
      await form.submit();
      const values = cloneDeep(form.values);
      try {
        await api.request({
          url: 'aichat:set',
          method: 'post',
          data: values,
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
    aichatsetting: {
      'x-component': 'FormV2',
      'x-use-component-props': 'useAISettingsValues',
      type: 'void',
      title: '{{t("AIchat settings")}}',
      properties: {
        Model: {
          type: 'string',
          title: "{{t('Model')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: 'deepseek-chat',
        },
        AI_API_KEY: {
          type: 'string',
          title: "{{t('API Key')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        AI_URL: {
          type: 'string',
          title: "{{t('API URL')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: 'https://api.deepseek.com/chat/completions',
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
                useAction: '{{ useSaveAISettingsValues }}',
              },
            },
          },
        },
      },
    },
  },
};

export const AIchatSettingsPane = () => {
  return (
    <Card bordered={false}>
      <SchemaComponent schema={schema} scope={{ useAISettingsValues, useSaveAISettingsValues }} />
    </Card>
  );
};
