import React, { createContext, useContext, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { useAPIClient, useRequest } from '../api-client';

export interface CollectionHistoryContextValue {
  historyCollections: any[];
  refreshCH: () => Promise<any>;
}

const CollectionHistoryContext = createContext<CollectionHistoryContextValue>({
  historyCollections: [],
  refreshCH: () => undefined,
});
CollectionHistoryContext.displayName = 'CollectionHistoryContext';

export const CollectionHistoryProvider = (props) => {
  const api = useAPIClient();

  const options = {
    resource: 'collectionsHistory',
    action: 'list',
    params: {
      paginate: false,
      appends: ['fields'],
      filter: {
        // inherit: false,
      },
      sort: ['sort'],
    },
  };

  const location = useLocation();

  const service = useRequest<{
    data: any;
  }>(options, {
    manual: true,
  });

  const isAdminPage = location.pathname.startsWith('/admin');
  const token = api.auth.getToken() || '';

  useEffect(() => {
    if (isAdminPage && token) {
      service.run();
    }
  }, [isAdminPage, token]);

  // 刷新 collecionHistory
  const refreshCH = async () => {
    const { data } = await api.request(options);
    service.mutate(data);
    return data?.data || [];
  };

  if (service.loading) {
    return;
  }

  return (
    <CollectionHistoryContext.Provider
      value={{
        historyCollections: service.data?.data,
        refreshCH,
      }}
    >
      {props.children}
    </CollectionHistoryContext.Provider>
  );
};

export const useHistoryCollectionsByNames = (collectionNames: string[]) => {
  const { historyCollections } = useContext(CollectionHistoryContext);
  return historyCollections.filter((i) => collectionNames.includes(i.name));
};

export const useCollectionHistory = () => {
  return useContext(CollectionHistoryContext);
};
