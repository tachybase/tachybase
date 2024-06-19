import React, { useEffect, useState } from 'react';
import { CollectionProvider_deprecated, ResourceActionContext } from '@tachybase/client';

import { collectionDepartments } from '../collections/departments.collection';
import { FilterKeysContext } from '../context/FilterKeysContext';

export const RequestProvider = (prop) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [hasFilter, setHasFilter] = useState(false);
  const { useDataSource } = prop;
  const service = useDataSource({ manual: true });
  useEffect(() => {
    service.run({ filter: { parentId: null }, pageSize: 10 });
  }, []);
  return (
    <ResourceActionContext.Provider value={service}>
      <CollectionProvider_deprecated collection={collectionDepartments}>
        <FilterKeysContext.Provider value={{ expandedKeys, setExpandedKeys, hasFilter, setHasFilter }}>
          {prop.children}
        </FilterKeysContext.Provider>
      </CollectionProvider_deprecated>
    </ResourceActionContext.Provider>
  );
};
