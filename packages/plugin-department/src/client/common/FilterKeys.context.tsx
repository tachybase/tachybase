import React from 'react';

interface FilterKeysContextProps {
  expandedKeys: any[];
  setExpandedKeys: any;
  hasFilter: any;
  setHasFilter: any;
}

const ContextFilterKeys = React.createContext<Partial<FilterKeysContextProps>>({});

export const ProviderContextFilterKeys = ContextFilterKeys.Provider;

export function useContextFilterKeys() {
  return React.useContext(ContextFilterKeys);
}
