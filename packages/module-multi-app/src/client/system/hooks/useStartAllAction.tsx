import { useDataBlockResource } from '@tachybase/client';

import { LoadingOutlined } from '@ant-design/icons';
import { notification, Spin } from 'antd';

import { NOTIFICATION_CLIENT_KEY } from '../../../constants';
import { usePluginUtils } from '../../locale';

export const useStartAllAction = () => {
  const resource = useDataBlockResource();
  const { t } = usePluginUtils();
  return {
    async onClick() {
      const result = await resource.startAll();
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
      if (result?.data?.data?.all === 0) {
        notification.info({
          key: NOTIFICATION_CLIENT_KEY,
          message: `${t('Start count')}: 0/0!`,
        });
      }
    },
  };
};
