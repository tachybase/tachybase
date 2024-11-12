// --4.1 直接插入缓存
import React, { useEffect, useState } from 'react';
import { SchemaComponent, useAPIClient, useApp } from '@tachybase/client';

import { CopyOutlined, LoginOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Spin, Typography } from 'antd';
import { useLocation } from 'react-router-dom';

import { useTranslation } from './locale';

export const AdminSettingsForm = () => {
  const { t } = useTranslation();
  const app = useApp();
  const redirectUrl = 'https://lu.dev.daoyoucloud.com/api/wechat@handleOAuthCallback'; // 设置回调url

  const onCopy = (text) => {
    navigator.clipboard.writeText(text);
    message.success(t('Copied'));
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
            wechat: {
              type: 'object',
              properties: {
                appId: {
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  type: 'string',
                  required: true,
                  title: '{{t("WeChat AppID")}}',
                },
                appSecret: {
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  type: 'string',
                  required: true,
                  title: '{{t("WeChat AppSecret")}}',
                },
              },
            },
          },
        }}
      />
      <div>
        <Typography.Title level={5} style={{ fontSize: '14px' }}>
          {t('Redirect URL')}:
        </Typography.Title>
        <Input value={redirectUrl} disabled addonBefore={<CopyOutlined onClick={() => onCopy(redirectUrl)} />} />
      </div>
    </div>
  );
};

export const SignInButton = ({ authenticator }) => {
  const [href, setHref] = useState();
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const api = useAPIClient();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const redirect = urlSearchParams.get('redirect');

  useEffect(() => {
    if (href) window.location.href = href;
  }, [href]);

  useEffect(() => {
    const authenticatorName = urlSearchParams.get('authenticator');
    const error = urlSearchParams.get('error');
    if (authenticatorName === authenticator.name && error) {
      message.error(t(error));
    }
  }, [authenticator.name, t, urlSearchParams]);

  const onClick = async () => {
    setLoading(true);
    try {
      const { data } = await api.request({
        method: 'post',
        url: 'https://lu.dev.daoyoucloud.com/api/wechat@generateQrCode', // 生成二维码
        headers: { 'X-Authenticator': authenticator.name },
        data: { redirect },
      });

      console.log('data.data.data.url:', data.data.data.url);

      const url = data.data.data.url;
      if (url) {
        setQrCodeUrl(url);
        setQrCodeVisible(true);
      } else {
        console.error('未能生成二维码URL');
      }
    } catch (error) {
      message.error(t('Failed to generate QR code'));
      console.error('二维码生成失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 显示二维码
  return (
    <>
      <Button block icon={<LoginOutlined />} shape="round" onClick={onClick} loading={loading}>
        {authenticator.title || 'WeChat 公众号登录'}
      </Button>
      <Modal
        title="Scan QR Code to Login"
        style={{ textAlign: 'center' }}
        visible={qrCodeVisible}
        footer={null}
        onCancel={() => setQrCodeVisible(false)}
      >
        {loading ? <Spin /> : <img src={qrCodeUrl} alt="QR Code" style={{ width: '100%' }} />}
      </Modal>
    </>
  );
};
