import React, { useContext } from 'react';
import { CollectionProvider_deprecated, ResourceActionContext } from '@tachybase/client';

import { collectionUsers } from '../collections/users.collection';
import { ContextDepartments } from '../context/Department.context';

export const ProviderUserResource = ({ children }) => {
  const { usersResource } = useContext(ContextDepartments);
  const { service } = usersResource || {};

  return (
    <ResourceActionContext.Provider value={{ ...service }}>
      <CollectionProvider_deprecated collection={collectionUsers}>{children}</CollectionProvider_deprecated>
    </ResourceActionContext.Provider>
  );
};
