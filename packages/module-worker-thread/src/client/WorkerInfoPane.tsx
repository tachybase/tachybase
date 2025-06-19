import React from 'react';
import { SchemaComponent, useActionContext, useAPIClient, useRequest } from '@tachybase/client';
import { ISchema, useForm } from '@tachybase/schema';

import { App, Card } from 'antd';

import { i18nText, useTranslation } from './locale';

const useRefresh = () => {
  const apiClient = useAPIClient();
  return {
    async run() {
      apiClient.service('workerForm')?.refresh();
    },
  };
};

const useWorkerInfo = (options) => {
  const result = useRequest(
    {
      url: 'worker_thread:info',
    },
    options,
  );
  return result.data;
};

const resetWorkerCount = () => {
  const { setVisible } = useActionContext();
  const form = useForm();
  const { message } = App.useApp();
  const api = useAPIClient();
  const { t } = useTranslation();
  return {
    async run() {
      await form.submit();
      await api.request({
        url: 'worker_thread:preset',
        method: 'post',
        data: {
          count: form.values.preset,
        },
      });
      message.success(t('Saved successfully'));
      setVisible(false);
    },
  };
};

const restartAllForcely = () => {
  const { setVisible } = useActionContext();
  const { message } = App.useApp();
  const api = useAPIClient();
  const { t } = useTranslation();
  return {
    async run() {
      const hide = message.loading(t('Restarting all...'), 0);
      try {
        await api.request({
          url: 'worker_thread:restartAllForcely',
          method: 'post',
          data: {},
        });
        message.success(t('Restart all successfully'));
      } catch (e) {
        message.error(e.message);
      } finally {
        hide();
      }
      setVisible(false);
    },
  };
};

const schema: ISchema = {
  type: 'object',
  properties: {
    workerForm: {
      'x-decorator': 'Form',
      'x-uid': 'workerForm',
      'x-decorator-props': {
        useValues: '{{ useWorkerInfo }}',
      },
      'x-component': 'div',
      type: 'void',
      title: '{{t("Worker thread info")}}',
      properties: {
        preset: {
          type: 'number',
          title: i18nText('Preset count'),
          minimum: 0,
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-component-props': {
            precision: 0,
          },
          required: true,
        },
        current: {
          type: 'digit',
          title: i18nText('Current count'),
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-disabled': true,
        },
        busy: {
          type: 'digit',
          title: i18nText('Busy count'),
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-disabled': true,
        },
        env: {
          type: 'digit',
          title: i18nText('Environment count'),
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-disabled': true,
        },
        max: {
          type: 'digit',
          title: i18nText('Max count'),
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-disabled': true,
        },
        footer1: {
          type: 'void',
          'x-component': 'ActionBar',
          'x-component-props': {
            layout: 'one-column',
          },
          properties: {
            submit: {
              title: i18nText('Submit'),
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                htmlType: 'submit',
                useAction: '{{ resetWorkerCount }}',
              },
            },
            refresh: {
              title: i18nText('Refresh'),
              'x-component': 'Action',
              'x-component-props': {
                type: 'default',
                useAction: '{{ useRefresh }}',
              },
            },
            restartAllForcely: {
              title: i18nText('Restart all forcely'),
              // 改为confirm按钮
              'x-component': 'Action',
              'x-component-props': {
                type: 'default',
                useAction: restartAllForcely,
                confirm: {
                  title: i18nText('Restart all forcely'),
                  content: i18nText(
                    'Are you sure you want to restart all worker threads? All worker threads that are currently processing main thread tasks will be immediately terminated',
                  ),
                },
              },
            },
          },
        },
        // 添加说明文本
        helpText1: {
          type: 'void',
          'x-component': 'div',
          'x-component-props': {
            style: {
              color: 'grey',
              fontSize: '12px',
              marginTop: '10px',
            },
          },
          'x-content': i18nText(
            'If the current preset count is less than the number of worker threads, it will wait for the worker threads to be idle before exiting',
          ),
        },
        // 添加说明文本
        helpText2: {
          type: 'void',
          'x-component': 'div',
          'x-component-props': {
            style: {
              color: 'red',
              fontSize: '12px',
              marginTop: '10px',
            },
          },
          'x-content': i18nText(
            'The modification will not be refreshed immediately, please wait patiently for about 10 seconds, or click the refresh button to view the latest data',
          ),
        },
      },
    },
  },
};

export const WorkerInfoPane = () => {
  return (
    <Card bordered={false}>
      <SchemaComponent scope={{ resetWorkerCount, useWorkerInfo, useRefresh }} schema={schema} />
    </Card>
  );
};
