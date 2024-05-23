import React, { useEffect } from 'react';
import { css, useAPIClient } from '@tachybase/client';
import { Authenticator } from '@tachybase/plugin-auth/client';

import { LoginOutlined } from '@ant-design/icons';
import { Button, message, Space } from 'antd';
import { useLocation } from 'react-router-dom';

import { useSamlTranslation } from './locale';

export const SAMLButton = ({ authenticator }: { authenticator: Authenticator }) => {
  const { t } = useSamlTranslation();
  const api = useAPIClient();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect');

  const login = async () => {
    const response = await api.request({
      method: 'post',
      url: 'saml:getAuthUrl',
      headers: {
        'X-Authenticator': authenticator.name,
      },
      data: {
        redirect,
      },
    });

    const authUrl = response?.data?.data;
    window.location.replace(authUrl);
  };

  useEffect(() => {
    const name = params.get('authenticator');
    const error = params.get('error');
    if (name !== authenticator.name) {
      return;
    }
    if (error) {
      message.error(error);
      return;
    }
  });

  return (
    <Space
      direction="vertical"
      className={css`
        display: flex;
      `}
    >
      <Button shape="round" block icon={<LoginOutlined />} onClick={login}>
        {t(authenticator.title)}
      </Button>
    </Space>
  );
};
