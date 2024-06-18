import React, { useContext } from 'react';
import { CollectionProvider_deprecated, ResourceActionContext } from '@tachybase/client';

import { collectionUsers } from '../collections/users.collection';
import { DepartmentsContext } from '../context/DepartmentsContext';

export const UserResourceProvider = ({ children }) => {
  const { usersResource } = useContext(DepartmentsContext);
  const { service } = usersResource || {};

  return (
    <ResourceActionContext.Provider value={{ ...service }}>
      <CollectionProvider_deprecated collection={collectionUsers}>{children}</CollectionProvider_deprecated>
    </ResourceActionContext.Provider>
  );
};
