import { useMemo } from 'react';
import { useAPIClient } from '@tachybase/client';

import { LoadingOutlined } from '@ant-design/icons';
import { notification, Spin } from 'antd';

import { NOTIFICATION_CLIENT_KEY } from '../../../constants';
import { usePluginUtils } from '../../locale';

export const useHandle = (record) => {
  const { t } = usePluginUtils();
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

  return {
    handleStart,
    handleStop,
  };
};
