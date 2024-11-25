import React, { useContext } from 'react';

const ContextNode = React.createContext<any>({});

export const ProviderContextNode = ContextNode.Provider;

export function useContextNode() {
  return useContext(ContextNode);
}
