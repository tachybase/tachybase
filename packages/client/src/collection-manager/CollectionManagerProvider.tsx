import React from 'react';

import { useAPIClient, useRequest } from '../api-client';
import { CollectionManagerProvider } from '../data-source/collection/CollectionManagerProvider';
import { useDataSourceManager } from '../data-source/data-source/DataSourceManagerProvider';
import { useCollectionHistory } from './CollectionHistoryProvider';
import { CollectionManagerSchemaComponentProvider } from './CollectionManagerSchemaComponentProvider';
import { CollectionCategoriesContext } from './context';
import { CollectionManagerOptions } from './types';

/**
 * @deprecated use `CollectionManagerProvider` instead
 */
export const CollectionManagerProvider_deprecated: React.FC<CollectionManagerOptions> = (props) => {
  return (
    <CollectionManagerProvider>
      <CollectionManagerSchemaComponentProvider>{props.children}</CollectionManagerSchemaComponentProvider>
    </CollectionManagerProvider>
  );
};

export const RemoteCollectionManagerProvider = (props: any) => {
  const api = useAPIClient();
  const dm = useDataSourceManager();
  const { refreshCH } = useCollectionHistory();

  const coptions = {
    url: 'collectionCategories:list',
    params: {
      paginate: false,
      sort: ['sort'],
    },
  };
  const service = useRequest<{
    data: any;
  }>(() => {
    return dm.reload().then(refreshCH);
  });
  const result = useRequest<{
    data: any;
  }>(coptions);

  if (service.loading) {
    return;
  }

  const refreshCategory = async () => {
    const { data } = await api.request(coptions);
    result.mutate(data);
    return data?.data || [];
  };
  return (
    <CollectionCategroriesProvider service={{ ...result }} refreshCategory={refreshCategory}>
      <CollectionManagerProvider_deprecated {...props}></CollectionManagerProvider_deprecated>
    </CollectionCategroriesProvider>
  );
};

export const CollectionCategroriesProvider = (props) => {
  const { service, refreshCategory } = props;
  return (
    <CollectionCategoriesContext.Provider
      value={{
        data: service?.data?.data,
        refresh: refreshCategory,
        ...props,
      }}
    >
      {props.children}
    </CollectionCategoriesContext.Provider>
  );
};
