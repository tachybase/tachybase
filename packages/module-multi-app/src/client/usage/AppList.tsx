import React, { useCallback, useState } from 'react';
import { MediaCard, RecordProvider, SchemaComponent, useTableBlockContext } from '@tachybase/client';

import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Card, message, Spin } from 'antd';

import { usePluginUtils } from '../locale';
import { useHandle } from '../system/hooks/useHandle';
import { useMultiAppUpdateAction } from '../system/hooks/useMultiAppUpdateAction';
import { useRouteUrl } from '../system/hooks/useRouteUrl';
import { useStartAllAction } from '../system/hooks/useStartAllAction';
import { useStopAllAction } from '../system/hooks/useStopAllAction';
import { appListSchema } from './AppList.schema';
import { useStyles } from './AppList.style';

export const AppList = () => {
  const { t } = usePluginUtils();
  const { styles } = useStyles();
  const contextTableBlock = useTableBlockContext();
  const service = contextTableBlock?.service;
  const { data, loading } = service || {};
  const [appStatus, setAppStatus] = useState(false);

  if (loading) {
    return <Spin />;
  }

  const { data: appList } = data || {};

  return (
    <Card
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
      }}
    >
      <div className={styles.appListStyle}>
        {appList?.map((app) => (
          <AppCard key={app.name} {...app} service={service} appStatus={appStatus} setAppStatus={setAppStatus} />
        ))}
      </div>
    </Card>
  );
};

const AppCard = (props) => {
  const { name, cname, displayName, icon, color, status, service, appStatus, setAppStatus } = props as any;
  const { t } = usePluginUtils();
  const link = useRouteUrl({ name, cname });

  const handleClick = useCallback(() => {
    if (window && status === 'running') {
      window.open(link, '_blank');
    } else {
      message.warning(t('App is not running'));
    }
  }, [cname, status]);

  const { handleStart, handleStop } = useHandle(props);

  const onClick = () => {
    if (status === 'running') {
      handleStop();
    } else {
      handleStart();
    }
    setAppStatus(!appStatus);
    service.refresh();
  };

  return (
    <div className="media-card">
      <RecordProvider record={props}>
        <div className="media-actions">
          <Button icon={status === 'running' ? <StopOutlined /> : <CheckCircleOutlined />} onClick={onClick} />
          <SchemaComponent
            schema={appListSchema}
            scope={{ useMultiAppUpdateAction, useStartAllAction, useStopAllAction }}
          />
        </div>
        <MediaCard
          layout="vertical"
          title={displayName}
          icon={icon}
          color={status === 'running' ? color : undefined}
          needHover={false}
          onClick={handleClick}
        />
      </RecordProvider>
    </div>
  );
};
