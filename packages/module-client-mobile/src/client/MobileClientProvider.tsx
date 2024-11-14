import React, { PropsWithChildren, useEffect } from 'react';
import { MobileProvider } from '@tachybase/client';

import { useLocation, useNavigate } from 'react-router-dom';

import { isJSBridge } from './core/bridge';

export const MobileClientProvider = React.memo((props: PropsWithChildren) => {
  const location = useLocation();
  const navigation = useNavigate();

  useEffect(() => {
    if (isJSBridge() && location.pathname === '/admin') {
      navigation('/mobile', { replace: true });
    }
  }, [location.pathname, navigation]);

  return <MobileProvider>{props.children}</MobileProvider>;
});
MobileClientProvider.displayName = 'MobileClientProvider';
