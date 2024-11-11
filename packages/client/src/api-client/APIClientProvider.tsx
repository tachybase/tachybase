import React, { ReactNode } from 'react';

import { APIClient } from './APIClient';
import { APIClientContext } from './context';

export interface APIClientProviderProps {
  apiClient: APIClient;
  children?: ReactNode;
}

export const APIClientProvider = (props: APIClientProviderProps) => {
  const { apiClient, children } = props;
  return <APIClientContext.Provider value={apiClient}>{children}</APIClientContext.Provider>;
};
