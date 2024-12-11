import React from 'react';
import { css, usePlugin } from '@tachybase/client';

import ModuleWeb from '..';
import { InterfaceProvider } from './InterfaceProvider';

export const InterfaceRouter = React.memo(() => {
  const plugin = usePlugin(ModuleWeb);
  const MobileRouter = plugin.getMobileRouterComponent();

  return (
    <InterfaceProvider>
      <div
        className={css`
          display: flex;
          width: 100%;
          height: 100%;
          position: relative;
        `}
      >
        <MobileRouter />
      </div>
    </InterfaceProvider>
  );
});
InterfaceRouter.displayName = 'InterfaceRouter';
