import React from 'react';

import { css } from '@emotion/css';
import { Button, Card, Flex, Space, Typography } from 'antd';
import { Outlet, useMatch, useParams } from 'react-router';

import { PageTab } from '../page-style/PageTab';
import { usePageStyle } from '../page-style/usePageStyle';

const WelcomeCard = () => {
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
          <Button>使用手册</Button>
          <Button>插件管理</Button>
          <Button type="primary">新增入口</Button>
        </Space>
      </Flex>
    </Card>
  );
};

export const AdminContent = () => {
  const isMatchAdmin = useMatch('/admin');
  const params = useParams<any>();
  const pageStyle = usePageStyle();
  if (isMatchAdmin) {
    return <WelcomeCard />;
  } else {
    return params.name && pageStyle === 'tab' ? <PageTab /> : <Outlet />;
  }
};
