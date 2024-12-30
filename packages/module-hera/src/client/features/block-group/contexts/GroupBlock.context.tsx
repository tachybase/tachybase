import { createContext, useContext } from 'react';

const ContextGroupBlock = createContext<any>({});

export const ProviderContextGroupBlock = ContextGroupBlock.Provider;

export function useContextGroupBlock() {
  return useContext(ContextGroupBlock);
}
