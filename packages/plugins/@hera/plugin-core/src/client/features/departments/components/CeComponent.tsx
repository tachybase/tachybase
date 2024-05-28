import { CollectionProvider_deprecated, ResourceActionContext } from '@tachybase/client';
import React from 'react';
import { collectionDepartments } from '../collections/departments.collection';
import { useContextK } from '../context/contextK';

export const CeComponent = ({ children }) => {
  const context = useContextK();
  const { departmentsResource } = context;
  const { service } = departmentsResource || {};

  return (
    <ResourceActionContext.Provider value={{ ...service }}>
      <CollectionProvider_deprecated collection={collectionDepartments}>{children}</CollectionProvider_deprecated>
    </ResourceActionContext.Provider>
  );
};
