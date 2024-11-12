import React, { useEffect } from 'react';
import { useCurrentUserSettingsMenu } from '@tachybase/client';

import { usePluginVersion } from '../../hooks/usePluginVersion';

const useHeraVersion = () => {
  const version = usePluginVersion();
  return {
    key: 'hera-version',
    eventKey: 'hera-version',
    label: <span>赫拉系统 - {version}</span>,
  };
};

export const HeraVersionProvider = ({ children }) => {
  const { addMenuItem } = useCurrentUserSettingsMenu();
  const heraVersion = useHeraVersion();
  useEffect(() => {
    addMenuItem(heraVersion, { before: 'divider_1' });
  }, [addMenuItem, heraVersion]);

  return <>{children}</>;
};
