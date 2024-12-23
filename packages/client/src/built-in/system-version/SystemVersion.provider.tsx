import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { useCurrentAppInfo } from '../../common/appInfo/CurrentAppInfoProvider';
import { useCurrentUserSettingsMenu } from '../../user/CurrentUserSettingsMenuProvider';

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
        label: <SystemVersion />,
      },
      { before: 'divider_1' },
    );
  }, [addMenuItem]);

  return <>{children}</>;
};
