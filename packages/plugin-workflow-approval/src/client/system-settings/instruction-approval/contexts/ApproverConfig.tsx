import { createContext, useContext } from 'react';

interface IApproverConfig {
  setFormValueChanged?: (value: boolean) => void;
}

const ContextApproverConfig = createContext<IApproverConfig>({});

export const ProviderContextApproverConfig = ContextApproverConfig.Provider;

export function useContextApproverConfig() {
  return useContext(ContextApproverConfig);
}
