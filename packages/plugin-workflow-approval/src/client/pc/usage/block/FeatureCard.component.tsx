import React from 'react';
import { Icon } from '@tachybase/client';

import { useStyles } from './FeatureCard.style';

export const FeatureCard = (props) => {
  const { data } = props;
  const { title, icon, color } = data || {};
  const { styles } = useStyles();
  return (
    <div className={styles.featureCard}>
      <div className="icon-wrapper" style={{ backgroundColor: color ?? '#e5e5e5' }}>
        <Icon className="icon" type={icon ?? 'AppstoreOutlined'} style={{ color: color ?? '#e5e5e5' }} />
      </div>
      <div className="title">{title}</div>
    </div>
  );
};
