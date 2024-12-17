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
    <Tooltip title={t('Collections')}>
      <Button
        icon={<DatabaseOutlined style={{ color: token.colorTextHeaderMenu }} />}
        title={t('Collections')}
        onClick={() => {
          navigate('/_admin/data-modeling/collections');
        }}
      />
    </Tooltip>
  );
};
