import React, { useEffect } from 'react';
import { useCurrentAppInfo, useCurrentUserSettingsMenu } from '@tachybase/client';

import { useTranslation } from 'react-i18next';

const SystemVersion = () => {
  const info = useCurrentAppInfo();
  const { t } = useTranslation();

  return (
    <span>
      {t('App Version')} - {info?.data.version}
    </span>
  );
};

export const SystemVersionProvider = ({ children }) => {
  const { addMenuItem } = useCurrentUserSettingsMenu();

  useEffect(() => {
    addMenuItem(
      {
        key: 'system-version',
        eventKey: 'system-version',
        label: <SystemVersion />,
      },
      { before: 'divider_1' },
    );
  }, [addMenuItem]);

  return <>{children}</>;
};
