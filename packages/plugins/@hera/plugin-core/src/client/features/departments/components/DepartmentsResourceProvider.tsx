import React from 'react';
import { CollectionProvider_deprecated, ResourceActionContext } from '@tachybase/client';

import { collectionDepartments } from '../collections/departments.collection';
import { useDepartments } from '../context/DepartmentsContext';

export const DepartmentsResourceProvider = ({ children }) => {
  const context = useDepartments();
  const { departmentsResource } = context;
  const { service } = departmentsResource || {};

  return (
    <ResourceActionContext.Provider value={{ ...service }}>
      <CollectionProvider_deprecated collection={collectionDepartments}>{children}</CollectionProvider_deprecated>
    </ResourceActionContext.Provider>
  );
};
