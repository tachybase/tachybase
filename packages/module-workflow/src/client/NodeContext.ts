import React, { useContext } from 'react';

const ContextNode = React.createContext<any>({});

export const ProviderContext = ContextNode.Provider;

export function useContextNode() {
  return useContext(ContextNode);
}
