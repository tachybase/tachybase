import React, { useEffect, useState } from 'react';
import { CollectionProvider_deprecated, ResourceActionContext } from '@tachybase/client';

import { collectionDepartments } from '../main-tab/collections/departments.collection';
import { ProviderContextFilterKeys } from './FilterKeys.context';

export const ProviderRequest = (prop) => {
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
        <ProviderContextFilterKeys value={{ expandedKeys, setExpandedKeys, hasFilter, setHasFilter }}>
          {prop.children}
        </ProviderContextFilterKeys>
      </CollectionProvider_deprecated>
    </ResourceActionContext.Provider>
  );
};
