import React from 'react';
import { Icon, useToken } from '@tachybase/client';

import { Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from '../locale';

export const CloudComponentLink = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useToken();
  return (
    <Tooltip title={t('Cloud Component')}>
      <Button
        icon={<Icon type="deploymentunitoutlined" style={{ color: token.colorTextHeaderMenu }} />}
        title={t('Cloud Component')}
        onClick={() => {
          navigate('/admin/settings/cloud-component');
        }}
      />
    </Tooltip>
  );
};
