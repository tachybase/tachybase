import React, { memo, useEffect } from 'react';

import { App } from 'antd';

import { useAPIClient } from '../../api-client';
import { useApp } from '../../application';

const AppInner = memo(({ children }: { children: React.ReactNode }) => {
  const app = useApp();
  const { notification } = App.useApp();
  const apiClient = useAPIClient();

  useEffect(() => {
    apiClient.notification = notification;
    app.notification = notification;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification]);

  return <>{children}</>;
});
AppInner.displayName = 'AppInner';

const AntdAppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <App
      style={{
        height: '100%',
      }}
    >
      <AppInner>{children}</AppInner>
    </App>
  );
};

AntdAppProvider.displayName = 'AntdAppProvider';

export default AntdAppProvider;
