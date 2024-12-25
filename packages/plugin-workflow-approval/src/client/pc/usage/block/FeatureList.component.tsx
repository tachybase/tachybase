import React from 'react';
import { useTableBlockContext } from '@tachybase/client';

import { FeatureCard } from './FeatureCard.component';
import { useStyles } from './FeatureList.style';

export const FeatureList = () => {
  const { styles } = useStyles();
  const { service } = useTableBlockContext();
  const { loading, data } = service;
  const dataSources = data?.data ?? [];

  if (loading) {
    return null;
  }

  return (
    <div className={styles.featureList}>
      {dataSources.map((item, index) => (
        <FeatureCard key={index} data={item} />
      ))}
    </div>
  );
};
