import React from 'react';
import { useRequest } from '@tachybase/client';

import { ProviderContextFeatureList } from './FeatureList.context';

export const ProviderFeatureList = (props) => {
  const { collection, action, params, children } = props;
  const { loading, data } = useRequest({
    resource: collection,
    action: action,
    params: params,
  });

  const dataSources = data?.data || [];
  if (loading) {
    return null;
  }
  return (
    <ProviderContextFeatureList
      value={{
        dataSources,
      }}
    >
      {children}
    </ProviderContextFeatureList>
  );
};
