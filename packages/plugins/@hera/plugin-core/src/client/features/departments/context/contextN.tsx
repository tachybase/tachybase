import React, { useContext } from 'react';

export const contextN = React.createContext<any>({});

export const ContextNProvider = contextN.Provider;

export function useContextN() {
  return useContext(contextN);
}
