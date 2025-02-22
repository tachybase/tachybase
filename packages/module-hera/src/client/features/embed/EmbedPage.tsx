import React, { useEffect } from 'react';
import { AdminProvider } from '@tachybase/client';

import { useLocation, useMatch, useNavigate } from 'react-router-dom';

import { EmbedLayout } from './EmbedLayout';
import { NotAuthorityResult } from './NotAuthorityResult';
import { useEmbedToken } from './useEmbedToken';

export const EmbedPage = () => {
  const embedToken = useEmbedToken();
  const navigate = useNavigate();
  const location = useLocation();
  const match = useMatch('/embed/:name');
  // FIXME
  useEffect(
    () => () => {
      setTimeout(() => {
        match &&
          setTimeout(() => {
            window.location.pathname !== location.pathname && navigate('/embed/not-authorized');
          });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return !embedToken || location.pathname === '/embed/not-authorized' ? (
    <NotAuthorityResult />
  ) : (
    <AdminProvider>
      <EmbedLayout />
    </AdminProvider>
  );
};
