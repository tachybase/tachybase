import { useDataBlockResource } from '@tachybase/client';

import { LoadingOutlined } from '@ant-design/icons';
import { notification, Spin } from 'antd';

import { NOTIFICATION_CLIENT_KEY } from '../../../constants';
import { usePluginUtils } from '../../locale';

export const useStopAllAction = () => {
  const resource = useDataBlockResource();
  const { t } = usePluginUtils();
  return {
    async onClick() {
      const result = await resource.stopAll();
      if (result?.data?.data?.all === 0) {
        notification.info({
          key: NOTIFICATION_CLIENT_KEY,
          message: `${t('Stop count')}: 0/0!`,
        });
        return;
      }
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
    },
  };
};
