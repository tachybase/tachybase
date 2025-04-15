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
import { uid } from '@tachybase/utils/client';

import { LoadingOutlined } from '@ant-design/icons';
import { Card, Divider, notification, Space, Spin } from 'antd';
import { useTranslation } from 'react-i18next';

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

  const resource = useMemo(() => {
    return apiClient.resource('applications');
  }, [apiClient]);

  const handleStart = async () => {
    try {
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
      const response = await resource.start({ filterByTk: record.name });
      if (response?.status === 205) {
        notification.info({
          key: NOTIFICATION_CLIENT_KEY,
          message: t('App is already running'),
        });
      }
    } catch (e) {
      notification.error({
        key: NOTIFICATION_CLIENT_KEY,
        message: t('Failed to start app'),
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
    });
  };

  return (
    <Space split={<Divider type="horizontal" />}>
      <a href={link} target={'_blank'} rel="noreferrer">
        {t('View', { ns: NAMESPACE })}
      </a>
      {record.status !== 'running' && <a onClick={() => handleStart()}>{t('Start', { ns: NAMESPACE })}</a>}
      {record.status === 'running' && <a onClick={() => handleStop()}>{t('Stop', { ns: NAMESPACE })}</a>}
    </Space>
  );
};

// 简单的通知显示处理
const GlobalNotificationHandler = (props) => {
  const { data, mutate, refresh } = useDataBlockRequest<any[]>();
  // 监听通知事件，只处理通知显示部分
  useNoticeSub(NOTIFY_STATUS_EVENT_KEY, (message) => {
    const func = notification[message.level] || notification.info;
    if (message.message) {
      func({
        key: NOTIFICATION_CLIENT_KEY,
        message: message.message,
      });
    } else if (message.status !== 'commanding' && message.status !== 'initializing') {
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
      ...data,
      data: updatedData,
    });
  });
  return null;
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
          uid,
        }}
        components={{ AppVisitor, GlobalNotificationHandler }}
      />
    </Card>
  );
};
