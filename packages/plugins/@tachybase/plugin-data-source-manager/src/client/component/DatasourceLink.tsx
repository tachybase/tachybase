import React from 'react';
import { useToken } from '@tachybase/client';

import { DatabaseOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from '../locale';

export const DatasourceLink = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useToken();
  return (
    <Tooltip title={t('Data sources')}>
      <Button
        icon={<DatabaseOutlined style={{ color: token.colorTextHeaderMenu }} />}
        title={t('Data sources')}
        onClick={() => {
          navigate('/admin/settings/data-source-manager/main/collections');
        }}
      />
    </Tooltip>
  );
};
