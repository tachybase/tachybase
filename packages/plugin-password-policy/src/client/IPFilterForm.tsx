import React from 'react';
import { SchemaComponent, useAPIClient, useRequest } from '@tachybase/client';
import { createForm, ISchema, useForm } from '@tachybase/schema';

import { App, Card } from 'antd';

import { tval, useTranslation } from './locale';

// 获取IP过滤器配置
const useIPFilterValues = () => {
  const api = useAPIClient();
  const { data } = useRequest(() =>
    api
      .resource('ipFilter')
      .get()
      .then((res) => res.data?.data),
  );
  const form = createForm({
    values: data,
  });
  return { form };
};

// 保存IP过滤器配置
const useSaveIPFilterValues = () => {
  const form = useForm();
  const { message } = App.useApp();
  const api = useAPIClient();
  const { t } = useTranslation();
  return {
    async run() {
      await form.submit();
      try {
        await api.request({
          url: 'ipFilter:put',
          method: 'post',
          data: form.values,
        });
        message.success(t('Settings saved successfully'));
      } catch (error) {
        message.error(t('Failed to save settings'));
        throw error;
      }
    },
  };
};

// Schema 定义
const schema: ISchema = {
  type: 'object',
  properties: {
    ipFilter: {
      'x-component': 'FormV2',
      'x-use-component-props': 'useIPFilterValues',
      type: 'void',
      title: tval('IP Filter Settings'),
      properties: {
        allowFirst: {
          type: 'boolean',
          title: tval('Filter Mode'),
          default: true,
          description: tval('Choose how to apply white and black lists'),
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          enum: [
            { label: tval('Allow first (whitelist priority)'), value: true },
            { label: tval('Block first (blacklist priority)'), value: false },
          ],
        },
        allowList: {
          type: 'string',
          title: tval('Allow List (Whitelist)'),
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
          'x-component-props': {
            rows: 6,
            placeholder: '127.0.0.1\n192.168.0.0/16\n10.0.0.0/8',
          },
          description: tval('One IP or CIDR per line. Example: 192.168.1.0/24 or 10.0.0.1'),
        },
        blockList: {
          type: 'string',
          title: tval('Block List (Blacklist)'),
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
          'x-component-props': {
            rows: 6,
            placeholder: '1.2.3.4\n5.6.0.0/16',
          },
          description: tval('One IP or CIDR per line. Example: 1.2.3.4 or 5.6.7.0/24'),
        },
        footer: {
          type: 'void',
          'x-component': 'ActionBar',
          properties: {
            submit: {
              title: tval('Save'),
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                useAction: '{{ useSaveIPFilterValues }}',
              },
            },
          },
        },
      },
    },
  },
};

export const IPFilterForm = () => {
  return (
    <Card bordered={false}>
      <SchemaComponent
        schema={schema}
        scope={{
          useIPFilterValues,
          useSaveIPFilterValues,
        }}
      />
    </Card>
  );
};
