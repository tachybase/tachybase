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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const api = useAPIClient();
  const { data: schema } = useRequest<{ data: any }>({ url: `/uiSchemas:getJsonSchema/default-admin-menu` });
  const dn = createDesignable({
    t,
    api,
    refresh,
    current: schema?.data,
  });

  // TODO
  const navigatePlugin = () => navigate('/_admin/system-services/plugin-manager');
  const openHomePage = () => window.open('https://tachybase.org', '_blank');

  return (
    <Card
      className={css`
        max-width: 800px;
        margin: 24px auto;
      `}
    >
      <Typography.Title>{t('Welcome to the Tachy Platform!')}</Typography.Title>

      <Typography.Text>
        {t(
          'The Tachy Platform is dedicated to creating a user-friendly application development environment, aiming to lower development barriers, enhance efficiency, and provide enterprise users and developers with one-stop solutions.',
        )}
      </Typography.Text>
      <Flex
        justify="flex-end"
        className={css`
          margin-top: 48px;
        `}
      >
        <Space>
          <Button onClick={openHomePage}>{t('Official Website')}</Button>
          <Button onClick={navigatePlugin}>{t('Plugin Management')}</Button>
          <AddNewButtonComponent />
        </Space>
      </Flex>
    </Card>
  );
};
