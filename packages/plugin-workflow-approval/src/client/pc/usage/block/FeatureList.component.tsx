import React from 'react';

import { useContextFeatureList } from './FeatureList.context';

export const FeatureList = () => {
  const { dataSources } = useContextFeatureList();
  return <div>FeatureList</div>;
};
