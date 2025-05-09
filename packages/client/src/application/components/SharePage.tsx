import { useEffect } from 'react';
import { useFieldSchema } from '@tachybase/schema';

import { css } from '@emotion/css';
import { Layout, Result } from 'antd';
import { useLocation, useMatch, useNavigate } from 'react-router';
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
  const fieldSchema = useFieldSchema();
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
  const navigate = useNavigate();
  const location = useLocation();
  const match = useMatch('/share/:name');
  // FIXME
  useEffect(
    () => () => {
      setTimeout(() => {
        match &&
          setTimeout(() => {
            window.location.pathname !== location.pathname && navigate('/share/not-authorized');
          });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return !shareToken || location.pathname === '/share/not-authorized' ? (
    <NotAuthorityResult />
  ) : (
    <AdminProvider>
      <ShareLayout />
    </AdminProvider>
  );
};

export function NotAuthorityResult() {
  return <Result status="403" title="403" subTitle="Sorry, you are not authorized to access this page." />;
}
