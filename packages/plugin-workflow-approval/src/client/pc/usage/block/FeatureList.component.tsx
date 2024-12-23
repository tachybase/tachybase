import React from 'react';

import { FeatureCard } from './FeatureCard.component';
import { useContextFeatureList } from './FeatureList.context';
import { useStyles } from './FeatureList.style';

export const FeatureList = () => {
  const { dataSources } = useContextFeatureList();
  const { styles } = useStyles();

  return (
    <div className={styles.featureList}>
      {dataSources.map((item, index) => (
        <FeatureCard key={index} data={item} />
      ))}
    </div>
  );
};
