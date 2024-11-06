import React from 'react';

import { css } from '@emotion/css';
import { Button, Card, Flex, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAPIClient, useRequest } from '../../../api-client';
import { createDesignable, useDesignable } from '../../../schema-component';
import { AddNewButtonComponent } from './AddNewButton';

export const WelcomeCard = () => {
  const { refresh } = useDesignable();
  const t = useTranslation();
  const navigate = useNavigate();
  const api = useAPIClient();
  const { data: schema } = useRequest<{ data: any }>({ url: `/uiSchemas:getJsonSchema/default-admin-menu` });
  const dn = createDesignable({
    t,
    api,
    refresh,
    current: schema?.data,
  });

  const navigatePlugin = () => navigate('/admin/settings/plugin-manager');
  const openHomePage = () => window.open('https://tachybase.com', '_blank');

  return (
    <Card
      className={css`
        max-width: 800px;
        margin: 24px auto;
      `}
    >
      <Typography.Title>欢迎来到塔奇平台</Typography.Title>

      <Typography.Text>
        塔奇平台致力于打造一个用户友好的应用研发平台，旨在降低开发门槛，提升研发效率，为企业用户和开发者提供一站式解决方案。
      </Typography.Text>
      <Flex
        justify="flex-end"
        className={css`
          margin-top: 48px;
        `}
      >
        <Space>
          <Button onClick={openHomePage}>使用手册</Button>
          <Button onClick={navigatePlugin}>插件管理</Button>
          <AddNewButtonComponent />
        </Space>
      </Flex>
    </Card>
  );
};
