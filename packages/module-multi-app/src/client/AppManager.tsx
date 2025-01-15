import React, { useMemo } from 'react';
import {
  SchemaComponent,
  useAPIClient,
  useApp,
  useCollectionRecordData,
  useCurrentUserContext,
  useDataBlockRequest,
  useNoticeSub,
} from '@tachybase/client';

import { Card, Divider, notification, Space } from 'antd';

import { NAMESPACE } from '../constants';
import {
  useCreateDatabaseConnectionAction,
  useMultiAppUpdateAction,
  useStartAllAction,
  useStopAllAction,
} from './hooks';
import { schema } from './settings/schemas/applications';
import { usePluginUtils } from './utils';

const useLink = () => {
  const record = useCollectionRecordData();
  const app = useApp();
  if (record.cname) {
    return `//${record.cname}`;
  }
  return app.getRouteUrl(`/apps/${record.name}/admin/`);
};

const AppVisitor = () => {
  const { t } = usePluginUtils();
  const link = useLink();
  const record = useCollectionRecordData();
  const apiClient = useAPIClient();
  const { data, mutate, refresh } = useDataBlockRequest<any[]>();
  const resource = useMemo(() => {
    return apiClient.resource('applications');
  }, [apiClient]);
  const handleStart = () => {
    resource
      .start({ filterByTk: record.name })
      .then(() => {
        refresh();
      })
      .catch((error) => {
        refresh();
      });
  };
  const handleStop = () => {
    resource
      .stop({ filterByTk: record.name })
      .then(() => {
        refresh();
      })
      .catch((error) => {
        refresh();
      });
  };
  useNoticeSub('subAppsChange', (message) => {
    const func = notification[message.level] || notification.info;
    if (message.message) {
      func({
        key: 'subAppsChange',
        message: message.message,
      });
    }
    // 当前records没有则不刷新
    if (!data?.data) {
      refresh();
      return;
    }
    const existItem = data.data.find((v) => v.name === message.app);
    if (!existItem) {
      return;
    } else {
      const updatedData = [...data.data]; // 创建副本
      updatedData.find((v) => v.name === message.app).status = message.status;
      mutate({
        data: updatedData,
      });
    }
  });
  return (
    <Space split={<Divider type="horizontal" />}>
      <a href={link} target={'_blank'} rel="noreferrer">
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
  return (
    <Card bordered={false}>
      <SchemaComponent
        schema={schema}
        scope={{
          admin,
          userId,
          useCreateDatabaseConnectionAction,
          useMultiAppUpdateAction,
          useStartAllAction,
          useStopAllAction,
        }}
        components={{ AppVisitor }}
      />
    </Card>
  );
};
