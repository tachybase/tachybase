import { css } from '@nocobase/client';
import { Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';

export const EmbedLayout = () => (
  <Layout style={{ height: '100%' }}>
    <Layout.Content
      className={css`
        display: flex;
        flex-direction: column;
        position: relative;
        overflow-y: auto;
        > div {
          position: relative;
        }
        .ant-layout-footer {
          position: absolute;
          bottom: 0;
          text-align: center;
          width: 100%;
          z-index: 0;
          padding: 0px 50px;
        }
      `}
    >
      <Outlet />
    </Layout.Content>
  </Layout>
);
