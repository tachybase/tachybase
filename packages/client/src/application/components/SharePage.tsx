import { useEffect } from 'react';
import { useFieldSchema } from '@tachybase/schema';

import { css } from '@emotion/css';
import { Layout, Result } from 'antd';
import { Navigate, useLocation, useMatch, useNavigate } from 'react-router';
import { Outlet } from 'react-router-dom';

import { useAPIClient } from '../../api-client';
import { AdminProvider } from '../../built-in/admin-layout';

export function useShareToken() {
  const url = new URL(window.location.href);
  const api = useAPIClient();
  const token = url.searchParams.get('token');
  return token && api.auth.setToken(token), api.auth.getToken();
}

export const ShareLayout = () => {
  return (
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
};

export const SharePage = () => {
  const shareToken = useShareToken();

  return !shareToken ? (
    <NotAuthorityResult />
  ) : (
    <AdminProvider>
      <ShareLayout />
    </AdminProvider>
  );
};

export function NotAuthorityResult() {
  const { pathname, search } = useLocation();
  const redirect = `?redirect=${pathname}${search}`;
  return <Navigate replace to={`/signin${redirect}`} />;
}
