import React, { createContext, ReactNode, useContext } from 'react';

import { Result } from 'ahooks/es/useRequest/src/types';

import { useRequest } from '../../api-client';

export const SystemSettingsContext = createContext<Result<any, any>>(null);
SystemSettingsContext.displayName = 'SystemSettingsContext';

export const useSystemSettings = () => {
  return useContext(SystemSettingsContext);
};

export const SystemSettingsProvider: React.FC<{ children?: ReactNode }> = (props) => {
  const result = useRequest({
    url: 'systemSettings:get/1?appends=logo,appEntries',
  });
  if (result.loading) {
    return;
  }

  return <SystemSettingsContext.Provider value={result}>{props.children}</SystemSettingsContext.Provider>;
};
