import React, { useState } from 'react';
import { Icon } from '@tachybase/client';

import { useStyles } from './FeatureCard.style';
import { ViewFeatureModal } from './FeatureModal.view';

export const FeatureCard = (props) => {
  const { data } = props;
  const { title, icon, color } = data || {};
  const { styles } = useStyles();
  const [visible, setVisible] = useState(false);
  const handleClick = () => {
    setVisible(true);
  };
  return (
    <>
      <div className={styles.featureCard} onClick={handleClick}>
        <div className="icon-wrapper" style={{ backgroundColor: color ?? '#e5e5e5' }}>
          <Icon className="icon" type={icon ?? 'AppstoreOutlined'} style={{ color: color ?? '#e5e5e5' }} />
        </div>
        <div className="title">{title}</div>
      </div>
      <ViewFeatureModal visible={visible} setVisible={setVisible} workflow={data} />
    </>
  );
};
