import React, { useContext, useState } from 'react';
import { ActionContext, Icon, useActionContext, useTranslation } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { App } from 'antd';

import { useStyles } from './FeatureCard.style';
import { ViewFeatureModal } from './FeatureModal.view';

export const FeatureCard = (props) => {
  const { data } = props;
  const { title, icon, color } = data || {};
  const { styles } = useStyles();
  const [visible, setVisible] = useState(false);
  const { modal } = App.useApp();
  const { t } = useTranslation();
  const handleSetVisible = (visible) => {
    if (!visible) {
      modal.confirm({
        title: t('Unsaved changes'),
        content: t("Are you sure you don't want to save?"),
        async onOk() {
          setVisible?.(false);
        },
      });
    } else {
      setVisible(visible);
    }
  };
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
      <ViewFeatureModal visible={visible} setVisible={handleSetVisible} workflow={data} />
    </>
  );
};
