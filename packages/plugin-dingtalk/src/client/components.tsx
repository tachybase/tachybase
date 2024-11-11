import React, { useEffect } from 'react';
import { SchemaComponent, useAPIClient, useApp } from '@tachybase/client';

import { CopyOutlined, LoginOutlined } from '@ant-design/icons';
import { Button, Input, message, Typography } from 'antd';
import { useLocation } from 'react-router-dom';

import { useTranslation } from './locale';

export const AdminSettingsForm = () => {
  const { t } = useTranslation();
  const app = useApp();
  const redirectUrl = React.useMemo(() => app.getApiUrl('dingtalk:redirect'), [app]);
  const onCopy = (text) => {
    navigator.clipboard.writeText(text), message.success(t('Copied'));
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
                autoSignup: {
                  'x-decorator': 'FormItem',
                  type: 'boolean',
                  title: '{{t("Sign up automatically when the user does not exist")}}',
                  'x-component': 'Checkbox',
                  default: true,
                },
              },
            },
            dingtalk: {
              type: 'object',
              properties: {
                clientId: {
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  type: 'string',
                  required: true,
                  title: '{{t("Client ID")}}',
                },
                clientSecret: {
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  type: 'string',
                  required: true,
                  title: '{{t("Client Secret")}}',
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

export const SignInButton = ({ authenticator }) => {
  const [href, setHref] = React.useState();
  const { t } = useTranslation();
  const api = useAPIClient();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const redirect = urlSearchParams.get('redirect');
  useEffect(() => {
    href && (window.location.href = href);
  }, [href]);
  useEffect(() => {
    const authenticatorName = urlSearchParams.get('authenticator');
    const error = urlSearchParams.get('error');
    if (authenticatorName === authenticator.name && error) {
      message.error(t(error));
      return;
    }
  });
  const onClick = async () => {
    const result = await api.request({
      method: 'post',
      url: 'dingtalk:getAuthUrl',
      headers: { 'X-Authenticator': authenticator.name },
      data: { redirect: redirect },
    });
    const url = result?.data?.data?.url;
    if (url) {
      setHref(url);
    }
  };
  return (
    <Button block icon={<LoginOutlined />} shape="round" onClick={onClick}>
      {authenticator.title ? t(authenticator.title) : t('Sign in via DingTalk')}
    </Button>
  );
};
