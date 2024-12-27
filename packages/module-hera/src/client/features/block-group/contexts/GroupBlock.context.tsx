import { createContext, useContext } from 'react';

export const ContextGroupBlock = createContext<any>({});

export const ProviderContextGroupBlock = ContextGroupBlock.Provider;

export function useContextGroupBlock() {
  return useContext(ContextGroupBlock);
}
