import { useMemo } from 'react';
import {
  SchemaComponent,
  useAPIClient,
  useApp,
  useCollectionRecordData,
  useCurrentUserContext,
  useDataBlockRequest,
  useNoticeSub,
} from '@tachybase/client';

import { LoadingOutlined } from '@ant-design/icons';
import { Card, Divider, notification, Space, Spin } from 'antd';
import { useTranslation } from 'react-i18next';

import { TrackingEventType } from '../../../../module-instrumentation/src/client/CustomInstrumentation';
import { NAMESPACE, NOTIFICATION_CLIENT_KEY, NOTIFY_STATUS_EVENT_KEY } from '../../constants';
import { usePluginUtils } from '../locale';
import { schemaAppManager } from './AppManager.schema';
import { useCreateDatabaseConnectionAction } from './hooks/useCreateDatabaseConnectionAction';
import { useMultiAppUpdateAction } from './hooks/useMultiAppUpdateAction';
import { useRouteUrl } from './hooks/useRouteUrl';
import { useStartAllAction } from './hooks/useStartAllAction';
import { useStopAllAction } from './hooks/useStopAllAction';

const useLink = () => {
  const record = useCollectionRecordData();
  const url = useRouteUrl({ name: record.name, cname: record.cname });
  return url;
};

const AppVisitor = () => {
  const { t } = usePluginUtils();
  const link = useLink();
  const record = useCollectionRecordData();
  const apiClient = useAPIClient();
  const { data, mutate, refresh } = useDataBlockRequest<any[]>();
  const currentUserContext = useCurrentUserContext();
  const currentUser = currentUserContext?.data?.data;
  const app = useApp();
  const resource = useMemo(() => {
    return apiClient.resource('applications');
  }, [apiClient]);
  const handleStart = async () => {
    try {
      const response = await resource.start({ filterByTk: record.name });
      if (response?.status === 205) {
        notification.info({
          key: NOTIFICATION_CLIENT_KEY,
          message: t('App is already running'),
        });
      } else {
        notification.info({
          key: NOTIFICATION_CLIENT_KEY,
          message: (
            <span>
              {t('Processing...')} &nbsp; &nbsp;
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </span>
          ),
          duration: 0,
        });
      }
      app.trackingManager.logEvent(TrackingEventType.CLICK, 'multiapp_start', {
        UserId: currentUser.id,
        appName: record.name,
      });
    } catch (e) {
      notification.error({
        message: t('Failed to start app'),
      });
      app.trackingManager.logEvent(TrackingEventType.CLICK, 'multiapp_start_error', {
        UserId: currentUser.id,
        appName: record.name,
        error_status: e.status,
        error_message: e.response.data,
      });
    }
  };
  const handleStop = () => {
    resource.stop({ filterByTk: record.name }).then(() => {
      notification.info({
        key: NOTIFICATION_CLIENT_KEY,
        message: (
          <span>
            {t('Processing...')} &nbsp; &nbsp;
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </span>
        ),
        duration: 0,
      });
      app.trackingManager.logEvent(TrackingEventType.CLICK, 'multiapp_stop', {
        UserId: currentUser.id,
        appName: record.name,
      });
    });
  };
  useNoticeSub(NOTIFY_STATUS_EVENT_KEY, (message) => {
    const func = notification[message.level] || notification.info;
    if (message.message) {
      func({
        key: NOTIFICATION_CLIENT_KEY,
        message: message.message,
      });
    } else if (message.status !== 'commanding') {
      notification.destroy(NOTIFICATION_CLIENT_KEY);
    }
    // 当前records没有则不刷新
    if (!data?.data || message.refresh) {
      refresh();
      return;
    }
    if (!message.app && !message.status) {
      return;
    }
    const existItem = data.data.some((v) => v.name === message.app);
    if (!existItem) {
      return;
    }
    const updatedData = [...data.data]; // 创建副本
    updatedData.find((v) => v.name === message.app).status = message.status;
    mutate({
      data: updatedData,
    });
  });
  return (
    <Space split={<Divider type="horizontal" />}>
      <a
        onClick={() => {
          // 埋点逻辑
          app.trackingManager.logEvent(TrackingEventType.CLICK, 'multiapp_linkView', {
            link,
            UserId: currentUser.id,
            appName: record.name,
          });
          window.open(link, '_blank', 'noreferrer');
        }}
      >
        {t('View', { ns: NAMESPACE })}
      </a>
      <a onClick={() => handleStart()}>{t('Start', { ns: NAMESPACE })}</a>
      <a onClick={() => handleStop()}>{t('Stop', { ns: NAMESPACE })}</a>
    </Space>
  );
};

export const AppManager = (props) => {
  const { admin = true } = props;
  const currentUser = useCurrentUserContext();
  const userId = currentUser?.data?.data?.id;
  const { t } = useTranslation([NAMESPACE, 'core'], { nsMode: 'fallback' });
  return (
    <Card bordered={false}>
      <SchemaComponent
        schema={schemaAppManager}
        scope={{
          admin,
          userId,
          useCreateDatabaseConnectionAction,
          useMultiAppUpdateAction,
          useStartAllAction,
          useStopAllAction,
          t,
        }}
        components={{ AppVisitor }}
      />
    </Card>
  );
};
