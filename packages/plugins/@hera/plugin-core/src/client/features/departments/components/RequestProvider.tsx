import React, { useEffect, useState } from 'react';
import { CollectionProvider_deprecated, ResourceActionContext } from '@tachybase/client';

import { collectionDepartments } from '../collections/departments.collection';
import { ContextR } from './ContextR';

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
        <ContextR.Provider value={{ expandedKeys, setExpandedKeys, hasFilter, setHasFilter }}>
          {prop.children}
        </ContextR.Provider>
      </CollectionProvider_deprecated>
    </ResourceActionContext.Provider>
  );
};
