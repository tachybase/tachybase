import React from 'react';
import { CollectionProvider_deprecated, ResourceActionContext } from '@tachybase/client';

import { collectionDepartments } from '../collections/departments.collection';
import { useContextDepartments } from '../context/Department.context';

export const ProviderDepartmentsResource = ({ children }) => {
  const context = useContextDepartments();
  const { departmentsResource } = context;
  const { service } = departmentsResource || {};

  return (
    <ResourceActionContext.Provider value={{ ...service }}>
      <CollectionProvider_deprecated collection={collectionDepartments}>{children}</CollectionProvider_deprecated>
    </ResourceActionContext.Provider>
  );
};
