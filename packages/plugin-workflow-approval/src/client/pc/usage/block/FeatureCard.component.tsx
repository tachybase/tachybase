import React from 'react';
import { Icon } from '@tachybase/client';

import { useStyles } from './FeatureCard.style';

export const FeatureCard = (props) => {
  const { data } = props;
  const { title, icon = 'AppstoreOutlined', color = '#e5e5e5' } = data || {};
  const { styles } = useStyles();
  return (
    <div className={styles.featureCard}>
      <div className="icon-wrapper" style={{ backgroundColor: color }}>
        <Icon className="icon" type={icon} style={{ color }} />
      </div>
      <div className="title">{title}</div>
    </div>
  );
};
