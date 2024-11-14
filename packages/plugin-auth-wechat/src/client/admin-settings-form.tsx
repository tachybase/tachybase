import React from 'react';
import { SchemaComponent, useApp } from '@tachybase/client';

import { CopyOutlined } from '@ant-design/icons';
import { Input, message, Typography } from 'antd';

import { useTranslation } from '../locale';

export const AdminSettingsForm = () => {
  const { t } = useTranslation();
  const app = useApp();
  const redirectUrl = React.useMemo(() => app.getApiUrl('wechatAuth:redirect'), [app]);
  const onCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success(t('Copied'));
      })
      .catch(() => {
        message.error(t('Failed to copy'));
      });
  };
  return (
    <div>
      <SchemaComponent
        scope={{ t }}
        schema={{
          type: 'object',
          properties: {
            public: {
              type: 'object',
              properties: {
                autoSignUp: {
                  'x-decorator': 'FormItem',
                  type: 'boolean',
                  title: '{{t("Sign up automatically when the user does not exist")}}',
                  'x-component': 'Checkbox',
                  default: false,
                },
                configBind: {
                  'x-decorator': 'FormItem',
                  type: 'boolean',
                  title: '{{t("User can bind or unbind the sign in type")}}',
                  'x-component': 'Checkbox',
                  default: false,
                },
              },
            },
            wechatAuth: {
              type: 'object',
              properties: {
                AppID: {
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  type: 'string',
                  required: true,
                  title: 'AppID',
                },
                AppSecret: {
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  type: 'string',
                  required: true,
                  title: 'AppSecret',
                },
              },
            },
          },
        }}
      />
      <div>
        <Typography.Title level={5} style={{ fontSize: '14px' }}>
          {t('Redirect URL')}
          <span style={{ marginLeft: '2px' }}>:</span>
        </Typography.Title>
        <Input value={redirectUrl} disabled={true} addonBefore={<CopyOutlined onClick={() => onCopy(redirectUrl)} />} />
      </div>
    </div>
  );
};
