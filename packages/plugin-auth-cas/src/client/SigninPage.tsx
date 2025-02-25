import React, { useEffect } from 'react';
import { useApp } from '@tachybase/client';
import { Authenticator } from '@tachybase/module-auth/client';
import { getSubAppName } from '@tachybase/sdk';

import { LoginOutlined } from '@ant-design/icons';
import { Button, message, Space } from 'antd';
import { useLocation } from 'react-router-dom';

export const SigninPage = (props: { authenticator: Authenticator }) => {
  const authenticator = props.authenticator;
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect');
  const app = useApp();

  const appName = getSubAppName(app.getPublicPath()) || 'main';
  const login = async () => {
    window.location.replace(
      `/api/cas:login?authenticator=${authenticator.name}&__appName=${appName}&redirect=${redirect}`,
    );
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
    <Space direction="vertical" style={{ display: 'flex' }}>
      <Button shape="round" block icon={<LoginOutlined />} onClick={login}>
        {authenticator.title}
      </Button>
    </Space>
  );
};
