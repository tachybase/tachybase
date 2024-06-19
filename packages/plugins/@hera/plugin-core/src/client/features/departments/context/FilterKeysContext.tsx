import React from 'react';

export interface FilterKeysContextProps {
  expandedKeys: any[];
  setExpandedKeys: any;
  hasFilter: any;
  setHasFilter: any;
}

export const FilterKeysContext = React.createContext<Partial<FilterKeysContextProps>>({});
