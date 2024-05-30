import React, { useContext } from 'react';
import { CollectionProvider_deprecated, ResourceActionContext } from '@tachybase/client';

// import { jsx } from 'react/jsx-runtime';
import { collectionUsers } from '../collections/users.collection';
import { contextK } from '../context/contextK';

export const BeComponent = ({ children }) => {
  const { usersResource } = useContext(contextK);
  const { service } = usersResource || {};

  return (
    <ResourceActionContext.Provider value={{ ...service }}>
      <CollectionProvider_deprecated collection={collectionUsers}>{children}</CollectionProvider_deprecated>
    </ResourceActionContext.Provider>
  );

  // return jsx(ResourceActionContext.Provider, {
  //   value: { ...o },
  //   children: jsx(CollectionProvider_deprecated, { collection: collectionUsers, children: e.children }),
  // });
};
