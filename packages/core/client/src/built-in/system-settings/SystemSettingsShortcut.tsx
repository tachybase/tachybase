import React from 'react';
import { ISchema, uid, useForm } from '@tachybase/schema';

import { App, Card } from 'antd';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useSystemSettings } from '.';
import { i18n, useAPIClient, useRequest } from '../..';
import locale from '../../locale';
import { SchemaComponent, useActionContext } from '../../schema-component';

const langs = Object.keys(locale).map((lang) => {
  return {
    label: `${locale[lang].label} (${lang})`,
    value: lang,
  };
});

const useCloseAction = () => {
  const { setVisible } = useActionContext();
  return {
    async run() {
      setVisible(false);
    },
  };
};

const useSystemSettingsValues = (options) => {
  const { visible } = useActionContext();
  const result = useSystemSettings();
  return useRequest(() => Promise.resolve(result.data), {
    ...options,
    refreshDeps: [visible],
  });
};

const useSaveSystemSettingsValues = () => {
  const { setVisible } = useActionContext();
  const form = useForm();
  const { message } = App.useApp();
  const { mutate, data } = useSystemSettings();
  const api = useAPIClient();
  const { t } = useTranslation();
  return {
    async run() {
      await form.submit();
      const values = cloneDeep(form.values);
      mutate({
        data: {
          ...data?.data,
          ...values,
        },
      });
      await api.request({
        url: 'systemSettings:update/1',
        method: 'post',
        data: values,
      });
      message.success(t('Saved successfully'));
      const lang = values.enabledLanguages?.[0] || 'en-US';
      if (values.enabledLanguages.length < 2 && api.auth.getLocale() !== lang) {
        api.auth.setLocale('');
        window.location.reload();
      } else {
        setVisible(false);
      }
    },
  };
};

const schema: ISchema = {
  type: 'object',
  properties: {
    [uid()]: {
      'x-decorator': 'Form',
      'x-decorator-props': {
        useValues: '{{ useSystemSettingsValues }}',
      },
      'x-component': 'div',
      type: 'void',
      title: '{{t("System settings")}}',
      properties: {
        title: {
          type: 'string',
          title: "{{t('System title')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          required: true,
        },
        logo: {
          type: 'string',
          title: "{{t('Logo')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Upload.Attachment',
          'x-component-props': {
            action: 'attachments:create',
            multiple: false,
            // accept: 'jpg,png'
          },
        },
        enabledLanguages: {
          type: 'array',
          title: '{{t("Enabled languages")}}',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          'x-decorator': 'FormItem',
          enum: langs,
          'x-reactions': (field) => {
            field.dataSource = langs.map((item) => {
              let label = item.label;
              if (field.value?.[0] === item.value) {
                label += `(${i18n.t('Default')})`;
              }
              return {
                label,
                value: item.value,
              };
            });
          },
        },
        footer1: {
          type: 'void',
          'x-component': 'ActionBar',
          'x-component-props': {
            layout: 'one-column',
          },
          properties: {
            submit: {
              title: '{{t("Submit")}}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                htmlType: 'submit',
                useAction: '{{ useSaveSystemSettingsValues }}',
              },
            },
          },
        },
      },
    },
  },
};

export const SystemSettingsPane = () => {
  return (
    <Card bordered={false}>
      <SchemaComponent
        scope={{ useSaveSystemSettingsValues, useSystemSettingsValues, useCloseAction }}
        schema={schema}
      />
    </Card>
  );
};
