import React, { useMemo } from 'react';
import {
  SchemaComponent,
  useAPIClient,
  useApp,
  useCurrentUserContext,
  useRecord,
  useResourceActionContext,
} from '@tachybase/client';

import { Card, Divider, Space } from 'antd';

import { NAMESPACE } from '../constants';
import { schema } from './settings/schemas/applications';
import { usePluginUtils } from './utils';

const useLink = () => {
  const record = useRecord();
  const app = useApp();
  if (record.cname) {
    return `//${record.cname}`;
  }
  return app.getRouteUrl(`/apps/${record.name}/admin/`);
};

const AppVisitor = () => {
  const { t } = usePluginUtils();
  const link = useLink();
  const record = useRecord();
  const apiClient = useAPIClient();
  const { refresh } = useResourceActionContext();
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
      <SchemaComponent schema={schema} scope={{ admin, userId }} components={{ AppVisitor }} />
    </Card>
  );
};
