import { useCallback } from 'react';
import { MediaCard, useTableBlockContext } from '@tachybase/client';

import { Card, message, Spin } from 'antd';

import { usePluginUtils } from '../locale';
import { useStyles } from './AppList.style';

export const AppList = () => {
  const { t } = usePluginUtils();
  const { styles } = useStyles();
  const contextTableBlock = useTableBlockContext();
  const service = contextTableBlock?.service;
  const { data, loading } = service || {};

  if (loading) {
    return <Spin />;
  }

  const { data: appList } = data || {};

  return (
    <Card
      title={t('Multi-app display')}
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
      }}
    >
      <div className={styles.appListStyle}>{appList?.map((app) => <AppCard key={app.name} {...app} />)}</div>
    </Card>
  );
};

const AppCard = (props) => {
  const { cname, displayName, icon, color, status } = props;
  const { t } = usePluginUtils();

  const handleClick = useCallback(() => {
    if (window && status === 'running') {
      window.open(`https://${cname}`, '_blank');
    } else {
      message.warning(t('App is not running'));
    }
  }, [cname, status]);

  return (
    <MediaCard
      layout="vertical"
      title={displayName}
      icon={icon}
      color={status === 'running' ? color : undefined}
      needHover={false}
      onClick={handleClick}
    />
  );
};
