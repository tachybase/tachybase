import React, { useContext } from 'react';

interface IContextFeatureList {
  dataSources: any[];
}

const ContextFeatureList = React.createContext<IContextFeatureList>({ dataSources: [] });

export const ProviderContextFeatureList = ContextFeatureList.Provider;

export function useContextFeatureList() {
  return useContext(ContextFeatureList);
}
